"use client";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Save, X, ImagePlus, Package, DollarSign, Percent, Layers, FileText } from "lucide-react";
import api from "@/lib/api";

const inp = "w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [dragOver, setDragOver] = useState(false);

  const CATEGORIES = [
    "Electronics & Gadgets", "Fashion & Apparel", "Home & Living",
    "Food & Beverages", "Health & Beauty", "Automotive & Parts",
    "Agriculture & Farming", "Office & School Supplies", "Sports & Outdoors",
    "Industrial & Manufacturing", "Construction & Real Estate",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`);
        if (data?.product) {
          const p = data.product;
          setName(p.productName || "");
          setPrice(p.productPrice || "");
          setQuantity(p.productQuantity || "");
          setDiscount(p.productDiscount || "0");
          setCategory(p.productCategory || "");
          setDescription(p.productDescription || "");
          setExistingImages(p.productImages || []);
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (i) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeNew = (i) => {
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i));
    setNewImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity || !category || !description) {
      setError("All required fields must be filled");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("productName", name);
      formData.append("productPrice", Number(price));
      formData.append("productQuantity", Number(quantity));
      formData.append("productDiscount", Number(discount || 0));
      formData.append("productCategory", category);
      formData.append("productDescription", description);
      formData.append("productImages", JSON.stringify(existingImages));
      newImages.forEach((file) => formData.append("images", file));

      const { status } = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/updateproduct/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (status === 200) router.push("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-[#0D0D0D]/20 border-t-[#FFC831] rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Edit Product</h2>
          <p className="text-sm text-gray-400 truncate">{name || "Loading..."}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
              <Package size={14} className="text-[#FFC831]" /> Basic Information
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..." rows={3}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all resize-none" />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
              <DollarSign size={14} className="text-[#FFC831]" /> Pricing & Stock
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Price (FRw)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="0" className={inp} min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0" className={inp} min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Discount (%)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0" className={inp} min="0" max="99" />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
              <Layers size={14} className="text-[#FFC831]" /> Category
            </h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inp}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
              <ImagePlus size={14} className="text-[#FFC831]" /> Images
            </h3>

            {existingImages.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Current Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExisting(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                dragOver ? "border-[#FFC831] bg-[#FFC831]/5" : "border-gray-100 hover:border-[#FFC831]/30"
              }`}
            >
              <ImagePlus size={28} className="mx-auto text-gray-200 mb-2" />
              <p className="text-xs text-gray-400">Add new images</p>
              <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {newPreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase w-full mb-0">New Images</p>
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNew(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.push("/products")}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-[#FFC831] text-[#0D0D0D] text-sm font-bold rounded-xl hover:bg-[#FFD454] disabled:opacity-50 transition-all shadow-sm flex items-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={14} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
