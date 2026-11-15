// @ts-nocheck
import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useNews } from "@/lib/external-content";
import Reveal from "../common/Reveal";
import SectionHeading from "../common/SectionHeading";
import NewsCard from "../common/NewsCard";

export default function NewsPreview() {
const { t } = useLang();
const NEWS = useNews(true);
return (
<section className="py-24 px-[6vw] bg-white/40">
<div className="flex items-end justify-between gap-6 mb-12">
<SectionHeading kicker="News" title={t("latestNews")} />
<Link to="/news" className="hidden sm:flex items-center gap-2 text-sm text-[#8B0000] tracking-widest uppercase hover:gap-3 transition-all">
{t("viewAll")} <ArrowRight size={15} />
</Link>
</div>
<div className="grid md:grid-cols-3 gap-8">
{NEWS.map((n, i) => (
<Reveal key={n.id} delay={i * 0.12}>
<Link to="/news"><NewsCard item={n} /></Link>
</Reveal>
))}
</div>
</section>
);
}
