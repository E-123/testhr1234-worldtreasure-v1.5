import { useEffect, useState } from "react";
import { Plus, Save, X, Trash2, Pencil, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { externalSupabase } from "@/lib/external-supabase";
import { adminStorage, getAdminToken } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { ABOUT_DEFAULTS, CONTACT_DEFAULTS, NEWS_DEFAULTS, type ContentRow } from "@/lib/admin-content";

const input = "w-full min-w-0 rounded-sm border border-admin-gold/40 bg-admin-paper px-3 py-2 text-sm text-admin-ink focus:outline-none focus:border-admin-accent";
const labels: Record<string, string[]> = {
  introduction: ["协会简介", "Introduction", "Introduction"], mission: ["协会使命", "Mission", "Mission"], values: ["协会价值", "Values", "Valeurs"], history: ["发展历程", "History", "Histoire"], organisation: ["组织架构", "Organisation", "Organisation"], credentials: ["资质与治理", "Credentials", "Accréditations"], contact: ["联系我们", "Contact", "Contact"],
  title: ["标题", "Title", "Titre"], body: ["正文", "Text", "Texte"], kicker: ["栏目标题", "Heading", "Rubrique"], subtitle: ["副标题", "Subtitle", "Sous-titre"], year: ["年份", "Year", "Année"], text: ["内容", "Text", "Texte"], q: ["问题", "Question", "Question"], a: ["回答", "Answer", "Réponse"], icon: ["图标", "Icon", "Icône"], headquarters: ["总部名称", "Headquarters", "Siège"], address: ["地址", "Address", "Adresse"], phone: ["电话", "Phone", "Téléphone"], email: ["邮箱", "Email", "E-mail"], hours: ["办公时间", "Hours", "Horaires"], faq_title: ["常见问题标题", "FAQ title", "Titre FAQ"], form_title: ["留言标题", "Message title", "Titre du formulaire"], sent_title: ["提交成功标题", "Success title", "Titre de confirmation"], sent_body: ["提交成功内容", "Success message", "Confirmation"], items: ["条目", "Items", "Éléments"], cat: ["类别", "Category", "Catégorie"], excerpt: ["摘要", "Excerpt", "Résumé"],
};

export default function ContentManager({ kind }: { kind: "about" | "news" | "contact" }) {
  const { lang } = useLang();
  const index = ["zh", "en", "fr"].indexOf(lang);
  const L = (zh: string, en: string, fr: string) => [zh, en, fr][index] || zh;
  const label = (key: string) => labels[key]?.[index] || key;
  const table = kind === "about" ? "association_content" : kind === "news" ? "news_items" : "contact_content";
  const defaults = kind === "about" ? ABOUT_DEFAULTS : kind === "news" ? NEWS_DEFAULTS : CONTACT_DEFAULTS;
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [editing, setEditing] = useState<ContentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await externalSupabase.from(table).select("*").order("display_order");
      if (error) throw error;
      setRows(kind === "news" ? data || [] : defaults.map(row => data?.find((saved: ContentRow) => saved["section_key"] === row["section_key"]) || structuredClone(row)));
    } catch {
      setRows(structuredClone(defaults));
      setMessage(L("内容读取失败，请先在外部数据库运行更新后的 SQL 脚本。", "Content could not load. Run the updated external SQL script first.", "Lecture impossible. Exécutez le script SQL externe mis à jour."));
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [table]);
  const set = (key: string, value: unknown) => setEditing(row => row ? { ...row, [key]: value } : row);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setBusy(true); setMessage("");
    try {
      const { error } = await externalSupabase.rpc("admin_save_content", { p_token: getAdminToken(), p_table: table, p_id: editing["id"] || null, p: editing });
      if (error) throw error;
      setEditing(null); await load();
      setMessage(L("内容已保存。", "Content saved.", "Contenu enregistré."));
    } catch { setMessage(L("保存失败，请确认外部数据库已运行更新后的 SQL 脚本，且登录未过期。", "Save failed. Check the external SQL setup and your session.", "Échec. Vérifiez le script SQL externe et votre session.")); }
    finally { setBusy(false); }
  };
  const remove = async (row: ContentRow) => {
    if (!row["id"] || !window.confirm(L("确定删除此新闻？", "Delete this news item?", "Supprimer cette actualité ?"))) return;
    setBusy(true); setMessage("");
    try {
      const { error } = await externalSupabase.rpc("admin_delete_news", { p_token: getAdminToken(), p_id: row["id"] });
      if (error) throw error;
      await load();
    } catch { setMessage(L("删除失败，请重试。", "Delete failed. Please retry.", "Échec de la suppression.")); }
    finally { setBusy(false); }
  };
  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage("");
    try {
      if (!file.type.startsWith("image/")) throw new Error("image");
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await adminStorage().from("treasures").upload(path, file, { contentType: file.type });
      if (error) throw error;
      set("image_url", externalSupabase.storage.from("treasures").getPublicUrl(path).data.publicUrl);
    } catch { setMessage(L("图片上传失败，请检查登录后重试。", "Upload failed. Check your session and retry.", "Échec du téléversement.")); }
    finally { setBusy(false); e.target.value = ""; }
  };
  const renderValue = (value: any, onChange: (value: any) => void, key: string): React.ReactNode => {
    if (Array.isArray(value)) return <div className="space-y-3">{value.map((item, i) => <div key={i} className="flex gap-2 items-start"><div className="min-w-0 flex-1">{renderValue(item, v => onChange(value.map((old, n) => n === i ? v : old)), key)}</div><Button type="button" variant="adminOutline" size="icon" aria-label={L("移除条目", "Remove item", "Retirer")} onClick={() => onChange(value.filter((_, n) => n !== i))}><X /></Button></div>)}<Button type="button" variant="adminOutline" onClick={() => onChange([...value, typeof value[0] === "object" ? Object.fromEntries(Object.keys(value[0]).map(k => [k, ""])) : ""])}><Plus />{L("添加条目", "Add item", "Ajouter")}</Button></div>;
    if (value && typeof value === "object") return <div className="space-y-3">{Object.entries(value).map(([k, v]) => <div key={k}><span className="block text-xs text-admin-ink/60 mb-1">{label(k)}</span>{renderValue(v, next => onChange({ ...value, [k]: next }), k)}</div>)}</div>;
    if (key === "icon") return <select className={input} value={value || "Users"} onChange={e => onChange(e.target.value)}>{["Users", "Landmark", "ScrollText", "Award", "Scale", "Building2"].map(icon => <option key={icon}>{icon}</option>)}</select>;
    return ["body", "text", "a", "subtitle", "sent_body", "excerpt"].includes(key) ? <textarea rows={4} className={input} value={value || ""} onChange={e => onChange(e.target.value)} /> : <input className={input} value={value ?? ""} onChange={e => onChange(e.target.value)} />;
  };
  return <section className="px-[6vw] py-12 text-admin-ink">
    <div className="flex flex-wrap justify-between items-center gap-4 mb-8"><h2 className="font-serif-disp text-2xl">{kind === "about" ? L("关于协会管理", "Association Management", "Gestion de l'association") : kind === "news" ? L("新闻动态管理", "News Management", "Gestion des actualités") : L("联系我们管理", "Contact Management", "Gestion des contacts")}</h2>{kind === "news" && <Button variant="admin" onClick={() => { setMessage(""); setEditing({ image_url: "", publication_date: new Date().toISOString().slice(0, 10), display_order: rows.length, homepage_featured: false, ...Object.fromEntries(["zh", "en", "fr"].flatMap(l => ["title", "cat", "excerpt", "body"].map(k => [`${k}_${l}`, ""]))) }); }}><Plus />{L("新增新闻", "Add News", "Ajouter une actualité")}</Button>}</div>
    {message && <p role="status" className="mb-6 text-sm text-admin-accent">{message}</p>}
    {loading ? <Loader2 className="animate-spin" /> : editing ? <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between gap-3"><h3 className="text-lg">{label(editing["section_key"] || "title")}</h3><Button type="button" variant="adminOutline" size="icon" aria-label={L("关闭编辑", "Close editor", "Fermer")} onClick={() => setEditing(null)}><X /></Button></div>
      <div className="grid lg:grid-cols-3 gap-8">{(["zh", "en", "fr"] as const).map(l => <div key={l} className="min-w-0 space-y-4"><h4 className="border-b border-admin-gold/40 pb-2">{{ zh: "中文", en: "English", fr: "Français" }[l]}</h4>{kind === "news" ? ["title", "cat", "excerpt", "body"].map(k => <label key={k} className="block space-y-1"><span className="text-xs text-admin-ink/60">{label(k)}</span>{renderValue(editing[`${k}_${l}`] || "", v => set(`${k}_${l}`, v), k)}</label>) : renderValue(editing[`content_${l}`] || {}, v => set(`content_${l}`, v), "content")}</div>)}</div>
      <div className="space-y-3 max-w-xl"><label className="block text-sm">{L("图片链接", "Image URL", "URL de l'image")}<input className={`${input} mt-1`} value={editing["image_url"] || ""} onChange={e => set("image_url", e.target.value)} /></label>{editing["image_url"] && <img src={editing["image_url"]} alt="" className="w-40 aspect-[4/3] object-cover" />}<Button type="button" variant="adminOutline" asChild><label className="cursor-pointer"><Upload />{L("上传图片", "Upload Image", "Téléverser")}<input type="file" className="hidden" accept="image/*" disabled={busy} onChange={upload} /></label></Button>
      {kind === "news" && <><label className="block text-sm">{L("发布日期", "Publication date", "Date de publication")}<input required type="date" className={`${input} mt-1`} value={editing["publication_date"]} onChange={e => set("publication_date", e.target.value)} /></label><label className="flex gap-2 text-sm"><input type="checkbox" checked={editing["homepage_featured"]} onChange={e => set("homepage_featured", e.target.checked)} />{L("首页显示", "Show on homepage", "Afficher à l'accueil")}</label></>}
      <label className="block text-sm">{L("排序", "Order", "Ordre")}<input type="number" className={`${input} mt-1 max-w-32`} value={editing["display_order"]} onChange={e => set("display_order", Number(e.target.value))} /></label></div>
      <div className="flex gap-3"><Button variant="admin" disabled={busy}><Save />{busy ? L("保存中…", "Saving…", "Enregistrement…") : L("保存", "Save", "Enregistrer")}</Button><Button type="button" variant="adminOutline" disabled={busy} onClick={() => setEditing(null)}>{L("取消", "Cancel", "Annuler")}</Button></div>
    </form> : <div className="divide-y divide-admin-gold/25">{rows.map((row, i) => <div key={row["id"] || row["section_key"] || i} className="flex flex-wrap items-center justify-between gap-4 py-5"><div className="min-w-0 flex-1">{kind === "news" && <p className="text-xs text-admin-ink/50">{row["publication_date"]}</p>}<h3 className="break-words font-serif-disp text-xl">{kind === "news" ? row[`title_${lang}`] || row["title_zh"] : label(row["section_key"])}</h3></div><div className="flex gap-2"><Button variant="adminOutline" disabled={busy} onClick={() => { setMessage(""); setEditing(structuredClone(row)); }}><Pencil />{L("编辑", "Edit", "Modifier")}</Button>{kind === "news" && <Button variant="adminOutline" size="icon" disabled={busy || !row["id"]} aria-label={L("删除新闻", "Delete news", "Supprimer")} onClick={() => void remove(row)}><Trash2 /></Button>}</div></div>)}</div>}
  </section>;
}