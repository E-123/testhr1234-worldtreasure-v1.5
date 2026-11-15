import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContentManager from "@/components/admin/ContentManager";

const { rpc, from } = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn() }));
vi.mock("@/lib/external-supabase", () => ({ externalSupabase: { rpc, from } }));
vi.mock("@/lib/auth", () => ({ getAdminToken: () => "validated-session", adminStorage: vi.fn() }));
vi.mock("@/lib/i18n", async importOriginal => ({ ...await importOriginal<object>(), useLang: () => ({ lang: "zh" }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("administrator content saves", () => {
  for (const [kind, table, row] of [
    ["about", "association_content", { id: "association-id", section_key: "mission", content_zh: { body: "原中文" }, content_en: { body: "Original English" }, content_fr: { body: "Français original" }, display_order: 1 }],
    ["news", "news_items", { id: "news-id", title_zh: "新闻", title_en: "News", title_fr: "Actualité", body_zh: "原中文", body_en: "Original English", body_fr: "Français original", publication_date: "2026-11-14", homepage_featured: true, display_order: 2 }],
    ["contact", "contact_content", { id: "contact-id", section_key: "contact", content_zh: { body: "原中文" }, content_en: { body: "Original English" }, content_fr: { body: "Français original" }, display_order: 0 }],
  ] as const) {
    it(`saves ${kind} to its own table with all original languages and session`, async () => {
      from.mockReturnValue({ select: () => ({ order: async () => ({ data: [row], error: null }) }) });
      rpc.mockResolvedValue({ error: null });
      render(<ContentManager kind={kind} />);
      const edits = await screen.findAllByRole("button", { name: "编辑" });
      const edit = edits[kind === "about" ? 1 : 0] || edits[0];
      if (!edit) throw new Error("Missing edit action");
      fireEvent.click(edit);
      const textarea = screen.getAllByRole("textbox").find(el => el.tagName === "TEXTAREA");
      if (!textarea) throw new Error("Missing content field");
      fireEvent.change(textarea, { target: { value: "修改中文" } });
      fireEvent.click(screen.getByRole("button", { name: "保存" }));
      await waitFor(() => expect(rpc).toHaveBeenCalledWith("admin_save_content", expect.objectContaining({ p_token: "validated-session", p_table: table, p_id: row.id, p: expect.objectContaining(kind === "news" ? { body_zh: "原中文", body_en: "Original English", body_fr: "Français original" } : { content_zh: { body: "修改中文" }, content_en: { body: "Original English" }, content_fr: { body: "Français original" } }) })));
    });
  }
});