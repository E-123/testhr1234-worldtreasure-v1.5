import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Admin from "@/components/pages/Admin";

// Stable references: a fresh object per useAuth() call makes child effects re-run forever.
const { navigate, logout, order, auth } = vi.hoisted(() => {
  const user = { id: "u1", username: "admin", display_name: "管理员", email: "a@b.org", last_login_at: null };
  const logout = vi.fn(async () => {});
  const order: string[] = [];
  const navigate = vi.fn(() => {
    order.push("navigate");
  });
  const auth = {
    user,
    isAdmin: true,
    isLoadingAuth: false,
    checkUserAuth: async () => true,
    logout: () => {
      order.push("logout");
      return logout();
    },
  };
  return { navigate, logout, order, auth };
});

vi.mock("@tanstack/react-router", () => ({ useNavigate: () => navigate }));
vi.mock("@/lib/auth", () => ({ getAdminToken: () => "validated-session", adminStorage: vi.fn(), useAuth: () => auth }));
vi.mock("@/lib/external-supabase", () => ({
  externalSupabase: { rpc: vi.fn(async () => ({ data: null, error: null })), from: vi.fn() },
}));
vi.mock("@/lib/i18n", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  useLang: () => ({ lang: "zh", t: (key: string) => key }),
}));

afterEach(() => {
  cleanup();
  order.length = 0;
  vi.clearAllMocks();
});

describe("administrator sign out", () => {
  it("ends the session then goes to the homepage", async () => {
    render(<Admin />);

    fireEvent.click(screen.getByRole("button", { name: "退出" }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/" }));
    expect(order).toEqual(["logout", "navigate"]);
  });
});
