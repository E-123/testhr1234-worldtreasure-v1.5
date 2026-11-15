// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, LogOut, Loader2 } from "lucide-react";
import { externalSupabase as supabase } from "@/lib/external-supabase";
import { useLang } from "@/lib/i18n";
import { getAdminToken } from "@/lib/auth";
import TreasureForm from "./TreasureForm";

export default function TreasureManager({ onLogout }) {
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [editing, setEditing] = useState(null);
const [showForm, setShowForm] = useState(false);

const load = useCallback(async () => {
setLoading(true);
try {
const { data } = await supabase.from("treasures").select("*").order("order").limit(200);
setItems(data || []);
} finally {
setLoading(false);
}
}, []);

useEffect(() => { load(); }, [load]);

const remove = async (id) => {
if (!window.confirm(L("确定删除此瑰宝？", "Delete this treasure?", "Supprimer ce trésor ?"))) return;
await supabase.rpc("admin_delete_treasure", { p_token: getAdminToken(), p_id: id });
load();
};

const openNew = () => { setEditing(null); setShowForm(true); };
const openEdit = (r) => { setEditing(r); setShowForm(true); };
const closeForm = () => { setShowForm(false); setEditing(null); };
const afterSave = () => { closeForm(); load(); };

return (
<section className="py-16 px-[6vw]">
<div className="flex flex-wrap items-center justify-between gap-4 mb-8">
<div>
<h2 className="font-serif-disp text-2xl text-[#1A1A1A]">{L("瑰宝图片管理", "Gallery Images", "Images de la galerie")}</h2>
<p className="text-sm text-[#1A1A1A]/50 mt-1">{L("上传、编辑或删除瑰宝展示的图片与资料。", "Upload, edit or remove gallery images.", "Téléversez, modifiez ou supprimez.")}</p>
</div>
<div className="flex items-center gap-3">
<button onClick={openNew} className="flex items-center gap-2 bg-[#8B0000] text-[#FDFCF0] px-5 py-3 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E] transition-colors">
<Plus size={15} /> {L("新增", "Add New", "Ajouter")}
</button>
<button onClick={onLogout} className="flex items-center gap-2 border border-[#B8934E]/50 text-[#1A1A1A]/70 px-5 py-3 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E]/10 transition-colors">
<LogOut size={15} /> {L("退出", "Sign Out", "Sortir")}
</button>
</div>
</div>

{showForm && <div className="mb-10"><TreasureForm initial={editing} onSaved={afterSave} onCancel={closeForm} /></div>}

{loading ? (
<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#B8934E]" /></div>
) : items.length === 0 ? (
<p className="text-center text-[#1A1A1A]/50 py-16">{L("暂无瑰宝，点击「新增」上传。", "No treasures yet — click Add New.", "Aucun trésor pour l'instant.")}</p>
) : (
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
{items.map((r) => (
<div key={r.id} className="border border-[#B8934E]/25 rounded-sm overflow-hidden bg-white/40">
<div className="aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
{r.image_url && <img src={r.image_url} alt={r.title_en || r.title_zh} className="w-full h-full object-cover" loading="lazy" />}
</div>
<div className="p-4">
<span className="text-[#B8934E] text-[11px] tracking-[0.2em] uppercase">{(r["dynasty_" + lang] || r.dynasty_zh)} · {(r["cat_" + lang] || r.cat_zh)}</span>
<h3 className="font-serif-disp text-lg text-[#1A1A1A] mt-1">{r["title_" + lang] || r.title_zh}</h3>
<div className="flex gap-2 mt-3">
<button onClick={() => openEdit(r)} className="flex items-center gap-1.5 text-xs text-[#8B0000] border border-[#8B0000]/30 px-3 py-1.5 rounded-sm hover:bg-[#8B0000]/[0.06] transition-colors"><Pencil size={13} /> {L("编辑", "Edit", "Modifier")}</button>
<button onClick={() => remove(r.id)} className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60 border border-[#1A1A1A]/15 px-3 py-1.5 rounded-sm hover:border-[#8B0000] hover:text-[#8B0000] transition-colors"><Trash2 size={13} /> {L("删除", "Delete", "Supprimer")}</button>
</div>
</div>
</div>
))}
</div>
)}
</section>
);
}
