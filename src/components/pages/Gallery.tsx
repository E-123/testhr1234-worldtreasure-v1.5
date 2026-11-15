// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { externalSupabase as supabase } from "@/lib/external-supabase";
import PageHero from "@/components/common/PageHero";
import ArtCard from "@/components/common/ArtCard";
import Reveal from "@/components/common/Reveal";
import { Loader2 } from "lucide-react";

const SPANS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[3/4]"];

export default function Gallery() {
const { t, lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState("all");

useEffect(() => {
let alive = true;
supabase.from("treasures").select("*").order("order").limit(200)
.then(({ data }) => {
if (!alive) return;
const rows = data || [];
setItems(rows.map((r) => ({
id: r.id,
img: r.image_url,
title: { zh: r.title_zh, en: r.title_en || r.title_zh, fr: r.title_fr || r.title_zh },
dynasty: { zh: r.dynasty_zh, en: r.dynasty_en || r.dynasty_zh, fr: r.dynasty_fr || r.dynasty_zh },
cat: { zh: r.cat_zh, en: r.cat_en || r.cat_zh, fr: r.cat_fr || r.cat_zh },
description: { zh: r.description_zh || "", en: r.description_en || r.description_zh || "", fr: r.description_fr || r.description_zh || "" },
tags: { zh: r.tags_zh || [], en: r.tags_en?.length ? r.tags_en : r.tags_zh || [], fr: r.tags_fr?.length ? r.tags_fr : r.tags_zh || [] },
})));
})
.finally(() => { if (alive) setLoading(false); });
return () => { alive = false; };
}, []);

const cats = ["all", ...new Set(items.map((x) => x.cat.zh).filter(Boolean))];
const list = filter === "all" ? items : items.filter((x) => x.cat.zh === filter);
const catLabel = (c) => items.find((x) => x.cat.zh === c)?.cat[lang] || c;

return (
<>
<PageHero zh="瑰" hideSeal title={t("featuredTreasures")} subtitle={L("高清图库 · 专家团认证 · 数字典藏", "High-resolution archive · Expert authentication · Digital collection", "Archive haute résolution · Authentification d'experts")} />
<section className="py-16 px-[6vw]">
<div className="flex flex-wrap gap-3 mb-12">
{cats.map((c) => (
<button
key={c}
onClick={() => setFilter(c)}
className={`px-5 py-2 text-sm rounded-sm border transition-colors ${
filter === c ? "bg-[#8B0000] text-[#FDFCF0] border-[#8B0000]" : "border-[#B8934E]/40 text-[#1A1A1A]/70 hover:border-[#B8934E]"
}`}
>
{c === "all" ? L("全部", "All", "Tout") : catLabel(c)}
</button>
))}
</div>
{loading ? (
<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#B8934E]" /></div>
) : list.length === 0 ? (
<p className="text-center text-[#1A1A1A]/50 py-16">{L("暂无瑰宝展示。", "No treasures yet.", "Aucun trésor pour l'instant.")}</p>
) : (
<div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
{list.map((item, i) => (
<Reveal key={item.id} delay={(i % 3) * 0.08}>
<ArtCard item={item} className={`${SPANS[i % SPANS.length]} rounded-sm break-inside-avoid`} />
</Reveal>
))}
</div>
)}
</section>
</>
);
}
