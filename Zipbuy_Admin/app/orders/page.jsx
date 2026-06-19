"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/api";
import {
  ShoppingCart, Search, RefreshCw, ChevronLeft, ChevronRight,
  X, Eye, CheckCircle, Truck, Package, AlertCircle, Clock,
} from "lucide-react";

const STATUS_OPTIONS = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const STATUS_LABELS = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

const STATUS_COLORS = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  processing: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  shipped: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  refunded: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, [filter, page]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: "15" });
      if (filter) params.set("status", filter);
      const { data } = await api.get(`/api/admin/orders?${params}`);
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch (err) { console.error("Fetch orders error:", err); }
    finally { setLoading(false); }
  }

  async function handleStatusUpdate(id, status) {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status });
      fetchOrders();
      if (viewOrder?._id === id) setViewOrder(prev => ({ ...prev, orderStatus: status }));
    } catch (err) { console.error("Update error:", err); }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0D0D0D] tracking-tight">Orders</h2>
          <p className="text-sm text-gray-400 mt-0.5">{total} orders total</p>
        </div>
        <button onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-white border border-gray-100/80 hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-600">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              filter === s
                ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm"
                : "bg-white text-gray-500 border border-gray-100/80 hover:border-gray-200 hover:shadow-sm"
            }`}>
            {s ? STATUS_LABELS[s] : "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#0D0D0D]/10 border-t-[#FFC831] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={28} className="text-gray-200" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No orders found</p>
            <p className="text-xs text-gray-300 mt-1">Orders will appear here once customers start purchasing</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Items</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-5 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o) => {
                    const sc = STATUS_COLORS[o.orderStatus] || STATUS_COLORS.pending;
                    return (
                      <tr key={o._id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                              {o.fullName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0D0D0D] truncate max-w-[140px]">{o.fullName}</p>
                              <p className="text-[10px] text-gray-400 truncate">{o.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell">{o.cartProducts?.length || 0}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-bold text-[#0D0D0D]">
                            {o.currency === "RWF" ? "FRw" : "$"}{o.totalAmount?.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${o.isPaid ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            <span className={`text-xs font-semibold ${o.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {o.isPaid ? "Paid" : "Unpaid"}
                            </span>
                            {o.paymentMethod && (
                              <span className="text-[10px] text-gray-400 ml-1">({o.paymentMethod.replace(/_/g, " ")})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {STATUS_LABELS[o.orderStatus] || o.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[11px] text-gray-400 hidden sm:table-cell">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button onClick={() => setViewOrder(o)}
                            className="p-2 rounded-xl hover:bg-gray-100/80 transition-all opacity-0 group-hover:opacity-100 lg:opacity-100">
                            <Eye size={15} className="text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10 animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-50 flex items-center justify-between px-6 py-4 rounded-t-2xl">
              <h3 className="text-sm font-bold text-[#0D0D0D]">Order Details</h3>
              <button onClick={() => setViewOrder(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer + Shipping grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Customer</p>
                  <p className="text-sm font-bold text-[#0D0D0D]">{viewOrder.fullName}</p>
                  <p className="text-xs text-gray-500">{viewOrder.email}</p>
                  {viewOrder.phone && <p className="text-xs text-gray-500">{viewOrder.phone}</p>}
                </div>
                <div className="bg-gray-50/80 rounded-xl p-3.5 space-y-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Shipping</p>
                  <p className="text-xs text-[#0D0D0D]">{viewOrder.streetAddress}</p>
                  <p className="text-xs text-gray-500">{viewOrder.city}, {viewOrder.country} {viewOrder.postalCode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Items ({viewOrder.cartProducts?.length || 0})
                </p>
                <div className="space-y-2">
                  {(viewOrder.cartProducts || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50/80 rounded-xl p-3">
                      {item.image ? (
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                          <Package size={16} className="text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#0D0D0D] truncate">{item.name || item.productName || "Product"}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity || item.qty || 1}</p>
                      </div>
                      <p className="text-xs font-bold text-[#0D0D0D] shrink-0">
                        FRw {((item.price || item.productPrice || 0) * (item.quantity || item.qty || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center bg-gradient-to-r from-[#FFC831]/10 to-[#FFC831]/5 rounded-xl px-4 py-3.5 border border-[#FFC831]/10">
                <p className="text-sm font-bold text-[#0D0D0D]">Total</p>
                <p className="text-lg font-black text-[#0D0D0D]">
                  {viewOrder.currency === "RWF" ? "FRw" : "$"}{viewOrder.totalAmount?.toLocaleString()}
                </p>
              </div>

              {/* Payment info */}
              <div className="flex items-center justify-between py-2 px-1">
                <span className="text-xs text-gray-500">
                  Payment:{viewOrder.paymentMethod ? ` ${viewOrder.paymentMethod.replace(/_/g, " ")}` : " N/A"}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  viewOrder.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {viewOrder.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>

              {/* Status update */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Update Status</p>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_OPTIONS.filter(Boolean).map((s) => {
                    const isCurrent = s === viewOrder.orderStatus;
                    return (
                      <button key={s} onClick={() => handleStatusUpdate(viewOrder._id, s)}
                        disabled={isCurrent}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isCurrent
                            ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm cursor-default"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-100/50"
                        }`}>
                        {STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
