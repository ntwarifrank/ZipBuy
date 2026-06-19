"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/api";
import {
  Users, Search, ChevronLeft, ChevronRight, Mail, ShoppingCart,
  ToggleRight, ToggleLeft, Eye, X, DollarSign, Calendar, UserCircle,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewCustomer, setViewCustomer] = useState(null);

  useEffect(() => { fetchCustomers(); }, [page, search]);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: "15" });
      if (search) params.set("search", search);
      const { data } = await api.get(`/api/admin/customers?${params}`);
      if (data.success) {
        setCustomers(data.customers);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch (err) { console.error("Fetch customers error:", err); }
    finally { setLoading(false); }
  }

  async function handleToggleStatus(id) {
    try {
      await api.put(`/api/admin/customers/${id}/toggle-status`);
      fetchCustomers();
    } catch (err) { console.error("Toggle error:", err); }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0D0D0D] tracking-tight">Customers</h2>
          <p className="text-sm text-gray-400 mt-0.5">{total} registered customers</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full sm:w-64 bg-white border border-gray-100/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#0D0D0D]/10 border-t-[#FFC831] rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-gray-200" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No customers found</p>
            <p className="text-xs text-gray-300 mt-1">{search ? "Try a different search term" : "Customers will appear once people create accounts"}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Orders</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Total Spent</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Last Order</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC831]/20 to-[#FFA800]/10 border border-[#FFC831]/15 flex items-center justify-center text-xs font-bold text-[#0D0D0D] shrink-0 shadow-sm">
                            {(c.firstName || c.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0D0D0D] truncate max-w-[140px]">
                              {c.firstName} {c.lastName || ""}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">{c.orderCount || 0}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <p className="text-sm font-bold text-[#0D0D0D]">FRw {(c.totalSpent || 0).toLocaleString()}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-gray-400 hidden sm:table-cell">
                        {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          c.isActive !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : "bg-gray-50 text-gray-500 border border-gray-100"
                        }`}>
                          {c.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewCustomer(c)}
                            className="p-2 rounded-xl hover:bg-gray-100/80 transition-all opacity-0 group-hover:opacity-100 lg:opacity-100">
                            <Eye size={15} className="text-gray-400" />
                          </button>
                          <button onClick={() => handleToggleStatus(c._id)}
                            className="p-2 rounded-xl hover:bg-gray-100/80 transition-all"
                            title={c.isActive !== false ? "Deactivate" : "Activate"}>
                            {c.isActive !== false
                              ? <ToggleRight size={15} className="text-emerald-500" />
                              : <ToggleLeft size={15} className="text-gray-400" />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
              <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-xl bg-white border border-gray-100/80 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={14} className="text-gray-500" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        p === page ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm" : "bg-white border border-gray-100/80 text-gray-500 hover:bg-gray-50"
                      }`}>{p}</button>
                  );
                })}
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-xl bg-white border border-gray-100/80 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronRight size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setViewCustomer(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h3 className="text-sm font-bold text-[#0D0D0D]">Customer Details</h3>
              <button onClick={() => setViewCustomer(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFC831]/25 to-[#FFA800]/10 border border-[#FFC831]/20 flex items-center justify-center text-lg font-bold text-[#0D0D0D] shrink-0 shadow-sm">
                  {(viewCustomer.firstName || viewCustomer.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D0D0D]">{viewCustomer.firstName} {viewCustomer.lastName || ""}</p>
                  <p className="text-xs text-gray-400">{viewCustomer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
                  <ShoppingCart size={14} className="text-gray-300" />
                  <p className="text-[10px] text-gray-400">Orders</p>
                  <p className="text-lg font-bold text-[#0D0D0D]">{viewCustomer.orderCount || 0}</p>
                </div>
                <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
                  <DollarSign size={14} className="text-gray-300" />
                  <p className="text-[10px] text-gray-400">Total Spent</p>
                  <p className="text-lg font-bold text-[#0D0D0D]">FRw {(viewCustomer.totalSpent || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {viewCustomer.mobileNumber && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 bg-gray-50/80 rounded-lg px-3 py-2">
                    <span className="text-base">&#128222;</span> {viewCustomer.mobileNumber}
                  </div>
                )}
                {viewCustomer.city && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 bg-gray-50/80 rounded-lg px-3 py-2">
                    <span className="text-base">&#127758;</span> {viewCustomer.city}{viewCustomer.country ? `, ${viewCustomer.country}` : ""}
                  </div>
                )}
                {viewCustomer.lastOrder && (
                  <div className="flex items-center gap-2.5 text-xs text-gray-500 bg-gray-50/80 rounded-lg px-3 py-2">
                    <Calendar size={13} /> Last order: {new Date(viewCustomer.lastOrder).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                )}
              </div>

              <button onClick={() => handleToggleStatus(viewCustomer._id)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  viewCustomer.isActive !== false
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                }`}>
                {viewCustomer.isActive !== false ? "Deactivate Customer" : "Activate Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
