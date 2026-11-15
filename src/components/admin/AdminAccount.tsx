// @ts-nocheck
import React, { useEffect, useState } from "react";
import { UserCog, KeyRound } from "lucide-react";
import { externalSupabase as supabase } from "@/lib/external-supabase";
import { useAuth, getAdminToken } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { inputCls, btnCls } from "@/components/admin/AdminLoginForm";

export default function AdminAccount() {
const { user, checkUserAuth } = useAuth();
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [p, setP] = useState(null);
const [msg, setMsg] = useState("");
const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
const [pwMsg, setPwMsg] = useState("");
const [busy, setBusy] = useState(false);

useEffect(() => {
if (!user) return;
setP({ ...user });
}, [user]);

const save = async (e) => {
e.preventDefault(); setBusy(true); setMsg("");
const { error } = await supabase.rpc("admin_update_profile", { p_token: getAdminToken(), p_username: p.username.trim(), p_display_name: p.display_name.trim() });
if (!error) await checkUserAuth();
setBusy(false);
setMsg(error ? (error.code === "23505" ? L("用户名已被使用。", "Username already taken.", "Identifiant déjà pris.") : error.message) : L("账号信息已保存。", "Account saved.", "Compte enregistré."));
};

const changePw = async (e) => {
e.preventDefault(); setPwMsg("");
if (pw.next.length < 8) return setPwMsg(L("新密码至少 8 位。", "New password must be at least 8 characters.", "8 caractères minimum."));
if (pw.next !== pw.confirm) return setPwMsg(L("两次输入的新密码不一致。", "Passwords do not match.", "Les mots de passe diffèrent."));
setBusy(true);
const { data: ok, error } = await supabase.rpc("admin_change_password", { p_token: getAdminToken(), p_current: pw.current, p_new: pw.next });
setBusy(false);
if (error) return setPwMsg(error.message);
if (!ok) return setPwMsg(L("当前密码不正确。", "Current password is incorrect.", "Mot de passe actuel incorrect."));
setPw({ current: "", next: "", confirm: "" });
setPwMsg(L("密码已修改。", "Password changed.", "Mot de passe modifié."));
};

if (!p) return null;
return (
<section className="px-[6vw] pt-12 grid lg:grid-cols-2 gap-8">
<form onSubmit={save} className="p-8 border border-[#B8934E]/25 rounded-sm bg-white/50 space-y-4">
<h2 className="flex items-center gap-2 font-serif-disp text-xl text-[#8B0000]"><UserCog size={18} /> {L("账号信息", "Account", "Compte")}</h2>
<label className="block text-xs text-[#1A1A1A]/55">{L("用户名", "Username", "Identifiant")}
<input required value={p.username} onChange={(e) => setP({ ...p, username: e.target.value })} className={`${inputCls} mt-1`} /></label>
<label className="block text-xs text-[#1A1A1A]/55">{L("显示姓名", "Display name", "Nom affiché")}
<input value={p.display_name} onChange={(e) => setP({ ...p, display_name: e.target.value })} className={`${inputCls} mt-1`} /></label>
<label className="block text-xs text-[#1A1A1A]/55">{L("邮箱", "Email", "E-mail")}
<input disabled value={p.email} className={`${inputCls} mt-1 opacity-60`} /></label>
<p className="text-xs text-[#1A1A1A]/45">{L("最后登录", "Last sign-in", "Dernière connexion")}: {p.last_login_at ? new Date(p.last_login_at).toLocaleString() : "—"}</p>
{msg && <p className="text-xs text-[#3E5C45]">{msg}</p>}
<button disabled={busy} className={btnCls}>{L("保存", "Save", "Enregistrer")}</button>
</form>
<form onSubmit={changePw} className="p-8 border border-[#B8934E]/25 rounded-sm bg-white/50 space-y-4">
<h2 className="flex items-center gap-2 font-serif-disp text-xl text-[#8B0000]"><KeyRound size={18} /> {L("修改密码", "Change Password", "Changer le mot de passe")}</h2>
<input required type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder={L("当前密码", "Current password", "Mot de passe actuel")} className={inputCls} />
<input required type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder={L("新密码（至少 8 位）", "New password (8+ characters)", "Nouveau mot de passe")} className={inputCls} />
<input required type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder={L("确认新密码", "Confirm new password", "Confirmer")} className={inputCls} />
{pwMsg && <p className="text-xs text-[#8B0000]">{pwMsg}</p>}
<button disabled={busy} className={btnCls}>{L("修改密码", "Change Password", "Changer")}</button>
</form>
</section>
);
}
