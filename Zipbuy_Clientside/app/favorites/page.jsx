"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Trash2, ArrowLeft } from "lucide-react";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartController";
import Nav from "../nav/page";

export default function Favorites() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlistStore();
  const { setCartIds, cartIds } = useCartStore();

  const discountedPrice = (p) => Math.round(p.productPrice - (p.productPrice / 100) * (p.productDiscount || 0));

  function addToCart(productId) {
    if (cartIds.includes(productId)) return;
    setCartIds(productId);
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Link href="/buyingpage" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">My Favorites</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart size={24} className="text-red-500 fill-red-500" />
              My Favorites
              <span className="text-sm font-normal text-gray-400 ml-1">({wishlist.length})</span>
            </h1>
          </div>
          {wishlist.length > 0 && (
            <button onClick={clearWishlist}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-100 transition-colors">
              <Trash2 size={13} /> Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 sm:p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-gray-300" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No favorites yet</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              Start browsing products and tap the heart icon to save your favorites here.
            </p>
            <Link href="/buyingpage"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0D0D] bg-[#FFC831] rounded-lg px-5 py-2.5 hover:bg-[#FFD454] transition-all shadow-sm">
              <ArrowLeft size={15} /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {wishlist.map((product) => {
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
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                        <Heart size={14} className="fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </Link>
                  <div className="p-3 sm:p-4">
                    <Link href={`/view/${product._id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#FFC831] transition-colors">
                        {product.productName}
                      </h3>
                    </Link>
                    {product.business?.businessProfile?.businessName && (
                      <Link href={`/stores/${product.business._id}`}
                        className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors line-clamp-1 mt-0.5 block">
                        {product.business.businessProfile.businessName}
                      </Link>
                    )}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className="fill-[#FFC831] text-[#FFC831]" />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        RWF {discounted.toLocaleString()}
                      </span>
                      {product.productDiscount > 0 && (
                        <span className="text-[10px] text-gray-400 line-through">
                          RWF {product.productPrice?.toLocaleString()}
                        </span>
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
