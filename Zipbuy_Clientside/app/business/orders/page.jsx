"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, ChevronDown, Eye, Package } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/api";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  processing: "bg-indigo-50 text-indigo-600 border-indigo-200",
  shipped: "bg-purple-50 text-purple-600 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function BusinessOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "business" && decoded.verificationStatus === "approved") {
        fetchOrders();
        return;
      }
    } catch {} finally { setLoading(false); }
  }, [page, statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter) params.set("status", statusFilter);
      const { data } = await api.get(`/api/business/orders?${params}`);
      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch {} finally { setLoading(false); }
  }

  const filtered = orders.filter((o) =>
    !search || (o._id?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage incoming orders</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 px-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC831] text-gray-600">
            <option value="">All Status</option>
            {Object.keys(STATUS_STYLES).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 pl-9 pr-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC831] placeholder:text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <ShoppingCart size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-900">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers place them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Order ID", "Products", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">#{order._id.slice(-8)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-600">{order.cartProducts?.length || 0} item(s)</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-gray-900">RWF {(order.totalAmount || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${STATUS_STYLES[order.orderStatus] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {order.orderStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye size={14} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
              <span className="text-[11px] text-gray-400">Page {pagination.page} of {pagination.pages}</span>
              <div className="flex gap-1.5">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">Prev</button>
                <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Order #{selectedOrder._id.slice(-8)}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${STATUS_STYLES[selectedOrder.orderStatus] || "bg-gray-50 text-gray-600"}`}>
                {selectedOrder.orderStatus || "pending"}
              </span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Details</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <p className="text-xs text-gray-700"><span className="text-gray-400">Name:</span> {selectedOrder.name || selectedOrder.customerEmail || "N/A"}</p>
                  <p className="text-xs text-gray-700"><span className="text-gray-400">Email:</span> {selectedOrder.customerEmail || "N/A"}</p>
                  {selectedOrder.phone && <p className="text-xs text-gray-700"><span className="text-gray-400">Phone:</span> {selectedOrder.phone}</p>}
                  {selectedOrder.address && <p className="text-xs text-gray-700"><span className="text-gray-400">Address:</span> {selectedOrder.address}</p>}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Products</p>
                <div className="space-y-2">
                  {(selectedOrder.cartProducts || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{item.productName || item.title || `Product ${i + 1}`}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-900">RWF {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</p>
                <p className="text-sm font-bold text-gray-900">RWF {(selectedOrder.totalAmount || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-xs font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
