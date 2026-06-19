"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Star, ChevronLeft, ChevronRight, ShieldCheck, Truck, RotateCcw, Package, Heart, Share2, Check, HeartOff, ImageOff, Loader2 } from 'lucide-react';
import useCartStore from "../../store/cartController";
import useWishlistStore from "../../store/wishlistStore";
import Layout from "@/app/layout/page";
import Link from "next/link";
import Nav from "../../nav/page";
import api from "@/lib/api";

function Img({ src, alt, className, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className || ""}`} {...props}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <Loader2 size={20} className="text-gray-300 animate-spin" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-gray-300">
          <ImageOff size={24} />
          <span className="text-[10px] mt-1">No image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(true); setError(true); }}
          draggable={false}
        />
      )}
    </div>
  );
}

const View = () => {
  const [productData, setProductData] = useState({});
  const [proImage, setProImage] = useState(0);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const { cartIds, setCartIds } = useCartStore();
  const { id } = useParams();
  const [showMore, setShowMore] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mousePct, setMousePct] = useState({ x: 0, y: 0 });
  const [mainLoaded, setMainLoaded] = useState(false);
  const { wishlist, toggleWishlist } = useWishlistStore();
  const imageRef = useRef(null);
  const zoomLensSize = 150;
  const zoomLevel = 2.5;

  async function fetchProductData() {
    try {
      const response = await api.get(`/product/${id}`);
      if (response) {
        setProductData(response.data.product);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [id]);

  function displayimage(index) {
    setProImage(Number(index));
    setMainLoaded(false);
  }

  function increaseImage() {
    if (productData.productImages?.length - 1 > proImage) {
      setProImage((prev) => Number(prev) + 1);
      setMainLoaded(false);
    }
  }

  function decreaseImage() {
    if (productData.productImages?.length > 0 && proImage >= 1) {
      setProImage((prev) => Number(prev) - 1);
      setMainLoaded(false);
    }
  }

  function addToCart(id) {
    if (cartIds.includes(id)) return;
    setCartIds(id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  const handleRelatedProduct = useCallback(async () => {
    if (productData && productData.productCategory) {
      const category = productData.productCategory;
      const res = await api.post(`/related`, { category });
      if (res.status == 200) {
        setRelatedProduct(res.data.products);
      }
    }
  }, [productData]);

  useEffect(() => {
    handleRelatedProduct();
  }, [handleRelatedProduct]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setMousePct({
      x: Math.min(100, Math.max(0, (x / rect.width) * 100)),
      y: Math.min(100, Math.max(0, (y / rect.height) * 100)),
    });
  };

  const lensLeft = Math.max(0, Math.min(mousePos.x - zoomLensSize / 2, (imageRef.current?.offsetWidth || 400) - zoomLensSize));
  const lensTop = Math.max(0, Math.min(mousePos.y - zoomLensSize / 2, (imageRef.current?.offsetHeight || 400) - zoomLensSize));

  const discounted = productData.productPrice
    ? Math.round(productData.productPrice - (productData.productPrice / 100) * (productData.productDiscount || 0))
    : 0;

  const currentImage = productData.productImages?.[proImage] || productData.productImages?.[0];

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F5F5]">
        <Nav />

        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-xs text-gray-400 overflow-x-auto">
            <Link href="/" className="hover:text-[#FFC831] transition-colors whitespace-nowrap">Home</Link>
            <ChevronRight size={12} className="mx-1.5 shrink-0" />
            <Link href="/buyingpage" className="hover:text-[#FFC831] transition-colors whitespace-nowrap">Products</Link>
            <ChevronRight size={12} className="mx-1.5 shrink-0" />
            <span className="text-gray-500 whitespace-nowrap">{productData?.productCategory || "Category"}</span>
            <ChevronRight size={12} className="mx-1.5 shrink-0" />
            <span className="text-gray-800 truncate max-w-[160px] sm:max-w-[240px] font-medium">
              {productData?.productName}
            </span>
          </div>
        </div>

        {/* Main product section */}
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Images */}
              <div className="w-full lg:w-[55%] p-3 sm:p-6 lg:p-8">
                <div className="flex gap-3 sm:gap-4">
                  {/* Thumbnails */}
                  {productData.productImages?.length > 1 && (
                    <div className="hidden sm:flex flex-col gap-2 w-[64px] lg:w-[72px] shrink-0">
                      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1">
                        {productData.productImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => displayimage(index)}
                            onMouseEnter={() => displayimage(index)}
                            className={`w-[56px] lg:w-[64px] h-[56px] lg:h-[64px] rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                              proImage === index
                                ? "border-[#FFC831] shadow-sm ring-1 ring-[#FFC831]/30"
                                : "border-gray-100 hover:border-gray-300"
                            }`}
                          >
                            <Img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main image */}
                  <div className="flex-1 min-w-0">
                    <div
                      ref={imageRef}
                      className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-crosshair group"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      onMouseMove={handleMouseMove}
                    >
                      {!mainLoaded && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                          <Loader2 size={28} className="text-gray-300 animate-spin" />
                        </div>
                      )}
                      <img
                        src={currentImage}
                        alt={productData.productName || "Product image"}
                        className={`w-full h-full object-contain p-3 sm:p-4 select-none transition-opacity duration-300 ${mainLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setMainLoaded(true)}
                        onError={() => setMainLoaded(true)}
                        draggable={false}
                      />

                      {/* Hover to zoom hint */}
                      {mainLoaded && (
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <span className="hidden sm:inline">Hover to zoom</span>
                          <span className="sm:hidden">Tap to zoom</span>
                        </div>
                      )}

                      {/* Nav arrows */}
                      {productData.productImages?.length > 1 && mainLoaded && (
                        <>
                          <button
                            onClick={decreaseImage}
                            disabled={proImage === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white disabled:opacity-30 transition-all z-10"
                          >
                            <ChevronLeft size={16} className="text-gray-700" />
                          </button>
                          <button
                            onClick={increaseImage}
                            disabled={proImage === productData.productImages.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white disabled:opacity-30 transition-all z-10"
                          >
                            <ChevronRight size={16} className="text-gray-700" />
                          </button>
                        </>
                      )}

                      {/* Zoom lens */}
                      {isHovering && mainLoaded && window.innerWidth >= 1024 && (
                        <div
                          className="absolute border-2 border-[#FFC831] bg-white/20 pointer-events-none z-20 shadow-sm rounded-sm"
                          style={{ width: zoomLensSize, height: zoomLensSize, left: lensLeft, top: lensTop }}
                        />
                      )}

                      {/* Image counter */}
                      {productData.productImages?.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {proImage + 1}/{productData.productImages.length}
                        </div>
                      )}
                    </div>

                    {/* Mobile thumbnails */}
                    {productData.productImages?.length > 1 && (
                      <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                        {productData.productImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => displayimage(index)}
                            className={`w-12 h-12 rounded-lg border-2 overflow-hidden shrink-0 ${
                              proImage === index ? "border-[#FFC831]" : "border-gray-200"
                            }`}
                          >
                            <Img src={image} alt={`Thumb ${index + 1}`} className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Zoom panel — desktop only */}
                  {isHovering && mainLoaded && window.innerWidth >= 1024 && (
                    <div className="hidden lg:block w-[300px] xl:w-[380px] h-[300px] xl:h-[380px] shrink-0 rounded-lg border border-gray-200 bg-white overflow-hidden shadow-xl sticky top-24">
                      <div className="w-full h-full" style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: `${zoomLevel * 100}%`,
                        backgroundPosition: `${mousePct.x}% ${mousePct.y}%`,
                        backgroundRepeat: 'no-repeat',
                      }} />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">{zoomLevel}x</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="w-full lg:w-[45%] border-t lg:border-t-0 lg:border-l border-gray-100 p-4 sm:p-6 lg:p-8">
                {/* Store */}
                {productData.business && (
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0D0D0D] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(productData.business.businessProfile?.businessName || 'S')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/stores/${productData.business._id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[#FFC831] transition-colors truncate block">
                        {productData.business.businessProfile?.businessName || "Store"}
                      </Link>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 flex-wrap">
                        <span className="flex items-center gap-0.5"><Star size={10} className="fill-[#FFC831] text-[#FFC831]" /> 4.8</span>
                        <span className="mx-1">•</span>
                        <span>Verified</span>
                        <ShieldCheck size={11} className="text-emerald-500" />
                      </div>
                    </div>
                    <Link href={`/stores/${productData.business._id}`}
                      className="text-[11px] sm:text-xs font-medium text-[#FFC831] hover:text-[#e6b42c] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#FFC831]/30 hover:border-[#FFC831] transition-colors shrink-0">
                      Visit Store
                    </Link>
                  </div>
                )}

                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-snug mb-2.5">
                  {productData.productName}
                </h1>

                {/* Rating */}
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-[#FFF8E8] px-2 py-1 rounded-full">
                    <Star size={11} className="fill-[#FFC831] text-[#FFC831]" />
                    <span className="text-xs font-semibold text-gray-800">5.0</span>
                    <span className="text-[10px] text-gray-400">(10)</span>
                  </div>
                  <span className="text-[10px] text-gray-300">|</span>
                  <span className="text-[11px] text-gray-500">15 orders</span>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-[#FFC831]/10 to-transparent rounded-xl p-3 sm:p-4 mb-4">
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      RWF {Math.round(discounted).toLocaleString()}
                    </span>
                    {productData.productDiscount > 0 && (
                      <>
                        <span className="text-sm sm:text-base text-gray-400 line-through">
                          RWF {productData.productPrice?.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 sm:px-2 py-0.5 rounded-full">
                          -{productData.productDiscount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                  {[
                    { icon: Package, label: "In Stock" },
                    { icon: Truck, label: "Free Shipping" },
                    { icon: RotateCcw, label: "7-Day Returns" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50">
                      <Icon size={15} className="text-gray-500" />
                      <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3 mb-5">
                  <button onClick={() => addToCart(productData._id)}
                    disabled={cartIds.includes(productData._id)}
                    className={`flex-1 h-10 sm:h-11 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg transition-all ${
                      cartIds.includes(productData._id)
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-[#FFC831] text-[#0D0D0D] hover:bg-[#FFD454] active:scale-[0.99]"
                    }`}>
                    {cartIds.includes(productData._id) ? <><Check size={16} /> Added</> : <><ShoppingCart size={16} /> Add to Cart</>}
                  </button>
                  <button onClick={() => toggleWishlist(productData)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      wishlist.some(p => p._id === productData._id)
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    }`}
                    title={wishlist.some(p => p._id === productData._id) ? "Remove from wishlist" : "Add to wishlist"}>
                    <Heart size={17} className={wishlist.some(p => p._id === productData._id) ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <button onClick={async () => {
                      if (navigator.share) { try { await navigator.share({ title: productData.productName, url: window.location.href }); } catch {} }
                      else { try { await navigator.clipboard.writeText(window.location.href); } catch {} }
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all shrink-0"
                    title="Share">
                    <Share2 size={17} />
                  </button>
                </div>

                {/* Shipping */}
                {productData.productShipping?.length > 0 && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4 mb-4">
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Shipping</h3>
                    <div className="space-y-1.5">
                      {productData.productShipping.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-500">{i === 0 ? "Weight" : i === 1 ? "Dimensions" : i === 2 ? "Cost" : "Delivery"}</span>
                          <span className="font-medium text-gray-800">{item.weight ? `${item.weight}g` : item.dimensions ? item.dimensions : item.shippingCost ? `RWF ${item.shippingCost}` : item.estimatedDelivery || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="rounded-xl border border-gray-100 p-3 sm:p-4">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Description</h3>
                  <div className={`relative ${showMore ? "" : "max-h-[80px] sm:max-h-[100px] overflow-hidden"}`}>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {productData.productDescription}
                    </p>
                    {!showMore && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />}
                  </div>
                  <button onClick={() => setShowMore(!showMore)}
                    className="mt-1.5 text-[11px] sm:text-xs font-medium text-[#FFC831] hover:text-[#e6b42c] transition-colors">
                    {showMore ? "Show Less" : "Show More"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProduct.filter((p) => p._id !== productData._id).length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">You May Also Like</h2>
                  <p className="text-xs text-gray-400 mt-0.5">More products from this category</p>
                </div>
                <Link href={`/buyingpage`} className="text-xs font-medium text-[#FFC831] hover:underline">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {relatedProduct
                  .filter((p) => p._id !== productData._id)
                  .slice(0, 5)
                  .map((product, index) => (
                    <div key={index} className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-300 overflow-hidden">
                      <Link href={`/view/${product._id}`} className="relative aspect-square bg-gray-50 block">
                        <Img
                          src={product.productImages?.[0]}
                          alt={product.productName}
                          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.productDiscount > 0 && (
                          <div className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                            -{product.productDiscount}%
                          </div>
                        )}
                      </Link>
                      <div className="p-2 sm:p-2.5">
                        <Link href={`/view/${product._id}`}>
                          <h3 className="text-[11px] sm:text-xs font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-[#FFC831] transition-colors">
                            {product.productName}
                          </h3>
                        </Link>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            RWF {Math.round(product.productPrice - (product.productPrice / 100) * (product.productDiscount || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default View;
