// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, UserRound } from "lucide-react";
import { useLang, NAV } from "@/lib/i18n";
import Seal from "./Seal";
import { Button } from "@/components/ui/button";

export default function Header() {
const { lang, setLang, t, langs } = useLang();
const [scrolled, setScrolled] = useState(false);
const [open, setOpen] = useState(false);
const headerRef = useRef(null);
const location = useLocation();

useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll);
return () => window.removeEventListener("scroll", onScroll);
}, []);

useEffect(() => setOpen(false), [location.pathname]);

useEffect(() => {
if (!open) return;
const onKey = (event) => {
if (event.key === "Escape") {
setOpen(false);
headerRef.current?.querySelector('[aria-controls="mobile-navigation"]')?.focus();
}
};
const onOutside = (event) => {
if (!headerRef.current?.contains(event.target)) setOpen(false);
};
const desktop = window.matchMedia("(min-width: 1024px)");
const onResize = () => { if (desktop.matches) setOpen(false); };
document.addEventListener("keydown", onKey);
document.addEventListener("pointerdown", onOutside);
desktop.addEventListener("change", onResize);
return () => {
document.removeEventListener("keydown", onKey);
document.removeEventListener("pointerdown", onOutside);
desktop.removeEventListener("change", onResize);
};
}, [open]);

const onHome = location.pathname === "/";
const solid = scrolled || open || !onHome;

return (
<header
ref={headerRef}
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
solid
? "bg-[#FDFCF0]/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(184,147,78,0.4)]"
: "bg-transparent"
}`}
>
{/* top bar */}
<div className={`hidden md:flex items-center justify-end gap-6 px-[6vw] text-xs tracking-widest transition-colors ${solid ? "text-[#1A1A1A]/60" : "text-[#FDFCF0]/80"}`} style={{ height: 34 }}>
<div className="flex items-center gap-3">
{Object.entries(langs).map(([code, meta]) => (
<button
key={code}
onClick={() => setLang(code)}
className={`transition-colors hover:text-[#B8934E] ${lang === code ? "text-[#B8934E] font-semibold" : ""}`}
>
{meta.label}
</button>
))}
</div>
<Link to="/admin" className="flex items-center gap-1.5 hover:text-[#B8934E] transition-colors">
<UserRound size={13} /> {t("adminLogin")}
</Link>
</div>

<div className="flex items-center justify-between px-[6vw] py-3">
<Link to="/" className="flex items-center gap-3 group">
<Seal size={44} />
<div className="leading-tight">
<div className={`font-serif-disp text-lg md:text-xl font-semibold tracking-wide transition-colors ${solid ? "text-[#8B0000]" : "text-[#FDFCF0]"}`}>
{t("assocName")}
</div>
<div className={`text-[10px] md:text-[11px] tracking-[0.2em] uppercase transition-colors ${solid ? "text-[#B8934E]" : "text-[#FDFCF0]/70"}`}>
World Treasure Art Association
</div>
</div>
</Link>

<nav className="hidden lg:flex items-center gap-6">
{NAV.map((item) => {
const active = location.pathname === item.path;
return (
<Link
key={item.path}
to={item.path}
className={`relative text-sm font-body-wt tracking-wide transition-colors hover:text-[#B8934E] ${
solid ? "text-[#1A1A1A]" : "text-[#FDFCF0]"
} ${active ? "text-[#B8934E]" : ""}`}
>
{item[lang]}
{active && <span className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-[#B8934E]" />}
</Link>
);
})}
</nav>

<Button
variant="ghost"
size="icon"
className={`lg:hidden shrink-0 hover:bg-transparent ${solid ? "text-navigation-ink" : "text-navigation-paper"}`}
onClick={() => setOpen((o) => !o)}
aria-label="Menu"
aria-expanded={open}
aria-controls="mobile-navigation"
>
{open ? <X className="size-[26px]" /> : <Menu className="size-[26px]" />}
</Button>
</div>

{/* mobile drawer */}
{open && (
<nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden max-h-[70dvh] overflow-y-auto overscroll-contain bg-navigation-paper border-t border-navigation-gold/30 px-[6vw] py-4">
<div className="flex items-center gap-4 pb-4 mb-2 border-b border-[#B8934E]/20">
{Object.entries(langs).map(([code, meta]) => (
<button
key={code}
onClick={() => setLang(code)}
className={`text-sm ${lang === code ? "text-[#B8934E] font-semibold" : "text-[#1A1A1A]/60"}`}
>
{meta.label}
</button>
))}
<Link to="/admin" onClick={() => setOpen(false)} className="ml-auto flex items-center gap-1.5 text-sm text-[#8B0000]">
<UserRound size={15} /> {t("adminLogin")}
</Link>
</div>
<div className="flex flex-col">
{NAV.map((item) => (
<Link
key={item.path}
to={item.path}
onClick={() => setOpen(false)}
className={`py-2.5 font-body-wt text-[#1A1A1A] border-b border-[#1A1A1A]/5 ${
location.pathname === item.path ? "text-[#B8934E]" : ""
}`}
>
{item[lang]}
</Link>
))}
</div>
</nav>
)}
</header>
);
}
