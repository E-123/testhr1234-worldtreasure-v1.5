// @ts-nocheck
import React, { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { externalSupabase as supabase } from "@/lib/external-supabase";
import { useLang } from "@/lib/i18n";
import { AdminCard, inputCls, btnCls } from "@/components/admin/AdminLoginForm";

export default function AdminResetPassword() {
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [ready, setReady] = useState(false);
const [pw, setPw] = useState(""); const [confirm, setConfirm] = useState("");
const [msg, setMsg] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);

useEffect(() => {
const { data: sub } = supabase.auth.onAuthStateChange((e, s) => { if (e === "PASSWORD_RECOVERY" || s) setReady(true); });
supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
return () => sub.subscription.unsubscribe();
}, []);

const submit = async (e) => {
e.preventDefault(); setMsg("");
if (pw.length < 8) return setMsg(L("新密码至少 8 位。", "At least 8 characters.", "8 caractères minimum."));
if (pw !== confirm) return setMsg(L("两次输入的新密码不一致。", "Passwords do not match.", "Les mots de passe diffèrent."));
setBusy(true);
const { error } = await supabase.auth.updateUser({ password: pw });
setBusy(false);
if (error) return setMsg(error.message);
await supabase.auth.signOut();
setDone(true);
};

return (
<AdminCard title={L("重置密码", "Reset Password", "Réinitialiser")} subtitle={L("为管理员账号设置新密码", "Set a new admin password", "Définissez un nouveau mot de passe")}>
{done ? (
<div className="space-y-4 text-center">
<p className="text-sm text-[#3E5C45]">{L("密码已重置，请使用新密码登录。", "Password reset. Please sign in with your new password.", "Mot de passe réinitialisé.")}</p>
<Link to="/admin" className={btnCls}>{L("返回登录", "Back to sign in", "Retour")}</Link>
</div>
) : !ready ? (
<p className="text-center text-sm text-[#1A1A1A]/55">{L("请通过邮件中的重置链接打开此页面。", "Open this page from the reset link in your email.", "Ouvrez cette page depuis le lien reçu.")}</p>
) : (
<form onSubmit={submit} className="space-y-4">
<input required type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={L("新密码（至少 8 位）", "New password (8+ characters)", "Nouveau mot de passe")} className={inputCls} />
<input required type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={L("确认新密码", "Confirm new password", "Confirmer")} className={inputCls} />
{msg && <p className="text-center text-xs text-[#8B0000]">{msg}</p>}
<button disabled={busy} className={btnCls}><KeyRound size={15} /> {L("保存新密码", "Save New Password", "Enregistrer")}</button>
</form>
)}
</AdminCard>
);
}
