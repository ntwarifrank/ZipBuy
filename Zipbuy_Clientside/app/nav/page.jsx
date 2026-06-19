"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import userDataStore from "../store/userDataController";
import api from "../../lib/api";
import "./page.css";
import {
  ShoppingCart, Search, Sun, Moon, LogOut, User, X, Store, Heart,
  Menu, ChevronDown, LayoutGrid, Shirt, Smartphone, Trophy, Heart as HeartIcon,
  Gem, Home, ShoppingBag, Package, Baby, Gift, PawPrint, BookOpen,
  Wrench, Building2, Lightbulb, Refrigerator, Car, Zap, Shield,
  Microscope, Cpu, Truck, Wheat, Box, Handshake, Sofa, Sparkles,
} from "lucide-react";
import useToggleModeStore from "../store/modeController";
import useSearchStore from "../store/handlesearch";
import { useSearchedStore } from "../store/handlesearch.js";
import useCartStore from "../store/cartController";
import { jwtDecode } from "jwt-decode";

const CATEGORY_ICONS = {
  "Apparel & Accessories": Shirt, "Consumer Electronics": Smartphone,
  "Sports & Entertainment": Trophy, "Beauty": HeartIcon,
  "Jewelry, Eyewear & Watches": Gem, "Home & Garden": Home,
  "Sportswear & Outdoor Apparel": Shirt, "Shoes & Accessories": ShoppingBag,
  "Luggage, Bags & Cases": ShoppingBag, "Packaging & Printing": Package,
  "Parents, Kids & Toys": Baby, "Personal Care & Home Care": HeartIcon,
  "Health & Medical": HeartIcon, "Gifts & Crafts": Gift,
  "Pet Supplies": PawPrint, "School & Office Supplies": BookOpen,
  "Industrial Machinery": Wrench, "Commercial Equipment": Wrench,
  "Construction & Building": Building2, "Construction & Real Estate": Building2,
  "Furniture": Sofa, "Lights & Lighting": Lightbulb,
  "Home Appliances": Refrigerator, "Automotive Supplies & Tools": Car,
  "Vehicle Parts & Accessories": Car, "Tools & Hardware": Wrench,
  "Renewable Energy": Zap, "Electrical Equipment": Zap,
  "Safety & Security": Shield, "Material Handling": Package,
  "Testing Instruments": Microscope, "Power Transmission": Zap,
  "Electronic Components": Cpu, "Vehicles & Transportation": Truck,
  "Agriculture & Food": Wheat, "Raw Materials": Box,
  "Fabrication Services": Wrench, "Service Equipment": Handshake,
};

