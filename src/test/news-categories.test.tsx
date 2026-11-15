import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import News from "@/components/pages/News";

const { useNews } = vi.hoisted(() => ({ useNews: vi.fn() }));
vi.mock("@/lib/external-content", () => ({ useNews }));
vi.mock("@/lib/i18n", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useLang: () => ({ lang: "zh", t: (key: string) => key }),
}));

const item = (id: number, cat: string, title: string) => ({
  id,
  img: "/images/hero-vase.jpg",
  date: "2026-10-18",
  cat: { zh: cat, en: cat, fr: cat },
  title: { zh: title, en: title, fr: title },
  excerpt: { zh: "摘要", en: "Excerpt", fr: "Résumé" },
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("news category buttons", () => {
  it("offers exactly one button per category present in the news list", async () => {
    useNews.mockReturnValue([
      item(1, "展览预告", "特展开幕"),
      item(2, "学术论坛", "鉴定论坛"),
      item(3, "协会动态", "章程修订"),
      item(4, "媒体报道", "媒体报道"),
    ]);
    render(<News />);

    const buttons = screen.getAllByRole("button").map((b) => b.textContent);
    expect(buttons).toEqual(["全部", "展览预告", "学术论坛", "协会动态", "媒体报道"]);

    fireEvent.click(screen.getByRole("button", { name: "媒体报道" }));
    await waitFor(() => expect(screen.queryByText("特展开幕")).toBeNull());
    expect(screen.getAllByText("媒体报道").length).toBeGreaterThan(0);
  });
});
