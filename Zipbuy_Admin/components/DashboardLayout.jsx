"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Building2, Settings, LogOut, Menu, X,
  Bell, ChevronRight, Sparkles,
} from "lucide-react";
import api from "../lib/api";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/homepage", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Businesses", href: "/businesses", icon: Building2 },
  { label: "Categories", href: "/categories", icon: Sparkles },
  { label: "Settings", href: "/settings", icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }
      try {
        const { data } = await api.get("/api/admin/verify");
        if (!data.isAdmin && !data.isAuthenticated) {
          router.push("/login");
          return;
        }
        try {
          const me = await api.get("/api/me");
          if (me.data?.success) setAdmin(me.data.user);
          else setAdmin({ name: "Admin" });
        } catch { setAdmin({ name: "Admin" }); }
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try { await api.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isActive = (href) => pathname === href;

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={[
        "fixed top-0 left-0 z-50 h-full w-64 flex flex-col transform transition-all duration-300 ease-out",
        "lg:translate-x-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-40",
        "bg-white/90 backdrop-blur-xl border-r border-gray-100/80 shadow-sm",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}>
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100/80 shrink-0">
          <Link href="/homepage" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC831] via-[#FFD454] to-[#FFA800] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-[#0D0D0D] font-black text-sm">Z</span>
            </div>
            <div className="leading-tight">
              <span className="font-bold text-gray-900 text-base tracking-tight">ZipBuy</span>
              <span className="text-[10px] font-medium text-gray-400 block leading-tight">Admin Panel</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200/50 space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? "bg-gradient-to-r from-[#FFC831]/15 to-[#FFC831]/5 text-[#0D0D0D] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50/80 hover:text-gray-900"
                }`}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#FFC831] rounded-full" />}
                <Icon size={17} className={active ? "text-[#FFC831]" : "text-gray-400 group-hover:text-gray-600"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100/80 p-3.5 shrink-0">
          <div className="flex items-center gap-3 px-2 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC831]/25 to-[#FFA800]/10 border border-[#FFC831]/20 flex items-center justify-center text-[#0D0D0D] text-xs font-bold shrink-0 shadow-sm">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{admin?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-400 truncate leading-tight">{admin?.email || "admin@zipbuy.com"}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50/80 transition-all duration-200 group"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 lg:px-7 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-all">
                <Menu size={17} className="text-gray-500" />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#FFC831] to-[#FFA800]" />
                <h1 className="text-base font-bold text-[#0D0D0D] tracking-tight">
                  {NAV_ITEMS.find((i) => isActive(i.href))?.label || "Dashboard"}
                </h1>
              </div>
              <h1 className="sm:hidden text-base font-bold text-[#0D0D0D]">
                {NAV_ITEMS.find((i) => isActive(i.href))?.label || "Dashboard"}
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#FFC831] bg-[#FFC831]/10 px-2.5 py-0.5 rounded-full ml-1 border border-[#FFC831]/15">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="relative p-2.5 rounded-xl hover:bg-[#FFC831]/10 transition-all">
                <Bell size={17} className="text-gray-500" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFC831] ring-2 ring-white animate-pulse" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center text-[#0D0D0D] text-xs font-bold shadow-sm shrink-0">
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
