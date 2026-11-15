// @ts-nocheck
import React, { useState } from "react";
import { useLang } from "@/lib/i18n";
import { useNews } from "@/lib/external-content";
import PageHero from "@/components/common/PageHero";
import NewsCard from "@/components/common/NewsCard";
import Reveal from "@/components/common/Reveal";


export default function News() {
const { t, lang } = useLang();
const NEWS = useNews();
const EXTRA = [...NEWS, ...NEWS.map((n) => ({ ...n, id: `${n.id}-r` }))];
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const catKey = (n) => n.cat.zh || n.cat.en || n.cat.fr;
const cats = ["all", ...Array.from(new Set(EXTRA.map(catKey).filter(Boolean)))];
const catLabel = (c) => c === "all" ? L("全部", "All", "Tout") : (EXTRA.find((n) => catKey(n) === c)?.cat[lang] || c);
const [filter, setFilter] = useState("all");
const list = filter === "all" ? EXTRA : EXTRA.filter((n) => catKey(n) === filter);

return (
<>
<PageHero zh="闻" hideSeal title={t("latestNews")} subtitle={L("协会动态、展览预告、学术资讯与媒体报道。", "Association updates, exhibitions, scholarship and media coverage.", "Actualités, expositions et couverture médiatique.")} />
<section className="py-16 px-[6vw]">
<div className="flex flex-wrap gap-3 mb-12">
{cats.map((c) => (
<button
key={c}
onClick={() => setFilter(c)}
className={`px-5 py-2 text-sm tracking-wide rounded-sm border transition-colors ${
filter === c ? "bg-[#8B0000] text-[#FDFCF0] border-[#8B0000]" : "border-[#B8934E]/40 text-[#1A1A1A]/70 hover:border-[#B8934E]"
}`}
>
{catLabel(c)}
</button>
))}
</div>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
{list.map((n, i) => (
<Reveal key={n.id} delay={(i % 3) * 0.1}><NewsCard item={n} /></Reveal>
))}
</div>
</section>
</>
);
}
