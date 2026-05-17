import {
  PRIMARY_TOPIC_PATHS,
  PRIMARY_TOPICS,
  type PrimaryTopic,
} from "@ctm/brief-schema";
import {
  getAnonClient,
  isDbConfigured,
  listArticlesForTopic,
  type ArticleWithSource,
} from "@ctm/db";

const PATH_TO_TOPIC: Record<string, PrimaryTopic> = (() => {
  const m: Record<string, PrimaryTopic> = {};
  for (const t of PRIMARY_TOPICS) {
    m[PRIMARY_TOPIC_PATHS[t]] = t;
  }
  return m;
})();

export function topicFromPath(path: string): PrimaryTopic | null {
  return PATH_TO_TOPIC[path] ?? null;
}

export interface TopicPageData {
  articles: ArticleWithSource[];
  source: "live" | "empty";
}

export async function getTopicData(topic: PrimaryTopic): Promise<TopicPageData> {
  if (!isDbConfigured()) return { articles: [], source: "empty" };
  const client = getAnonClient();
  if (!client) return { articles: [], source: "empty" };
  try {
    const articles = await listArticlesForTopic(client, topic, {
      sinceHours: 72,
      limit: 200,
    });
    return { articles, source: "live" };
  } catch (err) {
    console.warn(
      `[topic:${topic}] live read failed:`,
      err instanceof Error ? err.message : err,
    );
    return { articles: [], source: "empty" };
  }
}
