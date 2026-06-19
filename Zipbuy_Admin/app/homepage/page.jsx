"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/api";
import Link from "next/link";
import {
  Building2, Package, ShoppingCart, Users, TrendingUp, Clock,
  CheckCircle, XCircle, AlertCircle, ArrowRight,
} from "lucide-react";

const statCards = [
  { key: "totalBusinesses", label: "Businesses", icon: Building2, href: "/businesses", color: "text-emerald-600 bg-emerald-50" },
  { key: "totalClients", label: "Customers", icon: Users, href: "/customers", color: "text-violet-600 bg-violet-50" },
  { key: "totalProducts", label: "Products", icon: Package, href: "/products", color: "text-amber-600 bg-amber-50" },
  { key: "totalOrders", label: "Orders", icon: ShoppingCart, href: "/orders", color: "text-blue-600 bg-blue-50" },
];

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBusinesses, setRecentBusinesses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchData();
  }, [router]);

  async function fetchData() {
    try {
      const { data } = await api.get("/api/admin/dashboard");
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setRecentBusinesses(data.recentBusinesses || []);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-6 h-6 border-2 border-[#0D0D0D]/20 border-t-[#FFC831] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-bold text-[#0D0D0D]">Welcome back</h2>
            <p className="text-sm text-gray-400">Here&apos;s what&apos;s happening on your marketplace today.</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ key, label, icon: Icon, href, color }) => (
              <Link key={key} href={href}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon size={16} />
                  </div>
                  <TrendingUp size={14} className="text-gray-200 group-hover:text-[#FFC831] transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0D0D0D]">{stats?.[key] || 0}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </Link>
            ))}
          </div>

          {/* Pending counts row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Clock size={14} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending Businesses</p>
                <p className="text-lg font-bold text-[#0D0D0D]">{stats?.pendingBusinesses || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <AlertCircle size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Pending Orders</p>
                <p className="text-lg font-bold text-[#0D0D0D]">{stats?.pendingOrders || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Approved Businesses</p>
                <p className="text-lg font-bold text-[#0D0D0D]">{stats?.approvedBusinesses || 0}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <XCircle size={14} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rejected</p>
                <p className="text-lg font-bold text-[#0D0D0D]">{stats?.rejectedBusinesses || 0}</p>
              </div>
            </div>
          </div>

          {/* Recent tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Businesses */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h3 className="text-sm font-bold text-[#0D0D0D]">Recent Businesses</h3>
                <Link href="/businesses" className="text-xs font-medium text-[#FFC831] hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentBusinesses.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No businesses registered yet.</p>
                ) : (
                  recentBusinesses.map((biz) => (
                    <div key={biz._id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D0D0D] truncate">{biz.businessProfile?.businessName || biz.firstName || "N/A"}</p>
                        <p className="text-xs text-gray-400 truncate">{biz.email}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        biz.verificationStatus === "approved" ? "bg-green-50 text-green-700" :
                        biz.verificationStatus === "pending" ? "bg-amber-50 text-amber-700" :
                        biz.verificationStatus === "rejected" ? "bg-red-50 text-red-600" :
                        "bg-gray-50 text-gray-500"
                      }`}>
                        {biz.verificationStatus}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h3 className="text-sm font-bold text-[#0D0D0D]">Recent Orders</h3>
                <Link href="/orders" className="text-xs font-medium text-[#FFC831] hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No orders yet.</p>
                ) : (
                  recentOrders.map((o) => (
                    <div key={o._id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D0D0D] truncate">{o.fullName}</p>
                        <p className="text-xs text-gray-400 truncate">{o.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#0D0D0D]">{o.currency === "RWF" ? "FRw" : "$"}{o.totalAmount?.toLocaleString()}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          o.orderStatus === "delivered" ? "bg-green-50 text-green-700" :
                          o.orderStatus === "cancelled" ? "bg-red-50 text-red-600" :
                          o.orderStatus === "pending" ? "bg-amber-50 text-amber-700" :
                          o.orderStatus === "confirmed" || o.orderStatus === "processing" ? "bg-blue-50 text-blue-700" :
                          "bg-gray-50 text-gray-500"
                        }`}>
                          {o.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HomePage;