const Nav = () => {
  const router = useRouter();
  const { cartIds } = useCartStore();
  const { userData, distroyUserData } = userDataStore();
  const { search, setSearch } = useSearchStore();
  const { mode, toggleMode } = useToggleModeStore();
  const { setSearchedProduct } = useSearchedStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [catDropdown, setCatDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const d = jwtDecode(token);
      if (d.role === "business") {
        router.replace(d.verificationStatus === "approved" ? "/business/dashboard" : "/business/onboarding");
      }
    } catch { localStorage.removeItem("token"); }
  }, [router]);

  useEffect(() => {
    const cached = localStorage.getItem("zipbuy_categories_v2");
    if (cached) {
      try { setCategories(JSON.parse(cached)); } catch {}
    }
    api.get("/categories").then((res) => {
      const cats = res.data.categories || [];
      setCategories(cats);
      localStorage.setItem("zipbuy_categories_v2", JSON.stringify(cats));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const timer = setTimeout(() => searchSpecificProduct(), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchedProduct([]);
    }
  }, [search]);

  async function searchSpecificProduct() {
    try {
      const res = await api.post("/search", { search });
      if (res.status == 200) {
        setSearchedProduct(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function changeMode() {
    toggleMode();
  }

  function handleLogout() {
    try { api.post("/api/logout"); } catch {}
    distroyUserData();
    localStorage.removeItem("token");
    router.push("/login");
  }

  function handleCatSelect(cat) {
    setSearch(cat);
    setCatDropdown(false);
    router.push("/buyingpage");
  }

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0D0D0D] via-[#1a1a1a] to-gray-900 border-b border-white/5 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
        {/* Main row */}
        <div className="flex items-center justify-between h-12 sm:h-14 gap-2">

          {/* Left: mobile menu + brand + categories */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu size={18} className="text-gray-400" />
            </button>

            {/* Brand */}
            <Link href="/buyingpage" className="flex items-center gap-1.5 group shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#FFC831] to-[#FFD454] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-[#0D0D0D] font-black text-xs sm:text-sm tracking-tight">Z</span>
              </div>
              <span className="hidden sm:inline font-bold text-base sm:text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">
                Zip<span className="text-[#FFC831]">Buy</span>
              </span>
            </Link>

            {/* Categories dropdown (desktop) */}
            <div ref={catRef} className="relative hidden sm:block">
              <button onClick={() => setCatDropdown(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                <LayoutGrid size={14} className="text-[#FFC831]" />
                Categories
                <ChevronDown size={12} className={`transition-transform duration-200 ${catDropdown ? "rotate-180" : ""}`} />
              </button>
              {catDropdown && (
                <div className="absolute top-full left-0 mt-1.5 w-[240px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto scrollbar-thin">
                  <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-white/5 sticky top-0">
                    Shop by Category
                  </div>
                  <div className="p-1">
                    {categories.map((cat) => { const Icon = CATEGORY_ICONS[cat.name] || Package; return (
                      <button key={cat.name} onClick={() => handleCatSelect(cat.name)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left">
                        <Icon size={14} className="text-gray-500 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ); })}
                  </div>
                  <button onClick={() => { setSearch(""); setCatDropdown(false); router.push("/buyingpage"); }}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 text-[10px] font-medium text-gray-500 hover:text-gray-300 border-t border-white/10 transition-colors sticky bottom-0 bg-[#1a1a1a]">
                    <X size={11} />
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search (desktop) */}
          <div ref={searchRef} className="hidden sm:block flex-1 max-w-md mx-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSearchDropdown(true); }}
                onFocus={() => setSearchDropdown(true)}
                className="w-full h-9 pl-9 pr-3 text-sm bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-full focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
              />
              {searchDropdown && search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-white/5">
                    Searching for &ldquo;{search}&rdquo;
                  </div>
                  <Link href="/buyingpage" onClick={() => setSearchDropdown(false)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#FFC831] border-t border-white/10 hover:bg-white/5 transition-colors">
                    <Search size={12} />
                    View all results
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            {/* mobile search toggle */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              {searchOpen ? <X size={18} className="text-gray-400" /> : <Search size={18} className="text-gray-400" />}
            </button>

            {/* theme */}
            <button onClick={changeMode} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Toggle theme">
              {mode ? <Moon size={17} className="text-gray-300" /> : <Sun size={17} className="text-gray-300" />}
            </button>

            {/* stores */}
            <Link href="/stores"
              className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-300 hover:text-[#FFC831] transition-colors">
              <Store size={14} />
              Stores
            </Link>

            {/* cart */}
            <Link href="/checkCart" className="relative p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ShoppingCart size={18} className="text-gray-300" />
              {cartIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartIds.length}
                </span>
              )}
            </Link>

            {/* favorites */}
            <Link href="/favorites" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Favorites">
              <Heart size={17} className="text-gray-300" />
            </Link>

            {/* profile dropdown */}
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileDropdown(o => !o)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" title="Account">
                <User size={18} className="text-gray-300" />
              </button>
              {profileDropdown && (
                <div className="absolute top-full right-0 mt-1.5 w-[200px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-1">
                    <Link href="/profile" onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <User size={15} className="text-gray-500" />
                      My Profile
                    </Link>
                    <Link href="/favorites" onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <Heart size={15} className="text-red-400" />
                      Favorites
                    </Link>
                    <Link href="/stores" onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <Store size={15} className="text-[#FFC831]" />
                      Stores
                    </Link>
                  </div>
                  <div className="border-t border-white/10 p-1">
                    <button onClick={() => { handleLogout(); setProfileDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text" placeholder="Search products..." value={search}
                onChange={(e) => { setSearch(e.target.value); }}
                autoFocus
                className="w-full h-9 pl-9 pr-3 text-sm bg-white/10 border border-white/10 text-white placeholder-gray-400 rounded-full focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#0D0D0D] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-3 py-2 space-y-1">
            {/* Categories header */}
            <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              <LayoutGrid size={12} className="text-[#FFC831]" />
              Categories
            </div>
            <div className="grid grid-cols-2 gap-1 pb-2">
              {categories.map((cat) => { const Icon = CATEGORY_ICONS[cat.name] || Package; return (
                <button key={cat.name} onClick={() => { handleCatSelect(cat.name); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition-all text-left">
                  <Icon size={13} className="text-gray-500 shrink-0" />
                  <span className="truncate leading-tight">{cat.name}</span>
                </button>
              ); })}
            </div>
            <div className="border-t border-white/10" />
            <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Quick Links
            </div>
            <Link href="/stores" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">
              <Store size={16} /> Stores
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">
              <User size={16} /> Profile
            </Link>
            <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors">
              <Heart size={16} /> Favorites
            </Link>
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
