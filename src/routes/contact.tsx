import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "联系我们 | 世界瑰宝艺术协会" },
      { name: "description", content: "巴黎总部联系方式、常见问题与在线留言。" },
      { property: "og:title", content: "联系我们 | 世界瑰宝艺术协会" },
      { property: "og:description", content: "巴黎总部联系方式、常见问题与在线留言。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});
