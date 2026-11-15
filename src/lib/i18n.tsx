import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "zh" | "en" | "fr";

export const LANGS: Record<Lang, { label: string }> = {
  zh: { label: "中文" },
  en: { label: "EN" },
  fr: { label: "FR" },
};

export const NAV: { path: string; zh: string; en: string; fr: string }[] = [
  { path: "/", zh: "首页", en: "Home", fr: "Accueil" },
  { path: "/about", zh: "关于协会", en: "About", fr: "À propos" },
  { path: "/news", zh: "新闻动态", en: "News", fr: "Actualités" },
  { path: "/gallery", zh: "瑰宝展示", en: "Gallery", fr: "Galerie" },
  { path: "/contact", zh: "联系我们", en: "Contact", fr: "Contact" },
];

export const DICT: Record<string, Record<Lang, any>> = {
  assocName: { zh: "世界瑰宝艺术协会", en: "World Treasure Art Association", fr: "Association d'Art du Trésor Mondial" },
  assocSub: {
    zh: "1993年创立于法国巴黎，依据法国1901年结社法注册的国际非营利艺术组织，致力于守护、研究与传播世界艺术瑰宝。",
    en: "Founded in Paris in 1993, an international non-profit registered under the French Law of 1901, dedicated to safeguarding, studying and sharing the world's art treasures.",
    fr: "Fondée à Paris en 1993, association internationale à but non lucratif (loi 1901) dédiée à la sauvegarde, l'étude et la diffusion des trésors artistiques du monde.",
  },
  adminLogin: { zh: "管理员登录", en: "Admin Login", fr: "Connexion admin" },
  heroKicker: { zh: "巴黎 · 1993", en: "Paris · Since 1993", fr: "Paris · Depuis 1993" },
  heroTitle: { zh: "守护千年瑰宝，连接东西方艺术", en: "Guarding Timeless Treasures, Bridging East and West", fr: "Gardiens des trésors, passeurs entre Orient et Occident" },
  heroDesc: {
    zh: "我们汇聚全球收藏家、学者与艺术家，以专业鉴定、学术研究与国际展览，让珍贵文物与艺术重焕光彩。",
    en: "We unite collectors, scholars and artists worldwide through expert authentication, research and international exhibitions.",
    fr: "Nous réunissons collectionneurs, chercheurs et artistes du monde entier autour de l'expertise, de la recherche et des expositions.",
  },
  heroCtaJoin: { zh: "加入协会", en: "Join Us", fr: "Adhérer" },
  heroCtaAbout: { zh: "关于协会", en: "About", fr: "À propos" },
  heroCtaGallery: { zh: "浏览瑰宝", en: "Explore Treasures", fr: "Voir les trésors" },
  statMembers: { zh: "全球会员", en: "Members", fr: "Membres" },
  statCountries: { zh: "国家与地区", en: "Countries", fr: "Pays" },
  statEvents: { zh: "年度活动", en: "Annual Events", fr: "Événements" },
  statYears: { zh: "年历史", en: "Years", fr: "Années" },
  missionKicker: { zh: "使命", en: "Our Mission", fr: "Notre mission" },
  missionTitle: { zh: "传承文明，鉴赏真美", en: "Preserve Heritage, Celebrate Beauty", fr: "Préserver le patrimoine, célébrer la beauté" },
  missionBody: {
    zh: "世界瑰宝艺术协会以“管理独立、公共受益、非营利、公开透明”为原则，推动艺术品鉴定标准化、学术交流国际化与文化遗产的永续保护。",
    en: "Guided by independence, public benefit, non-profit status and transparency, we advance authentication standards, international scholarship and the lasting protection of cultural heritage.",
    fr: "Guidés par l'indépendance, l'intérêt public et la transparence, nous promouvons des normes d'expertise, les échanges scientifiques et la protection durable du patrimoine.",
  },
  values: { zh: ["守护", "交流", "传承"], en: ["Safeguard", "Exchange", "Legacy"], fr: ["Protéger", "Échanger", "Transmettre"] },
  learnMore: { zh: "了解更多", en: "Learn More", fr: "En savoir plus" },
  latestNews: { zh: "新闻动态", en: "Latest News", fr: "Actualités" },
  viewAll: { zh: "查看全部", en: "View All", fr: "Tout voir" },
  featuredTreasures: { zh: "瑰宝展示", en: "Featured Treasures", fr: "Trésors à l'honneur" },
  inquire: { zh: "专家认证", en: "Certified", fr: "Certifié" },
  quickLinks: { zh: "快速链接", en: "Quick Links", fr: "Liens rapides" },
  parisHq: { zh: "巴黎总部", en: "Paris HQ", fr: "Siège de Paris" },
  newsletterTitle: { zh: "订阅通讯", en: "Newsletter", fr: "Lettre d'information" },
  newsletterDesc: { zh: "获取最新展览、论坛与协会动态。", en: "Get the latest exhibitions, forums and news.", fr: "Recevez nos expositions, forums et actualités." },
  emailPlaceholder: { zh: "您的邮箱", en: "Your email", fr: "Votre e-mail" },
  subscribe: { zh: "订阅", en: "Subscribe", fr: "S'abonner" },
  thankYou: { zh: "感谢订阅！", en: "Thank you for subscribing!", fr: "Merci pour votre inscription !" },
  rights: {
    zh: "© 2026 世界瑰宝艺术协会 · 登记证号 W751-2003 · 版权所有",
    en: "© 2026 World Treasure Art Association · Reg. W751-2003 · All rights reserved",
    fr: "© 2026 Association d'Art du Trésor Mondial · N° W751-2003 · Tous droits réservés",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => any; langs: typeof LANGS };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");
  useEffect(() => {
    const s = localStorage.getItem("wt-lang") as Lang | null;
    if (s && s in LANGS) setLangState(s);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("wt-lang", l);
  };
  const t = (k: string) => DICT[k]?.[lang] ?? k;
  return <LangContext.Provider value={{ lang, setLang, t, langs: LANGS }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
