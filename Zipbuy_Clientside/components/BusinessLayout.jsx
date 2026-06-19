"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  Package, PlusCircle, Store, BarChart3,
  LogOut, Bell, Menu, X,
  Settings, ShoppingCart, LayoutDashboard,
  Search, Box, ArrowUpRight,
} from "lucide-react";
import api from "../lib/api";

const NAV_SECTIONS = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Products", href: "/business/products", icon: Package },
      { label: "Orders", href: "/business/orders", icon: ShoppingCart },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Add Product", href: "/business/products/create", icon: PlusCircle },
      { label: "Analytics", href: "/business/analytics", icon: BarChart3 },
      { label: "Storefront", href: "/stores", icon: Store },
      { label: "Settings", href: "/business/onboarding", icon: Settings },
    ],
  },
];

function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch { return true; }
}

export default function BusinessLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "business") {
        router.push("/buyingpage");
        return;
      }
      sessionStorage.setItem("userRole", "business");
      if (decoded.verificationStatus !== "approved" && !pathname.startsWith("/business/onboarding")) {
        router.push("/business/onboarding");
        return;
      }
      if (!pathname.startsWith("/business/onboarding")) {
        fetchProfile();
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  async function fetchProfile() {
    try {
      const { data } = await api.get("/api/business/profile");
      if (data.success) setProfile(data.user);
    } catch {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally { setLoading(false); }
  }

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get(`/api/business/products?search=${encodeURIComponent(q)}&limit=5`);
      if (res.data.success) setSearchResults(res.data.products);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    router.push("/login");
  }

  function isActive(href) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const isOnboarding = pathname.startsWith("/business/onboarding");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={[
        "fixed top-0 left-0 z-50 h-full w-60 flex flex-col transform transition-all duration-300 ease-out",
        "lg:translate-x-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-40",
        "bg-gradient-to-b from-[#0D0D0D] via-[#151515] to-[#1A1A1A] border-r border-white/5",
        sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
      ].join(" ")}>
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/5 shrink-0">
          <Link href="/business/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center shadow-lg shadow-[#FFC831]/25">
              <span className="text-[#0D0D0D] font-black text-sm">Z</span>
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">ZipBuy</span>
              <span className="text-[10px] font-medium text-white/30 block leading-none -mt-0.5">Business</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <X size={15} className="text-white/40" />
          </button>
        </div>

        <nav className="flex-1 px-2.5 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em] mb-2 mt-5 first:mt-0">
                {section.title}
              </p>
              {section.items.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link key={label} href={href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      active
                        ? "bg-[#FFC831]/15 text-[#FFC831] shadow-lg shadow-[#FFC831]/5 border border-[#FFC831]/20"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }`}>
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FFC831] rounded-full" />}
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3 shrink-0">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC831]/20 to-[#FFA800]/10 border border-[#FFC831]/20 flex items-center justify-center text-[#FFC831] text-xs font-bold shrink-0">
              {profile?.businessProfile?.businessName?.charAt(0)?.toUpperCase() || "B"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">{profile?.businessProfile?.businessName || "Business"}</p>
              <p className="text-[10px] text-white/30 truncate leading-tight">{profile?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between px-5 lg:px-8 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Menu size={16} className="text-gray-500" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#FFC831] to-[#FFA800]" />
                <h1 className="text-sm font-bold text-gray-900">
                  {NAV_SECTIONS.flatMap(s => s.items).find(i => isActive(i.href))?.label || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div ref={searchRef} className="relative hidden sm:block">
                <div className={`flex items-center transition-all duration-300 ${searchOpen ? "w-72" : "w-44"}`}>
                  <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                  <input ref={searchInputRef} type="text" placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#FFC831] focus:bg-white focus:ring-2 focus:ring-[#FFC831]/10 transition-all placeholder:text-gray-400" />
                </div>

                {searchOpen && searchQuery.trim() && (
                  <div className="absolute top-full right-0 mt-1.5 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-black/5 overflow-hidden z-50">
                    {searching ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div>
                        <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                          Products ({searchResults.length})
                        </p>
                        {searchResults.map((p) => (
                          <Link key={p._id} href={`/business/products/${p._id}/edit`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#FFC831]/10 transition-colors">
                              <Box size={14} className="text-gray-400 group-hover:text-[#0D0D0D]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-gray-900 truncate">{p.productName}</p>
                              <p className="text-[10px] text-gray-400">{p.productCategory} &middot; RWF {(p.productPrice || 0).toLocaleString()}</p>
                            </div>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-lg ${
                              p.productStatus === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                            }`}>{p.productStatus}</span>
                          </Link>
                        ))}
                        <Link href={`/business/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[11px] font-medium text-[#FFC831] border-t border-gray-100 hover:bg-gray-50 transition-colors">
                          <Search size={12} /> View all results
                        </Link>
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <Box size={20} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-xs text-gray-400">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell size={16} className="text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center text-[#0D0D0D] text-xs font-bold shadow-lg shadow-[#FFC831]/20 shrink-0">
                  {profile?.businessProfile?.businessName?.charAt(0)?.toUpperCase() || "B"}
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{profile?.businessProfile?.businessName || "Business"}</p>
                  <p className="text-[10px] text-gray-400 truncate leading-tight">{profile?.email}</p>
                </div>
              </div>

              <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                className="sm:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Search size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
