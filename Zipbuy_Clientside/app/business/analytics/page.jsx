"use client";
import { useState, useEffect } from "react";
import { BarChart3, Package, ShoppingCart, TrendingUp, DollarSign, Clock, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

export default function BusinessAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const products = [];
      const orders = [];
      try {
        const { data } = await api.get("/api/business/products");
        if (data.success) products.push(...(data.products || []));
      } catch {}
      try {
        const { data } = await api.get("/api/business/orders");
        if (data.success) orders.push(...(data.orders || []));
      } catch {}
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.productStatus === "active").length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.orderStatus === "pending").length,
        totalRevenue,
        avgOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total Products", value: stats?.totalProducts || 0, sub: `${stats?.activeProducts || 0} active`, icon: Package, color: "from-blue-500/20 to-blue-500/5 text-blue-600" },
    { label: "Total Orders", value: stats?.totalOrders || 0, sub: `${stats?.pendingOrders || 0} pending`, icon: ShoppingCart, color: "from-amber-500/20 to-amber-500/5 text-amber-600" },
    { label: "Total Revenue", value: `RWF ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "from-emerald-500/20 to-emerald-500/5 text-emerald-600" },
    { label: "Avg Order Value", value: `RWF ${(stats?.avgOrderValue || 0).toLocaleString()}`, icon: DollarSign, color: "from-purple-500/20 to-purple-500/5 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Your business performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <ArrowUpRight size={14} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Your latest orders and updates</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
            <Clock size={18} className="text-amber-600" />
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center py-8">Detailed analytics charts coming soon. <br />Data is being tracked and will be available in the next update.</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-2xl border border-amber-200/50 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFC831]/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-[#0D0D0D]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Full Analytics Dashboard</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Sales charts, conversion rates, and trends will appear here once you have more orders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
