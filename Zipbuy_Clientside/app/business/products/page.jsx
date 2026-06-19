"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, PlusCircle, Edit3, Trash2,
  ToggleLeft, ToggleRight, ArrowLeft,
  Eye,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/api";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "business" && decoded.verificationStatus === "approved") {
        fetchProducts();
        return;
      }
    } catch {} finally { setLoading(false); }
  }, []);

  async function fetchProducts(page = 1, search = searchQuery) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      const { data } = await api.get(`/api/business/products?${params}`);
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await api.delete(`/api/business/products/${id}`);
      if (data.success) fetchProducts(pagination.page);
    } catch { alert("Failed to delete product"); }
  }

  async function handleToggleStatus(product) {
    const newStatus = product.productStatus === "active" ? "inactive" : "active";
    try {
      await api.put(`/api/business/products/${product._id}`, { productStatus: newStatus });
      fetchProducts(pagination.page);
    } catch { alert("Failed to update product status"); }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1, searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const statusStyle = (status) => {
    switch (status) {
      case "active": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "inactive": return "bg-gray-100 text-gray-500 border-gray-200";
      case "out_of_stock": return "bg-red-50 text-red-500 border-red-200";
      case "discontinued": return "bg-gray-100 text-gray-400 border-gray-200";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/business/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={14} />
            </Link>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Products</h1>
          </div>
          <p className="text-xs text-gray-400">{pagination.total} {pagination.total === 1 ? "product" : "products"} total</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-9 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all placeholder:text-gray-400" />
          </div>
          <Link href="/business/products/create"
            className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-bold text-[#0D0D0D] bg-gradient-to-r from-[#FFC831] to-[#FFA800] rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 hover:scale-[1.02] transition-all active:scale-[0.98] whitespace-nowrap">
            <PlusCircle size={14} />
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No products yet</h3>
          <p className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
            Create your first product and start selling to verified B2B buyers across Rwanda.
          </p>
          <Link href="/business/products/create"
            className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-bold text-[#0D0D0D] bg-gradient-to-r from-[#FFC831] to-[#FFA800] rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 transition-all">
            <PlusCircle size={15} />
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => {
            const discountedPrice = Math.round(product.productPrice - (product.productPrice / 100) * (product.productDiscount || 0));
            return (
              <div key={product._id} className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all">
                <div className="flex gap-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gray-50 border border-gray-50 overflow-hidden shrink-0">
                    {product.productImages?.[0] ? (
                      <img src={product.productImages[0]} alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={18} className="text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{product.productName}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${statusStyle(product.productStatus)}`}>
                            {product.productStatus === "out_of_stock" ? "Out of Stock" :
                             product.productStatus === "discontinued" ? "Discontinued" :
                             product.productStatus.charAt(0).toUpperCase() + product.productStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-2">{product.productCategory}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.productDescription}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {(product.productDiscount || 0) > 0 ? (
                          <>
                            <p className="text-xs lg:text-sm font-bold text-gray-900">RWF {discountedPrice.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 line-through">RWF {(product.productPrice || 0).toLocaleString()}</p>
                            <span className="text-[10px] font-bold text-emerald-600">-{product.productDiscount}%</span>
                          </>
                        ) : (
                          <p className="text-xs lg:text-sm font-bold text-gray-900">RWF {(product.productPrice || 0).toLocaleString()}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-0.5">Qty: {product.productQuantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                      <Link href={`/business/products/${product._id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-[#FFC831]/10 hover:text-[#0D0D0D] transition-all">
                        <Edit3 size={12} />
                        Edit
                      </Link>
                      <button onClick={() => handleToggleStatus(product)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                          product.productStatus === "active"
                            ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                            : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        }`}>
                        {product.productStatus === "active" ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                        {product.productStatus === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all">
                        <Trash2 size={12} />
                        Delete
                      </button>
                      <Link href={`/view/${product._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors ml-auto">
                        <Eye size={12} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => fetchProducts(p)}
              className={`w-8 h-8 text-xs font-bold rounded-xl transition-all ${
                pagination.page === p
                  ? "bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] shadow-lg shadow-[#FFC831]/20"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-gray-200 hover:shadow-sm"
              }`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BusinessProducts() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
