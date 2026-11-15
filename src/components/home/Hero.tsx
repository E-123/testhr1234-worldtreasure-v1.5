// @ts-nocheck
import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { IMG } from "@/lib/content";

export default function Hero() {
const { t } = useLang();
return (
<section className="relative min-h-screen flex items-center overflow-hidden">
<motion.img
src={IMG.vase}
alt="Song Dynasty celadon vase"
className="absolute inset-0 w-full h-full object-cover"
initial={{ scale: 1.12 }}
animate={{ scale: 1 }}
transition={{ duration: 12, ease: "easeOut" }}
/>
<div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/55 to-[#1A1A1A]/20" />
<div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 to-transparent" />

<span className="pointer-events-none absolute right-[4vw] top-1/2 -translate-y-1/2 font-zh-serif text-[28vw] leading-none text-[#FDFCF0]/[0.05] select-none hidden md:block">
瑰
</span>

<div className="relative px-[6vw] max-w-3xl">
<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
>
<div className="mb-6">
<span className="text-[#B8934E] text-sm tracking-[0.3em] uppercase">{t("heroKicker")}</span>
</div>
<h1 className="font-serif-disp font-semibold text-[#FDFCF0] text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.05]">
{t("heroTitle")}
</h1>
<p className="mt-6 text-[#FDFCF0]/75 text-lg leading-relaxed max-w-xl">{t("heroDesc")}</p>
<div className="mt-10 flex flex-wrap gap-4">
<Link
to="/about"
className="group flex items-center gap-2 bg-[#8B0000] text-[#FDFCF0] px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#B8934E] transition-colors rounded-sm"
>
{t("heroCtaAbout")}
<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
</Link>
<Link
to="/gallery"
className="flex items-center gap-2 border border-[#B8934E] text-[#FDFCF0] px-8 py-4 text-sm tracking-widest uppercase hover:bg-[#B8934E]/10 transition-colors rounded-sm"
>
{t("heroCtaGallery")}
</Link>
</div>
</motion.div>
</div>
</section>
);
}
