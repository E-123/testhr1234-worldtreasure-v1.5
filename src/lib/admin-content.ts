import { DICT } from "@/lib/i18n";
import { NEWS } from "@/lib/content";

export type ContentRow = Record<string, any>;
const sections: ContentRow[] = [
  {
    "section_key": "introduction",
    "image_url": "",
    "display_order": 0,
    "content_zh": null,
    "content_en": null,
    "content_fr": null
  },
  {
    "section_key": "mission",
    "image_url": "/images/gallery-space.jpg",
    "display_order": 1,
    "content_zh": null,
    "content_en": null,
    "content_fr": null
  },
  {
    "section_key": "values",
    "image_url": "",
    "display_order": 2,
    "content_zh": null,
    "content_en": null,
    "content_fr": null
  },
  {
    "section_key": "history",
    "image_url": "",
    "display_order": 3,
    "content_zh": {
      "kicker": "Since 1993",
      "title": "发展历程",
      "items": [
        {
          "year": "1993",
          "text": "巴黎国际凤凰艺术协会成立"
        },
        {
          "year": "2003",
          "text": "正式更名为世界瑰宝艺术协会"
        },
        {
          "year": "2014",
          "text": "贺玉琴女士当选协会主席"
        },
        {
          "year": "2026",
          "text": "章程修订，新增跨界融合方向"
        }
      ]
    },
    "content_en": {
      "kicker": "Since 1993",
      "title": "Our History",
      "items": [
        {
          "year": "1993",
          "text": "International Phoenix Art Association founded in Paris"
        },
        {
          "year": "2003",
          "text": "Renamed the World Treasure Art Association"
        },
        {
          "year": "2014",
          "text": "Ms. He Yuqin elected Chairwoman"
        },
        {
          "year": "2026",
          "text": "Constitution revised — cross-disciplinary mandate added"
        }
      ]
    },
    "content_fr": {
      "kicker": "Since 1993",
      "title": "Notre histoire",
      "items": [
        {
          "year": "1993",
          "text": "Fondation de l'Association à Paris"
        },
        {
          "year": "2003",
          "text": "Renommée Association d'Art du Trésor Mondial"
        },
        {
          "year": "2014",
          "text": "Mme He Yuqin élue présidente"
        },
        {
          "year": "2026",
          "text": "Révision de la constitution"
        }
      ]
    }
  },
  {
    "section_key": "organisation",
    "image_url": "",
    "display_order": 4,
    "content_zh": {
      "kicker": "Governance",
      "title": "组织架构",
      "items": [
        {
          "icon": "Users",
          "title": "理事会",
          "body": "多元背景、独立运作的最高决策机构。"
        },
        {
          "icon": "ScrollText",
          "title": "学术委员会",
          "body": "负责公益性学术审核与标准制定。"
        },
        {
          "icon": "Building2",
          "title": "秘书处",
          "body": "协会日常运营与对外协调中枢。"
        }
      ]
    },
    "content_en": {
      "kicker": "Governance",
      "title": "Organisation",
      "items": [
        {
          "icon": "Users",
          "title": "Council",
          "body": "The highest decision body — diverse and independent."
        },
        {
          "icon": "ScrollText",
          "title": "Academic Committee",
          "body": "Oversees scholarly review and standards."
        },
        {
          "icon": "Building2",
          "title": "Secretariat",
          "body": "Coordinates daily operations."
        }
      ]
    },
    "content_fr": {
      "kicker": "Governance",
      "title": "Organisation",
      "items": [
        {
          "icon": "Users",
          "title": "Conseil",
          "body": "L'organe décisionnel suprême, divers et indépendant."
        },
        {
          "icon": "ScrollText",
          "title": "Comité académique",
          "body": "Supervise l'examen scientifique et les normes."
        },
        {
          "icon": "Building2",
          "title": "Secrétariat",
          "body": "Coordonne les opérations quotidiennes."
        }
      ]
    }
  },
  {
    "section_key": "credentials",
    "image_url": "",
    "display_order": 5,
    "content_zh": {
      "kicker": "Legal Foundation",
      "title": "资质与治理",
      "items": [
        {
          "icon": "Landmark",
          "title": "法国1901年结社法",
          "body": "依据法国法律合法注册的非营利组织。"
        },
        {
          "icon": "Award",
          "title": "登记证号 W751-2003",
          "body": "巴黎警察总署正式登记备案。"
        },
        {
          "icon": "Scale",
          "title": "治理原则",
          "body": "管理独立、公共受益、非营利、公开透明。"
        }
      ]
    },
    "content_en": {
      "kicker": "Legal Foundation",
      "title": "Credentials & Governance",
      "items": [
        {
          "icon": "Landmark",
          "title": "French Law of 1901",
          "body": "Lawfully registered non-profit under French law."
        },
        {
          "icon": "Award",
          "title": "Reg. No. W751-2003",
          "body": "Officially registered with the Paris Prefecture."
        },
        {
          "icon": "Scale",
          "title": "Governance Principles",
          "body": "Independent, public-benefit, non-profit, transparent."
        }
      ]
    },
    "content_fr": {
      "kicker": "Legal Foundation",
      "title": "Accréditations",
      "items": [
        {
          "icon": "Landmark",
          "title": "Loi de 1901",
          "body": "Association à but non lucratif enregistrée."
        },
        {
          "icon": "Award",
          "title": "N° W751-2003",
          "body": "Enregistrée à la Préfecture de Paris."
        },
        {
          "icon": "Scale",
          "title": "Principes",
          "body": "Indépendance, intérêt public, transparence."
        }
      ]
    }
  }
];
for (const row of sections) {
 for (const lang of ["zh", "en", "fr"] as const) {
  if (row["section_key"] === "introduction") row[`content_${lang}`] = { title: DICT["assocName"]?.[lang], body: DICT["assocSub"]?.[lang] };
  if (row["section_key"] === "mission") row[`content_${lang}`] = { kicker: DICT["missionKicker"]?.[lang], title: DICT["missionTitle"]?.[lang], body: DICT["missionBody"]?.[lang] };
  if (row["section_key"] === "values") row[`content_${lang}`] = { items: DICT["values"]?.[lang] };
 }
}
export const ABOUT_DEFAULTS = sections;
export const CONTACT_DEFAULTS: ContentRow[] = [
  {
    "section_key": "contact",
    "image_url": "",
    "display_order": 0,
    "content_zh": {
      "title": "联系我们",
      "subtitle": "巴黎总部与各代表处随时为您服务。",
      "kicker": "Paris",
      "headquarters": "巴黎总部",
      "address": "12 Rue de la Paix, 75002 Paris, France",
      "phone": "+33 1 42 00 00 00",
      "email": "contact@wtaa.org",
      "hours": "周一至周五 09:00 – 18:00 (CET)",
      "faq_title": "常见问题",
      "items": [
        {
          "q": "如何成为会员？",
          "a": "请通过本页留言或邮件提交申请，经理事会审议后发放电子会员证。"
        },
        {
          "q": "协会的法律性质？",
          "a": "依据法国1901年结社法注册的非营利国际组织，登记证号 W751-2003。"
        },
        {
          "q": "如何申请艺术品鉴定？",
          "a": "会员可在瑰宝展示页面提交鉴定咨询，由专家团进行评估。"
        }
      ],
      "form_title": "在线留言",
      "sent_title": "留言已送达",
      "sent_body": "我们将尽快回复您。"
    },
    "content_en": {
      "title": "Contact Us",
      "subtitle": "Our Paris headquarters and representatives are at your service.",
      "kicker": "Paris",
      "headquarters": "Paris Headquarters",
      "address": "12 Rue de la Paix, 75002 Paris, France",
      "phone": "+33 1 42 00 00 00",
      "email": "contact@wtaa.org",
      "hours": "Mon–Fri 09:00 – 18:00 (CET)",
      "faq_title": "FAQ",
      "items": [
        {
          "q": "How do I become a member?",
          "a": "Submit your application via this page or email; the Council reviews and issues a digital card."
        },
        {
          "q": "What is the legal status?",
          "a": "A non-profit registered under the French Law of 1901, Reg. W751-2003."
        },
        {
          "q": "How to request authentication?",
          "a": "Members submit requests in the Gallery; the expert panel evaluates."
        }
      ],
      "form_title": "Send a Message",
      "sent_title": "Message Sent",
      "sent_body": "We will respond shortly."
    },
    "content_fr": {
      "title": "Contactez-nous",
      "subtitle": "Notre siège parisien à votre service.",
      "kicker": "Paris",
      "headquarters": "Siège de Paris",
      "address": "12 Rue de la Paix, 75002 Paris, France",
      "phone": "+33 1 42 00 00 00",
      "email": "contact@wtaa.org",
      "hours": "Lun–Ven 09h00 – 18h00 (CET)",
      "faq_title": "FAQ",
      "items": [
        {
          "q": "Comment adhérer ?",
          "a": "Soumettez votre demande via cette page ou par e-mail."
        },
        {
          "q": "Statut juridique ?",
          "a": "Association loi 1901, N° W751-2003."
        },
        {
          "q": "Authentification ?",
          "a": "Les membres soumettent une demande dans la Galerie."
        }
      ],
      "form_title": "Écrivez-nous",
      "sent_title": "Message envoyé",
      "sent_body": "Nous vous répondrons bientôt."
    }
  }
];
export const NEWS_DEFAULTS: ContentRow[] = NEWS.map((n, i) => ({ legacy_id: n.id, image_url: n.img, publication_date: n.date, display_order: i, homepage_featured: true, ...Object.fromEntries(["zh", "en", "fr"].flatMap(lang => ["title", "cat", "excerpt"].map(key => [`${key}_${lang}`, n[key as "title" | "cat" | "excerpt"][lang as "zh" | "en" | "fr"]]))) }));
