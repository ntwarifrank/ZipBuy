"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ImageOff, Tag, Package, Layers, Percent } from "lucide-react";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${id}`);
        if (data?.product) setProduct(data.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-[#0D0D0D]/20 border-t-[#FFC831] rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p className="text-gray-400">Product not found.</p>
          <Link href="/products" className="text-[#FFC831] text-sm font-semibold hover:underline mt-2 inline-block">Back to Products</Link>
        </div>
      </DashboardLayout>
    );
  }

  const discountedPrice = product.productDiscount
    ? Math.round(product.productPrice - (product.productPrice / 100) * product.productDiscount)
    : product.productPrice;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (product.productImages?.length || 1));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + (product.productImages?.length || 1)) % (product.productImages?.length || 1));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/products" className="hover:text-[#FFC831] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#0D0D0D] font-semibold truncate max-w-[200px]">{product.productName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden relative aspect-square">
              {product.productImages?.[currentImage] ? (
                <img src={product.productImages[currentImage]} alt={product.productName}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageOff size={48} className="text-gray-200" />
                </div>
              )}

              {(product.productImages?.length || 0) > 1 && (
                <>
                  <button onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                    <ChevronLeft size={14} className="text-gray-600" />
                  </button>
                  <button onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                    <ChevronRight size={14} className="text-gray-600" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.productImages.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentImage ? "bg-[#FFC831] w-4" : "bg-white/60 hover:bg-white/90"
                        }`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.productImages?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.productImages.map((url, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      i === currentImage ? "border-[#FFC831] opacity-100" : "border-gray-100 opacity-60 hover:opacity-100"
                    }`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-lg font-bold text-[#0D0D0D] leading-tight">{product.productName}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  product.productStatus === "active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                }`}>
                  {product.productStatus || "active"}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-[#0D0D0D]">FRw {discountedPrice?.toLocaleString()}</p>
                {product.productDiscount > 0 && (
                  <>
                    <p className="text-sm text-gray-400 line-through">FRw {product.productPrice?.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">-{product.productDiscount}%</span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.productQuantity !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <Package size={13} className="text-gray-300 mb-1" />
                    <p className="text-[10px] text-gray-400">Stock</p>
                    <p className="text-sm font-bold text-[#0D0D0D]">{product.productQuantity}</p>
                  </div>
                )}
                {product.productCategory && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <Layers size={13} className="text-gray-300 mb-1" />
                    <p className="text-[10px] text-gray-400">Category</p>
                    <p className="text-sm font-bold text-[#0D0D0D]">{product.productCategory}</p>
                  </div>
                )}
              </div>

              {product.business && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400">Listed by</p>
                  <p className="text-sm font-semibold text-[#0D0D0D]">
                    {product.business?.businessProfile?.businessName || product.business?.email || "Unknown"}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-[#0D0D0D] mb-2">Description</h3>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                {product.productDescription || "No description provided."}
              </p>
            </div>

            {/* Shipping */}
            {product.productShipping?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-[#0D0D0D] mb-3">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {product.productShipping.map((s, i) => {
                    const entries = Object.entries(s);
                    return entries.map(([key, val]) => (
                      <div key={`${i}-${key}`} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                        <p className="text-xs font-semibold text-[#0D0D0D]">{String(val)}</p>
                      </div>
                    ));
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link href={`/product/edit/${product._id}`}
                className="flex-1 px-4 py-2.5 bg-[#FFC831] text-[#0D0D0D] text-sm font-bold rounded-xl hover:bg-[#FFD454] transition-all shadow-sm text-center">
                Edit Product
              </Link>
              <Link href="/products"
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-colors text-center">
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
