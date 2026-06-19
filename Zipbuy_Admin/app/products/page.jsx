"use client";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/api";
import Link from "next/link";
import {
  Package, Search, Plus, RefreshCw, Edit3, Trash2, X,
  ChevronLeft, ChevronRight, ImageOff, ToggleRight, ToggleLeft,
  Eye, Tag, AlertCircle,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: "15" });
      if (search) params.set("search", search);
      const { data } = await api.get(`/api/admin/products?${params}`);
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleToggleStatus(id) {
    try {
      await api.put(`/api/admin/products/${id}/toggle-status`);
      fetchProducts();
    } catch (err) { console.error("Toggle error:", err); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/products/${deleteTarget}`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) { console.error("Delete error:", err); }
    finally { setDeleting(false); }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0D0D0D] tracking-tight">Products</h2>
          <p className="text-sm text-gray-400 mt-0.5">{total} products across the marketplace</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full sm:w-56 bg-white border border-gray-100/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all"
            />
          </div>
          <button onClick={fetchProducts} className="p-2.5 rounded-xl bg-white border border-gray-100/80 hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-600" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <Link href="/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFC831] text-[#0D0D0D] text-sm font-bold rounded-xl hover:bg-[#FFD454] hover:shadow-md active:scale-[0.98] transition-all">
            <Plus size={15} /> Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#0D0D0D]/10 border-t-[#FFC831] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-200" />
            </div>
            <p className="text-sm font-semibold text-gray-400">No products found</p>
            <p className="text-xs text-gray-300 mt-1">{search ? "Try a different search term" : "Products will appear here once businesses add them"}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Business</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Category</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-5 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const discounted = p.productDiscount > 0
                      ? Math.round(p.productPrice - (p.productPrice / 100) * p.productDiscount)
                      : null;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                              {p.productImages?.[0] ? (
                                <img src={p.productImages[0]} alt={p.productName} className="w-full h-full object-cover" />
                              ) : (
                                <ImageOff size={16} className="text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0D0D0D] truncate max-w-[200px]">{p.productName}</p>
                              <p className="text-[10px] text-gray-400 font-mono">#{p._id?.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell max-w-[130px] truncate">
                          {p.business?.businessProfile?.businessName || p.business?.email || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 hidden lg:table-cell">
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100/50">
                            {p.productCategory || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-sm font-bold text-[#0D0D0D]">
                              FRw {(p.productPrice || 0).toLocaleString()}
                            </p>
                            {discounted && (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] line-through text-gray-400">
                                  FRw {(p.productPrice || 0).toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">-{p.productDiscount}%</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-bold ${(p.productQuantity || 0) > 10 ? 'text-green-600' : (p.productQuantity || 0) > 0 ? 'text-amber-600' : 'text-red-400'}`}>
                              {p.productQuantity || 0}
                            </span>
                            {(p.productQuantity || 0) <= 5 && (
                              <AlertCircle size={11} className="text-amber-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            p.productStatus !== "inactive" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-gray-50 text-gray-500 border border-gray-100"
                          }`}>
                            {p.productStatus || "active"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleToggleStatus(p._id)}
                              className="p-2 rounded-xl hover:bg-gray-100/80 transition-all opacity-0 group-hover:opacity-100 lg:opacity-100"
                              title={p.productStatus === "inactive" ? "Activate" : "Deactivate"}>
                              {p.productStatus !== "inactive"
                                ? <ToggleRight size={15} className="text-emerald-500" />
                                : <ToggleLeft size={15} className="text-gray-400" />
                              }
                            </button>
                            <Link href={`/product/${p._id}`}
                              className="p-2 rounded-xl hover:bg-gray-100/80 transition-all opacity-0 group-hover:opacity-100 lg:opacity-100">
                              <Eye size={14} className="text-gray-400" />
                            </Link>
                            <Link href={`/product/edit/${p._id}`}
                              className="p-2 rounded-xl hover:bg-gray-100/80 transition-all opacity-0 group-hover:opacity-100 lg:opacity-100">
                              <Edit3 size={14} className="text-gray-400" />
                            </Link>
                            <button onClick={() => setDeleteTarget(p._id)}
                              className="p-2 rounded-xl hover:bg-red-50 transition-all">
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Page <span className="font-semibold text-gray-600">{page}</span> of <span className="font-semibold text-gray-600">{totalPages}</span>
              </p>
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
                        p === page
                          ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm"
                          : "bg-white border border-gray-100/80 text-gray-500 hover:bg-gray-50"
                      }`}>
                      {p}
                    </button>
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

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-[#0D0D0D] mb-1">Delete Product</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2.5">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-md disabled:opacity-50 transition-all">
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
