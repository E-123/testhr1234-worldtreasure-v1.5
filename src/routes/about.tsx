import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于协会 | 世界瑰宝艺术协会" },
      { name: "description", content: "协会历史、组织架构与法律资质。" },
      { property: "og:title", content: "关于协会 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "协会历史、组织架构与法律资质。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});
