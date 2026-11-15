import { createFileRoute } from "@tanstack/react-router";
import Home from "@/components/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "世界瑰宝艺术协会 | World Treasure Art Association" },
      { name: "description", content: "1993年创立于巴黎的国际非营利艺术组织，守护、研究与传播世界艺术瑰宝。" },
      { property: "og:title", content: "世界瑰宝艺术协会 | World Treasure Art Association" },
      { property: "og:description", content: "1993年创立于巴黎的国际非营利艺术组织，守护、研究与传播世界艺术瑰宝。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
