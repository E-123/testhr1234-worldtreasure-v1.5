import { createFileRoute } from "@tanstack/react-router";
import Gallery from "@/components/pages/Gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "瑰宝展示 | 世界瑰宝艺术协会" },
      { name: "description", content: "高清图库 · 专家团认证 · 数字典藏。" },
      { property: "og:title", content: "瑰宝展示 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "高清图库 · 专家团认证 · 数字典藏。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Gallery,
});
