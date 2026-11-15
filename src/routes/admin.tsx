import { createFileRoute } from "@tanstack/react-router";
import Admin from "@/components/pages/Admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "后台管理 | 世界瑰宝艺术协会" },
      { name: "description", content: "管理账号、瑰宝展示、协会介绍、新闻动态及联系方式。" },
      { property: "og:title", content: "后台管理 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "管理账号、瑰宝展示、协会介绍、新闻动态及联系方式。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});
