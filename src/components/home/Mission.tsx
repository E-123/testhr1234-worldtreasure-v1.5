// @ts-nocheck
import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Globe2, Sprout } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { IMG } from "@/lib/content";
import Reveal from "../common/Reveal";
import SectionHeading from "../common/SectionHeading";
import { useAboutSections } from "@/lib/external-content";

const ICONS = [ShieldCheck, Globe2, Sprout];

export default function Mission() {
const { t, lang } = useLang();
const sections = useAboutSections();
const mission = sections?.mission?.[lang];
const values = sections?.values?.[lang]?.items || t("values");
return (
<section className="py-24 px-[6vw] grid lg:grid-cols-2 gap-16 items-center">
<Reveal className="relative">
<div className="aspect-[4/5] overflow-hidden rounded-sm">
<img src={IMG.brush} alt="Calligraphy brush touching water" className="w-full h-full object-cover" />
</div>
<div className="absolute -bottom-6 -right-4 w-32 h-32 border border-[#B8934E] hidden md:block" />
</Reveal>
<div>
<SectionHeading kicker={mission?.kicker || t("missionKicker")} title={mission?.title || t("missionTitle")} />
<p className="mt-6 text-[#1A1A1A]/70 leading-[1.9] text-[17px]">{mission?.body || t("missionBody")}</p>
<div className="mt-8 grid sm:grid-cols-3 gap-5">
{values.map((v, i) => {
const Icon = ICONS[i % ICONS.length];
return (
<Reveal key={v} delay={i * 0.12} className="flex flex-col items-start gap-3 p-5 border border-[#B8934E]/25 rounded-sm">
<Icon className="text-[#8B0000]" size={26} />
<span className="font-serif-disp text-lg text-[#1A1A1A]">{v}</span>
</Reveal>
);
})}
</div>
<Link to="/about" className="mt-9 inline-flex items-center gap-2 text-[#8B0000] tracking-widest uppercase text-sm border-b border-[#8B0000] pb-1 hover:gap-3 transition-all">
{t("learnMore")} <ArrowRight size={15} />
</Link>
</div>
</section>
);
}
