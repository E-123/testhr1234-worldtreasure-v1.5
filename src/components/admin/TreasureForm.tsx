// @ts-nocheck
import React, { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { externalSupabase as supabase } from "@/lib/external-supabase";
import { useLang } from "@/lib/i18n";
import { adminStorage, getAdminToken } from "@/lib/auth";

const EMPTY = {
image_url: "", title_zh: "", title_en: "", title_fr: "",
dynasty_zh: "", dynasty_en: "", dynasty_fr: "",
cat_zh: "", cat_en: "", cat_fr: "",
description_zh: "", description_en: "", description_fr: "",
tags_zh: "", tags_en: "", tags_fr: "", order: 0,
};

export const parseTags = (value) => [...new Set(String(value || "").split(/[,，\n]/).map((tag) => tag.trim()).filter(Boolean))];
const tagText = (value) => Array.isArray(value) ? value.join(", ") : value || "";

export default function TreasureForm({ initial, onSaved, onCancel }) {
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
const [uploading, setUploading] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");

const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

const onFile = async (e) => {
const file = e.target.files?.[0];
if (!file) return;
setUploading(true);
setError("");
try {
if (!getAdminToken()) throw new Error(L("登录已失效，请重新登录。", "Your session has expired. Please sign in again.", "Session expirée. Veuillez vous reconnecter."));
if (!file.type.startsWith("image/")) throw new Error(L("请选择图片文件。", "Please choose an image file.", "Veuillez choisir une image."));
const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
const up = await adminStorage().from("treasures").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });
if (up.error) throw up.error;
const file_url = supabase.storage.from("treasures").getPublicUrl(path).data.publicUrl;
set("image_url", file_url);
} catch (err) {
const reason = err?.message ? ` ${err.message}` : "";
setError(`${L("图片上传失败，请重新登录后重试。", "Image upload failed. Please sign in again and retry.", "Échec du téléversement. Reconnectez-vous et réessayez.")}${reason}`);
} finally {
setUploading(false);
e.target.value = "";
}
};

const save = async (e) => {
e.preventDefault();
setSaving(true);
setError("");
const { id: _id, created_at: _c, ...rest } = form;
const payload = { ...rest, tags_zh: parseTags(form.tags_zh), tags_en: parseTags(form.tags_en), tags_fr: parseTags(form.tags_fr), order: Number(form.order) || 0 };
try {
const res = await supabase.rpc("admin_save_treasure", { p_token: getAdminToken(), p_id: initial?.id || null, p: payload });
if (res.error) throw res.error;
onSaved();
} catch (err) {
setError(L("保存失败，请重试。", "Save failed, please retry.", "Échec de l'enregistrement."));
} finally {
setSaving(false);
}
};

const input = "w-full border border-[#B8934E]/40 rounded-sm px-3 py-2 text-sm focus:border-[#8B0000] focus:outline-none bg-white/60";
const labelCls = "block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-1";

