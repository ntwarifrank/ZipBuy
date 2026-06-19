"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Store, MapPin, ShieldCheck, Star, Package, ShoppingCart, Heart } from "lucide-react";
import api from "../../../lib/api";
import Nav from "../../nav/page";
import useCartStore from "../../store/cartController";
import useWishlistStore from "../../store/wishlistStore";

export default function Storefront() {
  const { businessId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCartIds, cartIds } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    if (businessId) fetchStore();
  }, [businessId]);

  async function fetchStore() {
    try {
      const { data } = await api.get(`/api/stores/${businessId}`);
      if (data.success) {
        setStore(data.store.business);
        setProducts(data.store.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const discountedPrice = (p) => Math.round(p.productPrice - (p.productPrice / 100) * (p.productDiscount || 0));

  function addToCart(productId) {
    if (cartIds.includes(productId)) return;
    setCartIds(productId);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4]">
        <Nav />
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#F8F7F4]">
        <Nav />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm max-w-sm mx-auto">
            <Store size={32} className="mx-auto text-gray-300 mb-3" />
            <h1 className="text-lg font-bold text-gray-900 mb-1">Store Not Found</h1>
            <Link href="/stores" className="text-sm font-medium text-[#FFC831] hover:underline">Browse all stores</Link>
          </div>
        </div>
      </div>
    );
  }

  const name = store.businessProfile?.businessName || store.name || "Store";

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Nav />

      {/* Store header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-4 sm:gap-6">
            {store.businessProfile?.businessLogo ? (
              <img
                src={store.businessProfile.businessLogo}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FFC831] to-[#FFD454] rounded-xl flex items-center justify-center text-[#0D0D0D] text-2xl sm:text-3xl font-bold shadow-sm">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {store.businessProfile?.category && (
                  <span className="text-xs font-medium bg-[#FFC831]/10 text-[#b38a00] px-2.5 py-0.5 rounded-full">
                    {store.businessProfile.category}
                  </span>
                )}
                {store.verificationStatus === "approved" && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Star size={11} className="fill-[#FFC831] text-[#FFC831]" />
                  4.5
                </span>
              </div>
              {store.businessProfile?.businessDescription && (
                <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
                  {store.businessProfile.businessDescription}
                </p>
              )}
              {store.businessProfile?.city && (
                <p className="text-xs text-gray-300 mt-1.5 flex items-center gap-1">
                  <MapPin size={11} />
                  {store.businessProfile.city}
                  {store.businessProfile.country ? `, ${store.businessProfile.country}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-5">
          <Package size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Products</h2>
          <span className="text-xs text-gray-400">({products.length})</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Package size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No products yet from this store</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => {
              const discounted = discountedPrice(product);
              return (
              <div key={product._id}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <Link href={`/view/${product._id}`} className="block">
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    {product.productImages?.[0] ? (
                      <img src={product.productImages[0]} alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                    )}
                    {product.productDiscount > 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg shadow-red-500/20">
                        -{product.productDiscount}%
                      </div>
                    )}
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                        wishlist.some(p => p._id === product._id)
                          ? "bg-white text-red-500"
                          : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-400"
                      }`}>
                      <Heart size={14} className={wishlist.some(p => p._id === product._id) ? "fill-red-500" : ""} />
                    </button>
                  </div>
                </Link>
                <div className="p-3 sm:p-4">
                  <Link href={`/view/${product._id}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#FFC831] transition-colors">
                      {product.productName}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={10} className="fill-[#FFC831] text-[#FFC831]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-sm font-bold text-gray-900">RWF {discounted.toLocaleString()}</span>
                    {product.productDiscount > 0 && (
                      <span className="text-[10px] text-gray-400 line-through">RWF {product.productPrice?.toLocaleString()}</span>
                    )}
                  </div>
                  <button onClick={() => addToCart(product._id)}
                    disabled={cartIds.includes(product._id)}
                    className={`w-full mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-all duration-150 active:scale-[0.97] ${
                      cartIds.includes(product._id)
                        ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                        : "bg-[#FFC831] text-[#0D0D0D] hover:bg-[#FFD454] shadow-sm"
                    }`}>
                    <ShoppingCart size={13} />
                    {cartIds.includes(product._id) ? "Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
