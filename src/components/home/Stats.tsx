// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const DATA = [
{ v: 3200, suffix: "+", key: "statMembers" },
{ v: 48, suffix: "", key: "statCountries" },
{ v: 120, suffix: "+", key: "statEvents" },
{ v: 33, suffix: "", key: "statYears" },
];

function Counter({ to, suffix }) {
const [n, setN] = useState(0);
const ref = useRef(null);
const started = useRef(false);
useEffect(() => {
const el = ref.current;
if (!el) return;
const obs = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting && !started.current) {
started.current = true;
const dur = 1600;
const t0 = performance.now();
const step = (t) => {
const p = Math.min((t - t0) / dur, 1);
const eased = 1 - Math.pow(1 - p, 3);
setN(Math.round(eased * to));
if (p < 1) requestAnimationFrame(step);
};
requestAnimationFrame(step);
}
}, { threshold: 0.4 });
obs.observe(el);
return () => obs.disconnect();
}, [to]);
return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
const { t } = useLang();
return (
<section className="bg-[#8B0000] text-[#FDFCF0] py-14 px-[6vw]">
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
{DATA.map((d) => (
<div key={d.key} className="text-center">
<div className="font-serif-disp text-[clamp(2.2rem,4vw,3.5rem)] text-[#FDFCF0]">
<Counter to={d.v} suffix={d.suffix} />
</div>
<div className="mt-1 text-xs tracking-[0.2em] uppercase text-[#FDFCF0]/70">{t(d.key)}</div>
</div>
))}
</div>
</section>
);
}
