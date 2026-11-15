// Reads site content from the external database, falling back to the bundled content.
import { useEffect, useState } from "react";
import { externalSupabase } from "@/lib/external-supabase";
import { NEWS, TREASURES } from "@/lib/content";
import { ABOUT_DEFAULTS, CONTACT_DEFAULTS } from "@/lib/admin-content";

const l3 = (r: any, k: string) => ({ zh: r[`${k}_zh`], en: r[`${k}_en`] || r[`${k}_zh`], fr: r[`${k}_fr`] || r[`${k}_zh`] });
const tags3 = (r: any) => ({ zh: r.tags_zh || [], en: r.tags_en?.length ? r.tags_en : r.tags_zh || [], fr: r.tags_fr?.length ? r.tags_fr : r.tags_zh || [] });

function useRows<T>(fallback: T, load: () => PromiseLike<T | null>) {
  const [data, setData] = useState<T>(fallback);
  useEffect(() => {
    let alive = true;
    Promise.resolve(load()).then((d) => { if (alive && d) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return data;
}

export function useNews(featuredOnly = false) {
  return useRows(NEWS, async () => {
    let q = externalSupabase.from("news_items").select("*").order("display_order");
    if (featuredOnly) q = q.eq("homepage_featured", true);
    const { data } = await q;
    if (!data) return null;
    return data.map((r: any) => ({ id: r.legacy_id ?? r.id, img: r.image_url, date: r.publication_date, cat: l3(r, "cat"), title: l3(r, "title"), excerpt: l3(r, "excerpt") }));
  });
}

export function useTreasures() {
  return useRows(TREASURES as any[], async () => {
    const { data } = await externalSupabase.from("treasures").select("*").order("order").limit(200);
    if (!data?.length) return null;
    return data.map((r: any) => ({ id: r.id, img: r.image_url, title: l3(r, "title"), dynasty: l3(r, "dynasty"), cat: l3(r, "cat"), description: l3(r, "description"), tags: tags3(r) }));
  });
}

export function useAboutSections() {
  return useRows<Record<string, any> | null>(null, async () => {
    const { data } = await externalSupabase.from("association_content").select("*").order("display_order");
    if (!data) return null;
    const merged = ABOUT_DEFAULTS.map(row => data.find((r: any) => r.section_key === row["section_key"]) || row);
    return Object.fromEntries(merged.map((r: any) => [r.section_key, { zh: r.content_zh, en: r.content_en, fr: r.content_fr, image_url: r.image_url }]));
  });
}

export function useContactContent() {
  return useRows(CONTACT_DEFAULTS[0], async () => {
    const { data } = await externalSupabase.from("contact_content").select("*").eq("section_key", "contact").maybeSingle();
    return data || null;
  });
}
