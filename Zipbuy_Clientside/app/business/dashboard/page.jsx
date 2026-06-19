"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package, PlusCircle, Store, BarChart3,
  ChevronRight, Settings, LayoutDashboard,
  Sparkles, ArrowUpRight, Activity,
} from "lucide-react";
import api from "@/lib/api";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ products: 0, active: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: profileData } = await api.get("/api/business/profile");
      if (profileData.success) setProfile(profileData.user);
    } catch { /* profile unavailable */ }

    try {
      const { data: productsData } = await api.get("/api/business/products?limit=100");
      if (productsData.success) {
        const prods = productsData.products;
        setStats({
          products: productsData.pagination.total,
          active: prods.filter((p) => p.productStatus === "active").length,
          categories: new Set(prods.map((p) => p.productCategory)).size,
        });
      }
    } catch { /* products unavailable */ }

    setLoading(false);
  }

  const StatCard = ({ icon: Icon, label, value, accent, gradient }) => (
    <div className="group relative bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient || ''}`} />
      <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${accent}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="relative min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
      <div className="relative ml-auto self-start mt-1">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <ArrowUpRight size={13} className="text-gray-300 group-hover:text-[#FFC831] transition-colors" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-[#0D0D0D] via-[#151515] to-gray-900 rounded-2xl p-6 lg:p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "linear-gradient(#FFC831 1px,transparent 1px),linear-gradient(90deg,#FFC831 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#FFC831]/5 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3">
            <Sparkles size={10} />
            Business Dashboard
          </div>
          <h2 className="text-white font-bold text-xl lg:text-2xl tracking-tight mb-1">
            Welcome back, {profile?.businessProfile?.businessName?.split(" ")[0] || "Business"}
          </h2>
          <p className="text-white/40 text-sm max-w-lg">
            Manage your products, track orders, and grow your business on ZipBuy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.products}
          accent="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200"
          gradient="bg-gradient-to-br from-emerald-50/50 to-transparent"
        />
        <StatCard
          icon={Activity}
          label="Active Listings"
          value={stats.active}
          accent="bg-gradient-to-br from-[#FFC831] to-[#FFA800] shadow-amber-200"
          gradient="bg-gradient-to-br from-amber-50/50 to-transparent"
        />
        <StatCard
          icon={BarChart3}
          label="Categories"
          value={stats.categories}
          accent="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200"
          gradient="bg-gradient-to-br from-indigo-50/50 to-transparent"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-[#FFC831]" />
          <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/business/products"
            className="group relative bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                <Package size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">Manage Products</p>
                <p className="text-[11px] text-gray-400 mt-0.5">View, edit, or remove existing products</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors shrink-0">
                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          </Link>
          <Link href="/business/products/create"
            className="group relative bg-white rounded-2xl border border-[#FFC831]/20 px-5 py-4 hover:shadow-xl hover:border-[#FFC831]/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFC831]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
                <PlusCircle size={17} className="text-[#0D0D0D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">Add New Product</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Create a new product listing for your store</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#FFC831]/10 transition-colors shrink-0">
                <ChevronRight size={14} className="text-gray-300 group-hover:text-[#0D0D0D] transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <Store size={15} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Business Profile</h3>
          </div>
          <div className="space-y-2.5">
            {[
              ["Business Name", profile?.businessProfile?.businessName || "—"],
              ["Category", profile?.businessProfile?.category || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-xs border-t border-gray-50 pt-2 first:border-0 first:pt-0">
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="font-semibold text-gray-900 truncate max-w-[200px]">{value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-2">
              <span className="text-gray-400 font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-2">
              <span className="text-gray-400 font-medium">Email</span>
              <span className="font-semibold text-gray-900 truncate max-w-[200px]">{profile?.email || "—"}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center shadow-lg shadow-amber-200">
              <Sparkles size={15} className="text-[#0D0D0D]" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Storefront</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Your approved products are visible to buyers on your public storefront page. Keep your listings fresh to attract more customers.
          </p>
          <Link href="/stores"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0D0D0D] bg-gradient-to-r from-[#FFC831] to-[#FFA800] rounded-xl px-4 py-2.5 hover:shadow-lg hover:shadow-[#FFC831]/30 hover:scale-[1.02] transition-all active:scale-[0.98]">
            <Store size={14} />
            View Your Store
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
