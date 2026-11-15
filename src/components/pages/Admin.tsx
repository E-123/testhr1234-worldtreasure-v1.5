// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { UserCog, Images, Landmark, Newspaper, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContentManager from "@/components/admin/ContentManager";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import PageHero from "@/components/common/PageHero";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminAccount from "@/components/admin/AdminAccount";
import TreasureManager from "@/components/admin/TreasureManager";

export default function Admin() {
const { isAdmin: isAdminUser, isLoadingAuth, checkUserAuth, logout } = useAuth();
const { lang } = useLang();
const L = (zh, en, fr) => ({ zh, en, fr }[lang]);
const navigate = useNavigate();
const signOut = async () => { await logout(); navigate({ to: "/" }); };
const [tab, setTab] = useState("account");
const tabs = [
{ id: "account", icon: UserCog, title: L("账号管理", "Account", "Compte") },
{ id: "gallery", icon: Images, title: L("瑰宝展示管理", "Gallery Management", "Galerie") },
{ id: "about", icon: Landmark, title: L("关于协会", "About", "À propos") },
{ id: "news", icon: Newspaper, title: L("新闻动态", "News", "Actualités") },
{ id: "contact", icon: Mail, title: L("联系我们", "Contact", "Contact") },
];

if (isLoadingAuth) {
return (
<div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
<div className="w-8 h-8 border-4 border-[#B8934E]/30 border-t-[#B8934E] rounded-full animate-spin" />
</div>
);
}

const isAdmin = isAdminUser;

if (!isAdmin) {
return <AdminLoginForm onAdmin={() => checkUserAuth()} />;
}

return (
<>
<PageHero
zh="管"
hideSeal
title={L("后台管理", "Administration", "Administration")}
subtitle={tabs.find(item => item.id === tab)?.title}
/>
<div className="px-[6vw] pt-8 flex flex-wrap items-center gap-3">
<div role="tablist" aria-label={L("内容管理", "Content management", "Gestion du contenu")} className="flex flex-wrap gap-2 flex-1">{tabs.map(({ id, icon: Icon, title }) => <Button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls={`panel-${id}`} variant={tab === id ? "admin" : "adminOutline"} onClick={() => setTab(id)}><Icon />{title}</Button>)}</div>
<Button variant="adminOutline" onClick={() => void signOut()}><LogOut />{L("退出", "Sign Out", "Sortir")}</Button>
</div>
<div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
{tab === "account" && <AdminAccount />}
{tab === "gallery" && <TreasureManager onLogout={() => void signOut()} />}
{["about", "news", "contact"].includes(tab) && <ContentManager key={tab} kind={tab} />}
</div>
</>
);
}
