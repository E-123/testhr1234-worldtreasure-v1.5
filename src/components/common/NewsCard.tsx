// @ts-nocheck
import React from "react";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function NewsCard({ item }) {
const { lang } = useLang();
return (
<article className="group bg-[#FDFCF0] border border-[#B8934E]/20 rounded-sm overflow-hidden hover:border-[#B8934E] transition-colors">
<div className="overflow-hidden aspect-[4/3]">
<img
src={item.img}
alt={item.title.en}
className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
loading="lazy"
/>
</div>
<div className="p-6">
<div className="flex items-center gap-3 text-xs text-[#B8934E] tracking-wider uppercase mb-3">
<span>{item.cat[lang]}</span>
<span className="w-1 h-1 rounded-full bg-[#B8934E]/50" />
<span className="text-[#1A1A1A]/40">{item.date}</span>
</div>
<h3 className="font-serif-disp text-xl text-[#1A1A1A] leading-snug group-hover:text-[#8B0000] transition-colors">
{item.title[lang]}
</h3>
<p className="text-sm text-[#1A1A1A]/60 mt-3 leading-relaxed line-clamp-2">{item.excerpt[lang]}</p>
<div className="mt-4 flex items-center gap-1.5 text-sm text-[#8B0000] opacity-0 group-hover:opacity-100 transition-opacity">
<ArrowRight size={14} />
</div>
</div>
</article>
);
}