return (
<form onSubmit={save} className="bg-[#FDFCF0] border border-[#B8934E]/30 rounded-sm p-6 md:p-8 space-y-5">
<div className="flex items-center justify-between">
<h3 className="font-serif-disp text-xl text-[#8B0000]">{initial?.id ? L("编辑瑰宝", "Edit Treasure", "Modifier") : L("新增瑰宝", "Add Treasure", "Ajouter")}</h3>
<button type="button" onClick={onCancel} className="text-[#1A1A1A]/40 hover:text-[#8B0000]"><X size={20} /></button>
</div>

<div>
<span className={labelCls}>{L("图片", "Image", "Image")}</span>
<div className="flex items-start gap-4">
<div className="w-28 h-28 shrink-0 rounded-sm overflow-hidden bg-[#1A1A1A] flex items-center justify-center">
{form.image_url ? <img src={form.image_url} alt="" className="w-full h-full object-cover" /> : <Upload size={22} className="text-[#FDFCF0]/40" />}
</div>
<label className="inline-flex items-center gap-2 cursor-pointer border border-[#B8934E]/50 text-[#8B0000] px-4 py-2.5 text-xs tracking-widest uppercase rounded-sm hover:bg-[#B8934E]/10 transition-colors">
{uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
{uploading ? L("上传中…", "Uploading…", "Téléversement…") : L("上传图片", "Upload Image", "Téléverser")}
<input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={uploading} />
</label>
</div>
</div>

<Row label={L("标题", "Title", "Titre")}>
<input className={input} placeholder="中文" value={form.title_zh} onChange={(e) => set("title_zh", e.target.value)} />
<input className={input} placeholder="English" value={form.title_en} onChange={(e) => set("title_en", e.target.value)} />
<input className={input} placeholder="Français" value={form.title_fr} onChange={(e) => set("title_fr", e.target.value)} />
</Row>
<Row label={L("年代", "Dynasty", "Dynastie")}>
<input className={input} placeholder="中文" value={form.dynasty_zh} onChange={(e) => set("dynasty_zh", e.target.value)} />
<input className={input} placeholder="English" value={form.dynasty_en} onChange={(e) => set("dynasty_en", e.target.value)} />
<input className={input} placeholder="Français" value={form.dynasty_fr} onChange={(e) => set("dynasty_fr", e.target.value)} />
</Row>
<Row label={L("类别", "Category", "Catégorie")}>
<input className={input} placeholder="中文" value={form.cat_zh} onChange={(e) => set("cat_zh", e.target.value)} />
<input className={input} placeholder="English" value={form.cat_en} onChange={(e) => set("cat_en", e.target.value)} />
<input className={input} placeholder="Français" value={form.cat_fr} onChange={(e) => set("cat_fr", e.target.value)} />
</Row>
<Row label={L("瑰宝描述", "Description", "Description")}>
<textarea rows={4} className={`${input} resize-y`} placeholder="中文" value={form.description_zh} onChange={(e) => set("description_zh", e.target.value)} />
<textarea rows={4} className={`${input} resize-y`} placeholder="English" value={form.description_en} onChange={(e) => set("description_en", e.target.value)} />
<textarea rows={4} className={`${input} resize-y`} placeholder="Français" value={form.description_fr} onChange={(e) => set("description_fr", e.target.value)} />
</Row>
<Row label={L("瑰宝标签（逗号分隔，可多个）", "Tags (comma-separated)", "Étiquettes (séparées par des virgules)")}>
<input className={input} placeholder="瓷器, 宋代" value={tagText(form.tags_zh)} onChange={(e) => set("tags_zh", e.target.value)} />
<input className={input} placeholder="Porcelain, Song" value={tagText(form.tags_en)} onChange={(e) => set("tags_en", e.target.value)} />
<input className={input} placeholder="Porcelaine, Song" value={tagText(form.tags_fr)} onChange={(e) => set("tags_fr", e.target.value)} />
</Row>
<div>
<span className={labelCls}>{L("排序", "Order", "Ordre")}</span>
<input type="number" className={`${input} max-w-[120px]`} value={form.order} onChange={(e) => set("order", e.target.value)} />
</div>

{error && <p className="text-xs text-[#8B0000]">{error}</p>}

<div className="flex gap-3 pt-2">
<button type="submit" disabled={saving || uploading || !form.image_url || !form.title_zh} className="bg-[#8B0000] text-[#FDFCF0] px-7 py-3 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E] transition-colors disabled:opacity-60">
{saving ? L("保存中…", "Saving…", "Enregistrement…") : L("保存", "Save", "Enregistrer")}
</button>
<button type="button" onClick={onCancel} className="border border-[#B8934E]/50 text-[#1A1A1A]/70 px-7 py-3 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E]/10 transition-colors">
{L("取消", "Cancel", "Annuler")}
</button>
</div>
</form>
);
}

function Row({ label, children }) {
return (
<div>
<span className="block text-xs uppercase tracking-widest text-[#1A1A1A]/50 mb-1">{label}</span>
<div className="grid sm:grid-cols-3 gap-3">{children}</div>
</div>
);
}