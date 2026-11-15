// @ts-nocheck
import React from "react";
import Seal from "../layout/Seal";

export default function PageHero({ title, subtitle, zh, hideSeal }) {
return (
<section className="relative pt-36 pb-16 px-[6vw] overflow-hidden bg-[#1A1A1A]">
{zh && (
<span className="pointer-events-none absolute -right-4 top-20 font-zh-serif text-[clamp(8rem,22vw,20rem)] leading-none text-[#FDFCF0]/[0.04] select-none">
{zh}
</span>
)}
<div className="relative max-w-4xl">
{!hideSeal && (
<div className="flex items-center gap-3 mb-5">
<Seal size={36} />
<span className="w-12 h-px bg-[#B8934E]" />
</div>
)}
<h1 className="font-serif-disp font-semibold text-[#FDFCF0] text-[clamp(2.4rem,5vw,4.5rem)] leading-tight">
{title}
</h1>
{subtitle && <p className="mt-4 text-[#FDFCF0]/60 max-w-2xl leading-relaxed">{subtitle}</p>}
</div>
</section>
);
}
