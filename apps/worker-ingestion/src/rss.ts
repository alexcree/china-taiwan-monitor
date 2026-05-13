import Parser from "rss-parser";

export interface RssItem {
  url: string;
  title: string;
  summary: string | null;
  published_at: string | null;
}

const parser: Parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "CTM-Monitor/0.1 (+https://github.com/alexcree/china-taiwan-monitor)",
    Accept:
      "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.5",
  },
});

/**
 * Fetch and parse an RSS/Atom feed. Returns a normalized list of items.
 * Throws on transport/parse failure; caller decides retry policy.
 */
export async function fetchFeed(feedUrl: string): Promise<RssItem[]> {
  const feed = await parser.parseURL(feedUrl);
  const items: RssItem[] = [];
  for (const item of feed.items ?? []) {
    const url = item.link?.trim();
    const title = (item.title ?? "").trim();
    if (!url || !title) continue;

    // rss-parser sometimes parses pubDate strings into Date; coerce both.
    const isoDate =
      (item as { isoDate?: string }).isoDate ??
      (item.pubDate ? new Date(item.pubDate).toISOString() : null);

    const summary = item.contentSnippet ?? item.content ?? item.summary ?? null;

    items.push({
      url,
      title,
      summary: summary ? summary.toString().slice(0, 2000) : null,
      published_at: isoDate,
    });
  }
  return items;
}
