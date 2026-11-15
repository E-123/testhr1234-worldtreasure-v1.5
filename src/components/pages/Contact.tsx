// @ts-nocheck
import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import PageHero from "@/components/common/PageHero";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import { useContactContent } from "@/lib/external-content";

export default function Contact() {
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const content = useContactContent();
const C = content?.[`content_${lang}`] || content?.content_zh || {};
const [sent, setSent] = useState(false);
const faqs = C.items || [
{ q: L("如何成为会员？", "How do I become a member?", "Comment adhérer ?"), a: L("请通过本页留言或邮件提交申请，经理事会审议后发放电子会员证。", "Submit your application via this page or email; the Council reviews and issues a digital card.", "Soumettez votre demande via cette page ou par e-mail.") },
{ q: L("协会的法律性质？", "What is the legal status?", "Statut juridique ?"), a: L("依据法国1901年结社法注册的非营利国际组织，登记证号 W751-2003。", "A non-profit registered under the French Law of 1901, Reg. W751-2003.", "Association loi 1901, N° W751-2003.") },
{ q: L("如何申请艺术品鉴定？", "How to request authentication?", "Authentification ?"), a: L("会员可在瑰宝展示页面提交鉴定咨询，由专家团进行评估。", "Members submit requests in the Gallery; the expert panel evaluates.", "Les membres soumettent une demande dans la Galerie.") },
];

const submit = (e) => { e.preventDefault(); setSent(true); };

return (
<>
<PageHero zh="联" hideSeal title={C.title || L("联系我们", "Contact Us", "Contactez-nous")} subtitle={C.subtitle || L("巴黎总部与各代表处随时为您服务。", "Our Paris headquarters and representatives are at your service.", "Notre siège parisien à votre service.")} />

<section className="py-16 px-[6vw] grid lg:grid-cols-2 gap-14">
<div>
<SectionHeading kicker={C.kicker || "Paris"} title={C.headquarters || L("巴黎总部", "Paris Headquarters", "Siège de Paris")} />
<div className="mt-8 space-y-5">
{[
{ icon: MapPin, v: C.address ?? "12 Rue de la Paix, 75002 Paris, France" },
{ icon: Phone, v: C.phone ?? "+33 1 42 00 00 00" },
{ icon: Mail, v: C.email ?? "contact@wtaa.org" },
{ icon: Clock, v: C.hours ?? L("周一至周五 09:00 – 18:00 (CET)", "Mon–Fri 09:00 – 18:00 (CET)", "Lun–Ven 09h00 – 18h00 (CET)") },
].map((item, i) => {
const Icon = item.icon;
return (
<div key={i} className="flex items-center gap-4">
<span className="w-11 h-11 shrink-0 rounded-full bg-[#8B0000]/[0.06] flex items-center justify-center"><Icon size={18} className="text-[#8B0000]" /></span>
<span className="text-[#1A1A1A]/75">{item.v}</span>
</div>
);
})}
</div>

<div className="mt-10">
<h4 className="font-serif-disp text-lg text-[#8B0000] mb-4">{C.faq_title || L("常见问题", "FAQ", "FAQ")}</h4>
<div className="space-y-4">
{faqs.map((f) => (
<div key={f.q} className="border-b border-[#B8934E]/20 pb-4">
<p className="font-medium text-[#1A1A1A]">{f.q}</p>
<p className="text-sm text-[#1A1A1A]/60 mt-1.5 leading-relaxed">{f.a}</p>
</div>
))}
</div>
</div>
</div>

<Reveal className="bg-[#FDFCF0] border border-[#B8934E]/30 rounded-sm p-8 h-fit">
{sent ? (
<div className="flex flex-col items-center justify-center text-center py-16">
<CheckCircle2 size={56} className="text-[#3E5C45] mb-4" />
<h3 className="font-serif-disp text-2xl text-[#1A1A1A]">{C.sent_title || L("留言已送达", "Message Sent", "Message envoyé")}</h3>
<p className="text-[#1A1A1A]/60 mt-3">{C.sent_body || L("我们将尽快回复您。", "We will respond shortly.", "Nous vous répondrons bientôt.")}</p>
</div>
) : (
<form onSubmit={submit} className="space-y-5">
<h3 className="font-serif-disp text-2xl text-[#8B0000]">{C.form_title || L("在线留言", "Send a Message", "Écrivez-nous")}</h3>
<input required placeholder={L("姓名", "Name", "Nom")} className="w-full border border-[#B8934E]/40 rounded-sm px-4 py-2.5 text-sm focus:border-[#8B0000] focus:outline-none bg-white/60" />
<input required type="email" placeholder={L("邮箱", "Email", "E-mail")} className="w-full border border-[#B8934E]/40 rounded-sm px-4 py-2.5 text-sm focus:border-[#8B0000] focus:outline-none bg-white/60" />
<textarea required rows={5} placeholder={L("留言内容", "Your message", "Votre message")} className="w-full border border-[#B8934E]/40 rounded-sm px-4 py-2.5 text-sm focus:border-[#8B0000] focus:outline-none bg-white/60" />
<button type="submit" className="w-full bg-[#8B0000] text-[#FDFCF0] py-3.5 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E] transition-colors">
{L("发送", "Send", "Envoyer")}
</button>
</form>
)}
</Reveal>
</section>
</>
);
}
