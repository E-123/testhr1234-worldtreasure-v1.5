// @ts-nocheck
import React from "react";
import Reveal from "./Reveal";

export default function SectionHeading({ kicker, title, align = "left", light = false }) {
return (
<Reveal className={align === "center" ? "text-center" : ""}>
{kicker && (
<div className={`flex items-center gap-3 mb-3 ${align === "center" ? "justify-center" : ""}`}>
<span className="w-8 h-px bg-[#B8934E]" />
<span className="text-xs tracking-[0.3em] uppercase text-[#B8934E]">{kicker}</span>
{align === "center" && <span className="w-8 h-px bg-[#B8934E]" />}
</div>
)}
<h2 className={`font-serif-disp font-semibold leading-tight text-[clamp(1.9rem,3.5vw,3.2rem)] ${light ? "text-[#FDFCF0]" : "text-[#8B0000]"}`}>
{title}
</h2>
</Reveal>
);
}
