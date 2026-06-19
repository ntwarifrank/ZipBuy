"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, ImagePlus, DollarSign,
  Hash, Percent, AlignLeft, FolderOpen,
  Globe, CheckCircle2, X, Save,
} from "lucide-react";
import api from "@/lib/api";

const CATEGORIES_CACHE_KEY = "zipbuy_categories_v2";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "discontinued", label: "Discontinued" },
];

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    productName: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productDiscount: "0",
    productDescription: "",
    currency: "RWF",
    productStatus: "active",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      try { setCategoryOptions(JSON.parse(cached).map(c => c.name).concat(["Other"])); } catch {}
    }
    api.get("/categories").then((res) => {
      const cats = res.data.categories || [];
      setCategoryOptions(cats.map(c => c.name).concat(["Other"]));
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cats));
    }).catch(() => setCategoryOptions(["Other"]));
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const { data } = await api.get(`/api/business/products/${id}`);
      if (data.success) {
        const p = data.product;
        setForm({
          productName: p.productName || "",
          productPrice: p.productPrice || "",
          productQuantity: p.productQuantity || "",
          productCategory: p.productCategory || "",
          productDiscount: p.productDiscount || "0",
          productDescription: p.productDescription || "",
          currency: p.currency || "RWF",
          productStatus: p.productStatus || "active",
        });
        setExistingImages(p.productImages || []);
      }
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("productPrice", form.productPrice);
      formData.append("productQuantity", form.productQuantity);
      formData.append("productCategory", form.productCategory);
      formData.append("productDiscount", form.productDiscount || "0");
      formData.append("productDescription", form.productDescription);
      formData.append("currency", form.currency);
      formData.append("productStatus", form.productStatus);
      for (const file of newImages) {
        formData.append("images", file);
      }

      const { data } = await api.put(`/api/business/products/${id}`, formData);
      if (data.success) {
        router.push("/business/products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  function handleNewImages(files) {
    const arr = Array.from(files);
    setNewImages(arr);
    setNewImagePreviews(arr.map((f) => URL.createObjectURL(f)));
  }

  const inpClass = [
    "w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD]",
    "transition-all outline-none border-[#E4E2DC] hover:border-[#C8C5BD]",
    "focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10",
  ].join(" ");

  const labelClass = "block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
            <Package size={10} />
            Edit Listing
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-xs text-gray-400 mt-0.5">Update your product details and listings.</p>
        </div>
        <Link href="/business/products"
          className="flex items-center gap-1.5 h-9 px-4 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <ArrowLeft size={13} />
          Back
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
              <CheckCircle2 size={13} className="text-[#0D0D0D]" />
            </div>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <div className="relative">
                <Package size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input type="text" value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="Enter product name" className={inpClass + " pl-10"} required />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <div className="relative">
                <AlignLeft size={14} className="absolute left-3.5 top-3 text-[#B8B5AD] pointer-events-none" />
                <textarea value={form.productDescription}
                  onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
                  placeholder="Describe your product in detail..."
                  className={inpClass + " pl-10 min-h-[100px] resize-y"} rows={4} required />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
              <DollarSign size={13} className="text-[#0D0D0D]" />
            </div>
            Pricing & Stock
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Price (RWF) *</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input type="number" value={form.productPrice}
                  onChange={(e) => setForm({ ...form, productPrice: e.target.value })}
                  placeholder="0" className={inpClass + " pl-10"} required min="0" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Quantity *</label>
              <div className="relative">
                <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input type="number" value={form.productQuantity}
                  onChange={(e) => setForm({ ...form, productQuantity: e.target.value })}
                  placeholder="0" className={inpClass + " pl-10"} required min="1" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Discount (%)</label>
              <div className="relative">
                <Percent size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input type="number" value={form.productDiscount}
                  onChange={(e) => setForm({ ...form, productDiscount: e.target.value })}
                  placeholder="0" className={inpClass + " pl-10"} min="0" max="100" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Currency</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none z-10" />
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className={inpClass + " pl-10 appearance-none cursor-pointer"}>
                  <option value="RWF">RWF</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
              <FolderOpen size={13} className="text-[#0D0D0D]" />
            </div>
            Category & Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <FolderOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none z-10" />
              <select value={form.productCategory} onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                className={inpClass + " pl-10 appearance-none cursor-pointer"} required>
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none z-10" />
              <select value={form.productStatus} onChange={(e) => setForm({ ...form, productStatus: e.target.value })}
                className={inpClass + " pl-10 appearance-none cursor-pointer"}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
              <ImagePlus size={13} className="text-[#0D0D0D]" />
            </div>
            Product Images
          </h2>
          <div className="space-y-3">
            {existingImages.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Images</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {newImagePreviews.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">New Images</p>
                <div className="flex gap-2 flex-wrap">
                  {newImagePreviews.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-20 h-20 object-cover rounded-xl border border-[#FFC831]/40" />
                      <button type="button" onClick={() => {
                        setNewImages((prev) => prev.filter((_, idx) => idx !== i));
                        setNewImagePreviews((prev) => { URL.revokeObjectURL(prev[i]); return prev.filter((_, idx) => idx !== i); });
                      }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#FFC831]/40 hover:bg-[#FFC831]/5 transition-all">
              <ImagePlus size={20} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">Click to add new images</span>
              <input type="file" multiple accept="image/*" onChange={(e) => handleNewImages(e.target.files)} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 sm:flex-none h-11 px-8 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (
              <><span className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" />Saving...</>
            ) : (
              <><Save size={16} />Save Changes</>
            )}
          </button>
          <Link href="/business/products"
            className="h-11 px-6 flex items-center justify-center text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
