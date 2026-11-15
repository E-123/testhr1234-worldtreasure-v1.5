// @ts-nocheck
import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useTreasures } from "@/lib/external-content";
import SectionHeading from "../common/SectionHeading";

export default function TreasuresPreview() {
const { t } = useLang();
const { lang } = useLang();
const TREASURES = useTreasures();
const tagsFor = (item) => item.tags?.[lang]?.length ? item.tags[lang] : item.tags?.zh || [];
return (
<section className="py-24 bg-[#1A1A1A]">
<div className="px-[6vw] flex items-end justify-between gap-6 mb-10">
<SectionHeading kicker="Treasure Vault" title={t("featuredTreasures")} light />
<Link to="/gallery" className="hidden sm:flex items-center gap-2 text-sm text-[#B8934E] tracking-widest uppercase hover:gap-3 transition-all">
{t("viewAll")} <ArrowRight size={15} />
</Link>
</div>
<div className="flex gap-5 overflow-x-auto px-[6vw] pb-4 snap-x" style={{ scrollbarWidth: "thin" }}>
{TREASURES.map((item) => (
<Link
to="/gallery"
key={item.id}
className="group relative shrink-0 w-[280px] md:w-[340px] aspect-[3/4] overflow-hidden rounded-sm snap-start"
>
<img
src={item.img}
alt={`${item.title.en} — ${item.dynasty.en}`}
className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
loading="lazy"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
<div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
{tagsFor(item).map((tag) => <span key={tag} className="bg-[#FDFCF0]/90 text-[#8B0000] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm">{tag}</span>)}
</div>
{(item.description?.[lang] || item.description?.zh) && (
<div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-sm border border-[#B8934E]/40 bg-[#1A1A1A]/95 p-4 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
<p className="text-sm leading-relaxed text-[#FDFCF0]">{item.description?.[lang] || item.description?.zh}</p>
</div>
)}
<div className="absolute bottom-0 p-5">
<span className="text-[#B8934E] text-[11px] tracking-[0.2em] uppercase">{item.dynasty[lang]}</span>
<h3 className="font-serif-disp text-[#FDFCF0] text-xl mt-1">{item.title[lang]}</h3>
</div>
</Link>
))}
</div>
</section>
);
}
