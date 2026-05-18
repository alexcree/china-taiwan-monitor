/**
 * Lexical multi-source story clustering.
 *
 * Goal: identify groups of articles covering the same underlying story
 * across different outlets. Cluster size is then the popularity / world-
 * relevance signal — a Trump-Xi summit broken by 12 outlets clusters into
 * size 12, while a one-off think-tank commentary stays a singleton.
 *
 * Approach: greedy TF-IDF + cosine. Tokenize the article's English
 * summary (which the Claude summarizer produces for every article,
 * including Chinese-source ones), compute IDF over the corpus, build
 * unit-normalized sparse vectors, and assign each article to its closest
 * existing cluster center if cosine ≥ THRESHOLD, otherwise start a new
 * cluster. Cluster centers are running averages.
 *
 * No external dependencies. ~50ms for ~1000 articles in Node 22.
 *
 * Limits: lexical-only — paraphrases and translations into different
 * vocabulary can miss. Phase 4 upgrade path: replace with embedding
 * cosine using a hosted embedding API (Voyage, OpenAI, etc.) for the
 * same interface.
 */

const STOPWORDS = new Set<string>([
  "the","and","for","are","was","were","with","this","that","from","its",
  "will","have","has","had","his","her","their","they","them","what","when",
  "said","says","tell","told","after","before","during","since","while","also",
  "but","not","one","two","all","any","some","more","most","such","than",
  "would","could","should","into","over","under","above","below","there",
  "here","then","very","much","many","each","every","both","other","another",
  "about","across","along","among","around","through","throughout","without",
  "between","within","because","though","although","despite","whether","either",
  "neither","amid","amidst","upon","ago","still","yet","just","only","even",
  "well","like","unlike","year","years","day","days","week","weeks","month",
  "months","time","times","new","old","first","second","third","last","next",
  "according","including","amongst","via","per",
]);

export interface ClusterInput {
  /** Stable identifier. */
  id: string;
  /** Text to cluster on (English summary preferred over title). */
  text: string;
  /** Tie-breaker for cluster-anchor ordering. Falsy = bottom. */
  weight?: number;
}

export interface ClusterAssignment {
  /** articleId → clusterId */
  clusterOf: Map<string, string>;
  /** clusterId → articleIds[] */
  members: Map<string, string[]>;
  /** articleId → cluster_size (== members of its cluster) */
  sizeOf: Map<string, number>;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // strip non-letter/number with whitespace; keeps CJK chars intact too
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function dot(a: Map<string, number>, b: Map<string, number>): number {
  let s = 0;
  // iterate over the smaller map
  const [smaller, larger] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of smaller) {
    const v2 = larger.get(k);
    if (v2) s += v * v2;
  }
  return s;
}

function normalize(v: Map<string, number>): Map<string, number> {
  let sq = 0;
  for (const w of v.values()) sq += w * w;
  const norm = Math.sqrt(sq) || 1;
  if (norm === 1) return v;
  for (const [k, w] of v) v.set(k, w / norm);
  return v;
}

/**
 * Cluster a set of articles. Threshold ~0.40-0.55 yields good results on
 * our corpus; default 0.45 errs slightly toward over-clustering (good
 * for popularity ranking, since cluster size is what we sort by).
 */
export function clusterArticles(
  articles: readonly ClusterInput[],
  opts: { threshold?: number } = {},
): ClusterAssignment {
  const threshold = opts.threshold ?? 0.45;
  const clusterOf = new Map<string, string>();
  const members = new Map<string, string[]>();
  const sizeOf = new Map<string, number>();

  if (articles.length === 0)
    return { clusterOf, members, sizeOf };

  const tokens = new Map<string, string[]>();
  for (const a of articles) tokens.set(a.id, tokenize(a.text));

  // IDF over the corpus.
  const df = new Map<string, number>();
  for (const toks of tokens.values()) {
    const seen = new Set<string>(toks);
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const N = articles.length;
  const idf = new Map<string, number>();
  for (const [t, c] of df) {
    // smoothed idf — keeps very common tokens from dominating
    idf.set(t, Math.log((N + 1) / (c + 1)) + 1);
  }

  function vec(id: string): Map<string, number> {
    const toks = tokens.get(id) ?? [];
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    const v = new Map<string, number>();
    for (const [t, c] of tf) {
      const w = (idf.get(t) ?? 0) * c;
      if (w > 0) v.set(t, w);
    }
    return normalize(v);
  }

  const vectors = new Map<string, Map<string, number>>();
  for (const a of articles) vectors.set(a.id, vec(a.id));

  // Iterate by weight desc, then by input order — heavier articles
  // (e.g., newer or higher-priority) seed clusters before lighter ones.
  const ordered = [...articles].sort(
    (a, b) => (b.weight ?? 0) - (a.weight ?? 0),
  );

  const centers = new Map<string, Map<string, number>>();
  const counts = new Map<string, number>();

  for (const a of ordered) {
    const v = vectors.get(a.id)!;
    if (v.size === 0) {
      // No usable tokens — treat as its own singleton cluster.
      clusterOf.set(a.id, a.id);
      members.set(a.id, [a.id]);
      centers.set(a.id, v);
      counts.set(a.id, 1);
      continue;
    }

    let bestId: string | null = null;
    let bestSim = 0;
    for (const [cid, c] of centers) {
      const sim = dot(v, c);
      if (sim > bestSim) {
        bestSim = sim;
        bestId = cid;
      }
    }

    if (bestId && bestSim >= threshold) {
      const c = centers.get(bestId)!;
      const n = counts.get(bestId)!;
      // running average: new center = (c*n + v) / (n+1), then renormalize
      const newCenter = new Map<string, number>();
      for (const [k, w] of c) newCenter.set(k, (w * n) / (n + 1));
      for (const [k, w] of v) {
        newCenter.set(k, (newCenter.get(k) ?? 0) + w / (n + 1));
      }
      centers.set(bestId, normalize(newCenter));
      counts.set(bestId, n + 1);
      clusterOf.set(a.id, bestId);
      const m = members.get(bestId) ?? [];
      m.push(a.id);
      members.set(bestId, m);
    } else {
      clusterOf.set(a.id, a.id);
      members.set(a.id, [a.id]);
      centers.set(a.id, v);
      counts.set(a.id, 1);
    }
  }

  for (const [cid, m] of members) {
    for (const aid of m) sizeOf.set(aid, m.length);
    void cid;
  }

  return { clusterOf, members, sizeOf };
}
