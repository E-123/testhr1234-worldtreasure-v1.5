// @ts-nocheck
import React from "react";

export default function Seal({ size = 48, spin = false }) {
return (
<svg
width={size}
height={size}
viewBox="0 0 100 100"
className={`wt-seal-shadow ${spin ? "wt-spin-slow" : ""}`}
aria-hidden="true"
>
<circle cx="50" cy="50" r="47" fill="none" stroke="#B8934E" strokeWidth="1.2" />
<circle cx="50" cy="50" r="40" fill="#8B0000" />
<circle cx="50" cy="50" r="40" fill="none" stroke="#B8934E" strokeWidth="0.8" />
<text
x="50"
y="58"
textAnchor="middle"
fontSize="30"
fill="#FDFCF0"
fontFamily="'Noto Serif SC', serif"
fontWeight="700"
>
瑰
</text>
<g stroke="#B8934E" strokeWidth="0.6" opacity="0.7">
{Array.from({ length: 24 }).map((_, i) => {
const a = (i / 24) * Math.PI * 2;
// Fixed precision keeps server-rendered and browser SVG attributes identical.
const point = (value) => Number(value.toFixed(6));
const x1 = point(50 + Math.cos(a) * 43);
const y1 = point(50 + Math.sin(a) * 43);
const x2 = point(50 + Math.cos(a) * 46);
const y2 = point(50 + Math.sin(a) * 46);
return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
})}
</g>
</svg>
);
}
