// @ts-nocheck
import React from "react";
import { ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function ArtCard({ item, className = "" }) {
const { lang, t } = useLang();
const tags = item.tags?.[lang]?.length ? item.tags[lang] : item.tags?.zh || [];
const description = item.description?.[lang] || item.description?.zh || "";
return (
<div tabIndex={0} className={`group relative overflow-hidden bg-[#1A1A1A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8934E] ${className}`}>
<img
src={item.img}
alt={`${item.title.en} — ${item.dynasty.en}`}
className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 wt-img-glow"
loading="lazy"
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
<div className="absolute top-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
{tags.length > 0 ? tags.map((tag) => (
<span key={tag} className="bg-[#FDFCF0]/90 text-[#8B0000] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm">{tag}</span>
)) : (
<span className="flex items-center gap-1.5 bg-[#FDFCF0]/90 text-[#8B0000] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm"><ShieldCheck size={12} /> {t("inquire")}</span>
)}
</div>
{description && (
<div className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-sm border border-[#B8934E]/40 bg-[#1A1A1A]/95 p-4 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
<p className="text-sm leading-relaxed text-[#FDFCF0]">{description}</p>
</div>
)}
<div className="absolute bottom-0 left-0 right-0 p-5">
<span className="text-[#B8934E] text-[11px] tracking-[0.2em] uppercase">{item.dynasty[lang]} · {item.cat[lang]}</span>
<h3 className="font-serif-disp text-[#FDFCF0] text-xl mt-1 leading-snug">{item.title[lang]}</h3>
</div>
</div>
);
}