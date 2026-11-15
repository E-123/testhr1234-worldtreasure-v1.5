export const IMG = {
  vase: "/images/hero-vase.jpg",
  brush: "/images/brush.jpg",
  gallerySpace: "/images/gallery-space.jpg",
};

type L3 = { zh: string; en: string; fr: string };
export type NewsItem = { id: number; img: string; date: string; cat: L3; title: L3; excerpt: L3 };

export const NEWS: NewsItem[] = [
  {
    id: 1, img: "/images/gallery-space.jpg", date: "2026-10-18",
    cat: { zh: "展览预告", en: "Exhibition", fr: "Exposition" },
    title: { zh: "“东方雅韵”中国古代艺术特展巴黎开幕", en: "“Oriental Elegance” Opens in Paris", fr: "« Élégance orientale » ouvre à Paris" },
    excerpt: { zh: "精选百余件宋元明清瓷器、书画与玉器，展期至明年春季。", en: "Over a hundred Song to Qing porcelains, paintings and jades on view until spring.", fr: "Plus de cent porcelaines, peintures et jades des Song aux Qing." },
  },
  {
    id: 2, img: "/images/t4.jpg", date: "2026-09-05",
    cat: { zh: "学术论坛", en: "Forum", fr: "Forum" },
    title: { zh: "第十二届国际艺术品鉴定学术论坛圆满举办", en: "12th International Authentication Forum Concludes", fr: "Clôture du 12e forum international d'expertise" },
    excerpt: { zh: "来自二十余国的专家学者共同探讨科技鉴定与文物保护的未来。", en: "Experts from over twenty countries discussed scientific authentication and conservation.", fr: "Des experts de vingt pays ont débattu de l'expertise scientifique." },
  },
  {
    id: 3, img: "/images/t1.jpg", date: "2026-07-22",
    cat: { zh: "协会动态", en: "Association", fr: "Association" },
    title: { zh: "协会章程修订，新增跨界融合发展方向", en: "Constitution Revised with Cross-Disciplinary Mandate", fr: "Révision de la constitution de l'association" },
    excerpt: { zh: "理事会审议通过新版章程，推动艺术与科技、设计的跨界合作。", en: "The Council approved a new constitution promoting art, technology and design collaboration.", fr: "Le Conseil a adopté une nouvelle constitution favorisant les collaborations." },
  },
];

export const TREASURES = [
  { id: 1, img: "/images/hero-vase.jpg", title: { zh: "龙泉青瓷梅瓶", en: "Longquan Celadon Vase", fr: "Vase en céladon" }, dynasty: { zh: "宋代", en: "Song Dynasty", fr: "Dynastie Song" } },
  { id: 2, img: "/images/t1.jpg", title: { zh: "青花云龙纹罐", en: "Blue-and-White Dragon Jar", fr: "Jarre bleu et blanc" }, dynasty: { zh: "明代", en: "Ming Dynasty", fr: "Dynastie Ming" } },
  { id: 3, img: "/images/t2.jpg", title: { zh: "兽面纹青铜方鼎", en: "Bronze Ding", fr: "Ding en bronze" }, dynasty: { zh: "商代", en: "Shang Dynasty", fr: "Dynastie Shang" } },
  { id: 4, img: "/images/t3.jpg", title: { zh: "白玉镂雕龙纹佩", en: "White Jade Dragon Pendant", fr: "Pendentif en jade" }, dynasty: { zh: "清代", en: "Qing Dynasty", fr: "Dynastie Qing" } },
  { id: 5, img: "/images/t4.jpg", title: { zh: "溪山清远图", en: "Streams and Mountains", fr: "Ruisseaux et montagnes" }, dynasty: { zh: "宋代", en: "Song Dynasty", fr: "Dynastie Song" } },
];
