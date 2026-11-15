import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#1A1A1A] font-body-wt">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
