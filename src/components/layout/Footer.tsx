// @ts-nocheck
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

const Facebook = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>);
const Instagram = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>);
const Linkedin = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>);
import { useLang, NAV } from "@/lib/i18n";
import Seal from "./Seal";

export default function Footer() {
const { lang, t } = useLang();
const [email, setEmail] = useState("");
const [done, setDone] = useState(false);

const submit = (e) => {
e.preventDefault();
if (!email) return;
setDone(true);
setEmail("");
setTimeout(() => setDone(false), 4000);
};

return (
<footer className="bg-[#1A1A1A] text-[#FDFCF0]/80">
<hr className="wt-hairline" />
<div className="px-[6vw] py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
<div>
<div className="flex items-center gap-3 mb-5">
<Seal size={40} />
<span className="font-serif-disp text-lg text-[#FDFCF0]">{t("assocName")}</span>
</div>
<p className="text-sm leading-relaxed text-[#FDFCF0]/60 max-w-xs">{t("assocSub")}</p>
<div className="flex gap-3 mt-6">
{[Facebook, Instagram, Linkedin].map((Icon, i) => (
<a
key={i}
href="https://www.linkedin.com"
target="_blank"
rel="noreferrer"
className="w-9 h-9 rounded-full border border-[#B8934E]/40 flex items-center justify-center hover:bg-[#B8934E] hover:text-[#1A1A1A] transition-colors"
aria-label="social"
>
<Icon size={15} />
</a>
))}
</div>
</div>

<div>
<h4 className="text-[#B8934E] tracking-widest text-xs uppercase mb-5">{t("quickLinks")}</h4>
<ul className="space-y-2.5 text-sm">
{NAV.slice(1, 9).map((item) => (
<li key={item.path}>
<Link to={item.path} className="hover:text-[#B8934E] transition-colors">
{item[lang]}
</Link>
</li>
))}
</ul>
</div>

<div>
<h4 className="text-[#B8934E] tracking-widest text-xs uppercase mb-5">{t("parisHq")}</h4>
<ul className="space-y-3 text-sm text-[#FDFCF0]/60">
<li className="flex gap-2.5"><MapPin size={16} className="text-[#B8934E] shrink-0 mt-0.5" /> 12 Rue de la Paix, 75002 Paris, France</li>
<li className="flex gap-2.5"><Phone size={16} className="text-[#B8934E] shrink-0 mt-0.5" /> +33 1 42 00 00 00</li>
<li className="flex gap-2.5"><Mail size={16} className="text-[#B8934E] shrink-0 mt-0.5" /> contact@wtaa.org</li>
</ul>
</div>

<div>
<h4 className="text-[#B8934E] tracking-widest text-xs uppercase mb-5">{t("newsletterTitle")}</h4>
<p className="text-sm text-[#FDFCF0]/60 mb-4">{t("newsletterDesc")}</p>
<form onSubmit={submit} className="flex flex-col gap-3">
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder={t("emailPlaceholder")}
className="bg-transparent border border-[#B8934E]/40 px-4 py-2.5 text-sm text-[#FDFCF0] placeholder:text-[#FDFCF0]/40 focus:border-[#B8934E] focus:outline-none rounded-sm"
/>
<button
type="submit"
className="bg-[#8B0000] text-[#FDFCF0] py-2.5 text-sm tracking-widest uppercase hover:bg-[#B8934E] transition-colors rounded-sm"
>
{t("subscribe")}
</button>
{done && <span className="text-[#B8934E] text-xs">{t("thankYou")}</span>}
</form>
</div>
</div>
<div className="px-[6vw] py-6 border-t border-[#FDFCF0]/10 text-center text-xs text-[#FDFCF0]/40">
{t("rights")}
</div>
</footer>
);
}
