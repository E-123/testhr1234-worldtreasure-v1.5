import { createFileRoute } from "@tanstack/react-router";
import News from "@/components/pages/News";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "新闻动态 | 世界瑰宝艺术协会" },
      { name: "description", content: "协会动态、展览预告、学术论坛与媒体报道。" },
      { property: "og:title", content: "新闻动态 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "协会动态、展览预告、学术论坛与媒体报道。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: News,
});
