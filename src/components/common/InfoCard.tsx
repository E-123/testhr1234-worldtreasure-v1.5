// @ts-nocheck
import React from "react";
import Reveal from "./Reveal";

export default function InfoCard({ icon: Icon, title, body, accent = "#8B0000", delay = 0 }) {
return (
<Reveal delay={delay} className="group p-7 border border-[#B8934E]/25 rounded-sm bg-[#FDFCF0] hover:border-[#B8934E] hover:shadow-lg hover:shadow-black/5 transition-all h-full">
{Icon && <Icon size={28} style={{ color: accent }} className="mb-4" />}
<h3 className="font-serif-disp text-xl text-[#1A1A1A] mb-2 group-hover:text-[#8B0000] transition-colors">{title}</h3>
{body && <p className="text-sm text-[#1A1A1A]/65 leading-relaxed">{body}</p>}
</Reveal>
);
}
