"use client";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, X, ImagePlus, Package, DollarSign, Percent, Layers, FileText, Truck, ImageOff } from "lucide-react";
import api from "@/lib/api";

const inp = "w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all appearance-none";

export default function CreateProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keepBg, setKeepBg] = useState(false);
  const [shippingWeight, setShippingWeight] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [shippingDelivery, setShippingDelivery] = useState("");
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const [dragOver, setDragOver] = useState(false);

  const CATEGORIES = [
    "Electronics & Gadgets", "Fashion & Apparel", "Home & Living",
    "Food & Beverages", "Health & Beauty", "Automotive & Parts",
    "Agriculture & Farming", "Office & School Supplies", "Sports & Outdoors",
    "Industrial & Manufacturing", "Construction & Real Estate",
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i) => {
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity || !category || !description) {
      setError("All required fields must be filled");
      return;
    }
    if (images.length === 0) {
      setError("At least one product image is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("productName", name);
      formData.append("productPrice", price);
      formData.append("productQuantity", quantity);
      formData.append("productDiscount", discount || "0");
      formData.append("productCategory", category);
      formData.append("productDescription", description);
      formData.append("keepBackground", keepBg ? "true" : "false");

      const shippingArr = [
        { weight: shippingWeight || "N/A" },
        { shippingCost: Number(shippingCost) || 0 },
        { estimatedDelivery: shippingDelivery || "N/A" },
      ];
      formData.append("productShipping", JSON.stringify(shippingArr));

      images.forEach((file) => formData.append("images", file));

      const { status } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/createproduct`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (status === 200) router.push("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Create Product</h2>
          <p className="text-sm text-gray-400">Add a new product to the marketplace.</p>
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

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0D0D0D] flex items-center gap-2">
              <Truck size={14} className="text-[#FFC831]" /> Shipping Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Weight</label>
                <input type="text" value={shippingWeight} onChange={(e) => setShippingWeight(e.target.value)}
                  placeholder="e.g. 2 kg" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Shipping Cost (FRw)</label>
                <input type="number" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)}
                  placeholder="0" className={inp} min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Estimated Delivery</label>
                <input type="text" value={shippingDelivery} onChange={(e) => setShippingDelivery(e.target.value)}
                  placeholder="e.g. 3-5 days" className={inp} />
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
              <ImagePlus size={14} className="text-[#FFC831]" /> Product Images
            </h3>
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
              <p className="text-xs text-gray-400">Drag & drop images here, or click to browse</p>
              <input ref={fileInputRef} id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Keep background toggle */}
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={keepBg} onChange={(e) => setKeepBg(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full bg-gray-200 peer-checked:bg-[#FFC831] transition-colors" />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${keepBg ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors flex items-center gap-1.5">
                <ImageOff size={12} /> Keep original image backgrounds (skip background removal)
              </span>
            </label>
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
                <><span className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" /> Creating...</>
              ) : (
                <><Plus size={14} /> Create Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
