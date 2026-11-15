import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { externalSupabase as supabase } from "@/lib/external-supabase";

// Custom admin accounts (public.admin_users) — session token kept in localStorage.
const KEY = "wtaa-admin-token";
type Admin = { id: string; username: string; display_name: string; email: string; last_login_at: string | null };
type Ctx = { user: Admin | null; isAdmin: boolean; isLoadingAuth: boolean; checkUserAuth: () => Promise<boolean>; login: (identifier: string, password: string) => Promise<boolean>; logout: () => Promise<void> };
const AuthContext = createContext<Ctx | null>(null);

export const getAdminToken = () => (typeof window === "undefined" ? null : localStorage.getItem(KEY));

// Client that sends the admin token header (used for storage uploads).
export const adminStorage = () => {
  const c: any = supabase;
  return createClient(c.supabaseUrl, c.supabaseKey, { auth: { persistSession: false, storageKey: "wtaa-admin-upload" }, global: { headers: { "x-admin-token": getAdminToken() || "" } } }).storage;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoadingAuth, setLoading] = useState(true);

  const checkUserAuth = useCallback(async () => {
    const token = getAdminToken();
    let u: Admin | null = null;
    if (token) {
      const { data } = await supabase.rpc("admin_me", { p_token: token });
      u = (Array.isArray(data) ? data[0] : data) || null;
      if (!u) localStorage.removeItem(KEY);
    }
    setUser(u);
    setLoading(false);
    return !!u;
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);

  const login = async (identifier: string, password: string) => {
    const { data, error } = await supabase.rpc("admin_login", { p_identifier: identifier.trim(), p_password: password });
    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row?.token) return false;
    localStorage.setItem(KEY, row.token);
    const { token: _t, ...u } = row;
    setUser(u);
    return true;
  };

  const logout = async () => {
    const token = getAdminToken();
    if (token) await supabase.rpc("admin_logout", { p_token: token });
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isAdmin: !!user, isLoadingAuth, checkUserAuth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}
