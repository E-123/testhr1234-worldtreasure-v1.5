// @ts-nocheck
import React from "react";
import { Landmark, Users, ScrollText, Award, Scale, Building2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { IMG } from "@/lib/content";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import InfoCard from "@/components/common/InfoCard";
import Reveal from "@/components/common/Reveal";
import { useAboutSections } from "@/lib/external-content";

const ICONS = { Landmark, Users, ScrollText, Award, Scale, Building2 };

const TIMELINE = [
{ y: "1993", zh: "巴黎国际凤凰艺术协会成立", en: "International Phoenix Art Association founded in Paris", fr: "Fondation de l'Association à Paris" },
{ y: "2003", zh: "正式更名为世界瑰宝艺术协会", en: "Renamed the World Treasure Art Association", fr: "Renommée Association d'Art du Trésor Mondial" },
{ y: "2014", zh: "贺玉琴女士当选协会主席", en: "Ms. He Yuqin elected Chairwoman", fr: "Mme He Yuqin élue présidente" },
{ y: "2026", zh: "章程修订，新增跨界融合方向", en: "Constitution revised — cross-disciplinary mandate added", fr: "Révision de la constitution" },
];

export default function About() {
const { t, lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const S = useAboutSections();
const sec = (k) => S?.[k]?.[lang];
const values = sec("values")?.items || t("values");
const mission = sec("mission");
const timeline = sec("history")?.items?.map((e) => ({ y: e.year, [lang]: e.text })) || TIMELINE;
const cards = (k) => sec(k)?.items;
return (
<>
<PageHero zh="承" hideSeal title={sec("introduction")?.title || t("assocName")} subtitle={sec("introduction")?.body || t("assocSub")} />

<section className="py-20 px-[6vw] grid lg:grid-cols-2 gap-14 items-center">
<Reveal>
<div className="aspect-[4/3] overflow-hidden rounded-sm">
<img src={S?.mission?.image_url || IMG.gallerySpace} alt="Association gallery space in Paris" className="w-full h-full object-cover" />
</div>
</Reveal>
<div>
<SectionHeading kicker={mission?.kicker || t("missionKicker")} title={mission?.title || t("missionTitle")} />
<p className="mt-6 text-[#1A1A1A]/70 leading-[1.9] text-[17px]">{mission?.body || t("missionBody")}</p>
<div className="mt-6 grid sm:grid-cols-3 gap-4">
{values.map((v) => (
<div key={v} className="p-4 border border-[#B8934E]/25 rounded-sm text-center font-serif-disp text-[#8B0000]">{v}</div>
))}
</div>
</div>
</section>

{/* History */}
<section className="py-20 px-[6vw] bg-[#1A1A1A]">
<SectionHeading kicker={sec("history")?.kicker || "Since 1993"} title={sec("history")?.title || L("发展历程", "Our History", "Notre histoire")} light align="center" />
<div className="max-w-3xl mx-auto mt-14">
{timeline.map((e, i) => (
<Reveal key={e.y} delay={i * 0.1}>
<div className="flex gap-6 pb-10 last:pb-0 relative">
<div className="font-serif-disp text-[#B8934E] text-2xl w-20 shrink-0">{e.y}</div>
<div className="relative pl-6 border-l border-[#B8934E]/30">
<span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#8B0000]" />
<p className="text-[#FDFCF0]/85 leading-relaxed">{e[lang]}</p>
</div>
</div>
</Reveal>
))}
</div>
</section>

{/* Organization */}
<section className="py-20 px-[6vw]">
<SectionHeading kicker={sec("organisation")?.kicker || "Governance"} title={sec("organisation")?.title || L("组织架构", "Organisation", "Organisation")} align="center" />
<div className="grid md:grid-cols-3 gap-6 mt-12">
{cards("organisation") ? cards("organisation").map((c, i) => <InfoCard key={c.title} icon={ICONS[c.icon] || Users} title={c.title} body={c.body} delay={i * 0.1} />) : <>
<InfoCard icon={Users} title={L("理事会", "Council", "Conseil")} body={L("多元背景、独立运作的最高决策机构。", "The highest decision body — diverse and independent.", "L'organe décisionnel suprême, divers et indépendant.")} />
<InfoCard icon={ScrollText} title={L("学术委员会", "Academic Committee", "Comité académique")} body={L("负责公益性学术审核与标准制定。", "Oversees scholarly review and standards.", "Supervise l'examen scientifique et les normes.")} delay={0.1} />
<InfoCard icon={Building2} title={L("秘书处", "Secretariat", "Secrétariat")} body={L("协会日常运营与对外协调中枢。", "Coordinates daily operations.", "Coordonne les opérations quotidiennes.")} delay={0.2} />
</>}
</div>
</section>

{/* Credentials */}
<section className="py-20 px-[6vw] bg-[#3E5C45]/[0.06]">
<SectionHeading kicker={sec("credentials")?.kicker || "Legal Foundation"} title={sec("credentials")?.title || L("资质与治理", "Credentials & Governance", "Accréditations")} align="center" />
<div className="grid md:grid-cols-3 gap-6 mt-12">
{cards("credentials") ? cards("credentials").map((c, i) => <InfoCard key={c.title} icon={ICONS[c.icon] || Landmark} title={c.title} body={c.body} accent="#3E5C45" delay={i * 0.1} />) : <>
<InfoCard icon={Landmark} title={L("法国1901年结社法", "French Law of 1901", "Loi de 1901")} body={L("依据法国法律合法注册的非营利组织。", "Lawfully registered non-profit under French law.", "Association à but non lucratif enregistrée.")} accent="#3E5C45" />
<InfoCard icon={Award} title={L("登记证号 W751-2003", "Reg. No. W751-2003", "N° W751-2003")} body={L("巴黎警察总署正式登记备案。", "Officially registered with the Paris Prefecture.", "Enregistrée à la Préfecture de Paris.")} accent="#3E5C45" delay={0.1} />
<InfoCard icon={Scale} title={L("治理原则", "Governance Principles", "Principes")} body={L("管理独立、公共受益、非营利、公开透明。", "Independent, public-benefit, non-profit, transparent.", "Indépendance, intérêt public, transparence.")} accent="#3E5C45" delay={0.2} />
</>}
</div>
</section>
</>
);
}
