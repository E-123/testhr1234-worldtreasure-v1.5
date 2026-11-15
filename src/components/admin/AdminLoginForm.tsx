// @ts-nocheck
import React, { useState } from "react";
import { LogIn, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Seal from "@/components/layout/Seal";

const inputCls = "w-full border border-[#B8934E]/40 rounded-sm px-4 py-3 text-sm focus:border-[#8B0000] focus:outline-none";
const btnCls = "w-full flex items-center justify-center gap-2 bg-[#8B0000] text-[#FDFCF0] py-3 text-sm tracking-widest uppercase rounded-sm hover:bg-[#B8934E] transition-colors disabled:opacity-60";

export function AdminCard({ title, subtitle, children }) {
return (
<section className="min-h-screen flex items-center justify-center px-[6vw] py-32 bg-[#1A1A1A] relative overflow-hidden">
<span className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 font-zh-serif text-[30vw] leading-none text-[#FDFCF0]/[0.04] select-none">管</span>
<div className="relative w-full max-w-md bg-[#FDFCF0] rounded-sm p-10 shadow-2xl shadow-black/40">
<div className="flex flex-col items-center text-center mb-8">
<Seal size={56} />
<h1 className="font-serif-disp text-2xl text-[#8B0000] mt-4">{title}</h1>
<p className="text-sm text-[#1A1A1A]/55 mt-1">{subtitle}</p>
</div>
{children}
</div>
</section>
);
}
export { inputCls, btnCls };

export default function AdminLoginForm({ onAdmin }) {
const { lang } = useLang();
const { login } = useAuth();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const [mode, setMode] = useState("login");
const [identifier, setIdentifier] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [notice, setNotice] = useState("");

const submit = async (e) => {
e.preventDefault();
setLoading(true); setError(""); setNotice("");
try {
if (mode === "forgot") {
setNotice(L("请联系超级管理员在 Supabase 中为您重置密码。", "Please ask the super admin to reset your password in Supabase.", "Demandez au super administrateur de réinitialiser votre mot de passe."));
return;
}
const ok = await login(identifier, password);
if (!ok) throw new Error(L("用户名或密码不正确。", "Incorrect username or password.", "Identifiants incorrects."));
onAdmin();
} catch (err) {
setError(err?.message || L("登录失败，请检查账号与密码。", "Sign-in failed — check your credentials.", "Échec de la connexion."));
} finally {
setLoading(false);
}
};

const forgot = mode === "forgot";
return (
<AdminCard
title={forgot ? L("忘记密码", "Forgot Password", "Mot de passe oublié") : L("管理员登录", "Admin Login", "Connexion admin")}
subtitle={forgot ? L("输入用户名或邮箱", "Enter your username or email", "Saisissez votre identifiant") : L("管理瑰宝展示的图片与资料", "Manage gallery images & records", "Gérez la galerie")}
>
<form onSubmit={submit} className="space-y-4">
<input required value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" placeholder={L("用户名或邮箱", "Username or email", "Identifiant ou e-mail")} className={inputCls} />
{!forgot && <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder={L("密码", "Password", "Mot de passe")} className={inputCls} />}
{error && <p className="text-center text-xs text-[#8B0000]">{error}</p>}
{notice && <p className="text-center text-xs text-[#3E5C45]">{notice}</p>}
<button type="submit" disabled={loading} className={btnCls}>
{forgot ? <Mail size={15} /> : <LogIn size={15} />}
{loading ? L("请稍候…", "Please wait…", "Patientez…") : forgot ? L("提交", "Submit", "Envoyer") : L("登录", "Sign In", "Connexion")}
</button>
<button type="button" onClick={() => { setMode(forgot ? "login" : "forgot"); setError(""); setNotice(""); }} className="w-full text-center text-xs text-[#1A1A1A]/55 hover:text-[#8B0000] transition-colors">
{forgot ? L("返回登录", "Back to sign in", "Retour à la connexion") : L("忘记密码？", "Forgot password?", "Mot de passe oublié ?")}
</button>
</form>
</AdminCard>
);
}
