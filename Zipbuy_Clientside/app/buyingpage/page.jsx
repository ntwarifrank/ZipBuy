'use client';

import { useState, useEffect, memo, useDeferredValue } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import {
  ShoppingCart, Star, ShieldCheck, Heart, ChevronRight,
  Flame, TrendingUp, Clock, Award, Truck, ChevronDown,
  Zap, Sparkles, ArrowRight, Package,
  Heart as HeartIcon, Home,
} from 'lucide-react';
import useCartStore from '../store/cartController';
import useWishlistStore from '../store/wishlistStore';
import useSearchStore from '../store/handlesearch';
import { useSearchedStore } from '../store/handlesearch';
import { jwtDecode } from "jwt-decode";
import Layout from '../layout/page';
import Nav from '../nav/page';

const CATEGORIES_CACHE_KEY = "zipbuy_categories_v2";

const BANNER_DEALS = [
  { title: "Electronics Mega Sale", subtitle: "Up to 40% off on top brands", bg: "from-blue-900 via-blue-800 to-indigo-900", badge: "Limited Time", icon: Zap, category: "Electronics" },
  { title: "Fashion Collection 2025", subtitle: "Premium styles for every occasion", bg: "from-rose-900 via-rose-800 to-pink-900", badge: "New Arrivals", icon: Sparkles, category: "Fashion" },
  { title: "Home & Living Essentials", subtitle: "Transform your space today", bg: "from-emerald-900 via-emerald-800 to-teal-900", badge: "Best Deals", icon: Package, category: "Home & Garden" },
];

const MID_BANNERS = [
  { text: "Free shipping on orders over RWF 50,000", icon: Truck, color: "bg-amber-50 border-amber-200 text-amber-800" },
  { text: "Verified suppliers with RDB certification", icon: ShieldCheck, color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { text: "7-day easy returns on all products", icon: Award, color: "bg-blue-50 border-blue-200 text-blue-800" },
];

const discountedPrice = (p) => Math.round(p.productPrice - (p.productPrice / 100) * (p.productDiscount || 0));

const Img = memo(({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className || ""}`} style={{ background: '#f3f4f6' }}>
      {!loaded && !error && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
      {error ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No image</div>
      ) : (
        <img src={src} alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(true); setError(true); }}
          loading="lazy" draggable={false} />
      )}
    </div>
  );
});

const ProductCard = memo(({ product, addingId, onAddToCart, wishlist, toggleWishlist, size = "normal", showBadge = true }) => {
  const discounted = discountedPrice(product);
  const isAdding = addingId === product._id;
  const isWishlisted = wishlist.some(p => p._id === product._id);
  const hasGoodDiscount = product.productDiscount >= 15;

  if (size === "large") {
    return (
      <div className="group bg-white rounded-xl border border-gray-100/80 overflow-hidden hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 flex flex-col sm:flex-row will-change-transform">
        <Link href={`/view/${product._id}`} className="relative sm:w-[45%] aspect-square sm:aspect-auto sm:min-h-[280px] overflow-hidden bg-gray-50 block">
          <Img src={product.productImages?.[0]} alt={product.productName} className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          {product.productDiscount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-red-500/20">
              -{product.productDiscount}% OFF
            </div>
          )}
        </Link>
        <div className="flex flex-col flex-1 p-5 sm:p-6 justify-center">
          {product.business && (
            <Link href={`/stores/${product.business._id}`}
              className="text-xs font-semibold text-[#FFC831] hover:text-[#e6b42c] transition-colors mb-1 tracking-wide uppercase">
              {product.business.businessProfile?.businessName || product.business.name}
            </Link>
          )}
          <Link href={`/view/${product._id}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug hover:text-[#FFC831] transition-colors mb-2">{product.productName}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={12} className="fill-[#FFC831] text-[#FFC831]" />
            ))}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.productDescription}</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900">RWF {discounted.toLocaleString()}</span>
            {product.productDiscount > 0 && (
              <span className="text-sm text-gray-400 line-through">RWF {product.productPrice.toLocaleString()}</span>
            )}
          </div>
          <button onClick={() => onAddToCart(product._id)} disabled={isAdding}
            className={`w-full sm:w-auto h-10 px-6 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
              isAdding ? "bg-emerald-500 text-white" : "bg-[#FFC831] text-[#0D0D0D] hover:bg-[#FFD454] hover:shadow-md active:scale-[0.97]"
            }`}>
            <ShoppingCart size={14} className={isAdding ? "animate-bounce" : ""} />
            {isAdding ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-100/80 overflow-hidden hover:shadow-lg hover:border-gray-200/80 hover:-translate-y-0.5 transition-all duration-300 flex flex-col will-change-transform">
      <Link href={`/view/${product._id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-50 block">
        <Img src={product.productImages?.[0]} alt={product.productName} className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.productDiscount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            -{product.productDiscount}%
          </div>
        )}
        {showBadge && hasGoodDiscount && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">
              <Flame size={10} /> Hot Deal
            </span>
          </div>
        )}
        <button onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            isWishlisted ? "bg-white text-red-500" : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-400"
          }`}>
          <Heart size={12} className={isWishlisted ? "fill-red-500" : ""} />
        </button>
      </Link>
      <div className="flex flex-col flex-1 p-3">
        <Link href={`/view/${product._id}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug hover:text-[#FFC831] transition-colors line-clamp-2 mb-1.5">{product.productName}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={8} className="fill-[#FFC831] text-[#FFC831]" />
          ))}
        </div>
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-sm sm:text-base font-bold text-gray-900">RWF {discounted.toLocaleString()}</span>
          {product.productDiscount > 0 && (
            <span className="text-[10px] text-gray-400 line-through">RWF {product.productPrice.toLocaleString()}</span>
          )}
        </div>
        <button onClick={() => onAddToCart(product._id)} disabled={isAdding}
          className={`w-full h-8 mt-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold rounded-lg transition-all duration-200 ${
            isAdding ? "bg-emerald-500 text-white" : "bg-[#FFC831] text-[#0D0D0D] hover:bg-[#FFD454] active:scale-[0.97]"
          }`}>
          <ShoppingCart size={11} className={isAdding ? "animate-bounce" : ""} />
          {isAdding ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
});

const BuyingPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const d = jwtDecode(token);
      if (d.role === "business") {
        router.replace(d.verificationStatus === "approved" ? "/business/dashboard" : "/business/onboarding");
      }
    } catch { localStorage.removeItem("token"); }
  }, [router]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [addingId, setAddingId] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const [categories, setCategories] = useState(["All"]);

  const { setCartIds, cartIds } = useCartStore();
  const { search, setSearch } = useSearchStore();
  const { searchedProduct } = useSearchedStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const fetchProduct = async (force) => {
    if (!force) {
      const cached = sessionStorage.getItem("zipbuy_products");
      if (cached) {
        try { const parsed = JSON.parse(cached); if (Date.now() - parsed.ts < 120000) { setProducts(parsed.data); return; } } catch {}
      }
    }
    try {
      const response = await api.get('/allproducts');
      const data = response.data.productData || [];
      setProducts(data);
      sessionStorage.setItem("zipbuy_products", JSON.stringify({ data, ts: Date.now() }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchProduct(); }, []);

  useEffect(() => {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      try { setCategories(["All", ...JSON.parse(cached).map(c => c.name)]); } catch {}
    }
    api.get("/categories").then((res) => {
      const cats = res.data.categories || [];
      setCategories(["All", ...cats.map(c => c.name)]);
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cats));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % BANNER_DEALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (id) => {
    if (cartIds.includes(id)) return;
    setAddingId(id);
    setCartIds(id);
    setTimeout(() => setAddingId(null), 600);
  };

  const handleCategoryClick = (cat) => {
    if (cat === 'All') { setActiveCategory('All'); setSearch(''); }
    else { setActiveCategory(cat); setSearch(cat); }
    setVisibleCount(12);
  };

  const deferredSearch = useDeferredValue(search);
  const deferredProducts = useDeferredValue(products);
  const hasKeywordResults = Array.isArray(searchedProduct) && searchedProduct.length > 0 && searchedProduct[0]?._id !== "0";
  const displayProducts = hasKeywordResults
    ? searchedProduct
    : deferredSearch
      ? deferredProducts.filter(p => p.productCategory?.toLowerCase() === deferredSearch.toLowerCase())
      : deferredProducts;

  const visibleProducts = displayProducts.slice(0, visibleCount);
  const hasMore = visibleProducts.length < displayProducts.length;

  const dealProducts = [...products].sort((a, b) => (b.productDiscount || 0) - (a.productDiscount || 0)).slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F7F4]">
        <Nav />

        {/* Hero Banner Carousel */}
        <div className="relative overflow-hidden bg-[#0D0D0D]">
          {BANNER_DEALS.map((deal, i) => (
            <div key={i}
              className={`absolute inset-0 bg-gradient-to-r ${deal.bg} transition-opacity duration-700 ${i === bannerIdx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.04]" />
            </div>
          ))}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3">
                  <ShieldCheck size={11} className="text-[#FFC831]" />
                  Africa&rsquo;s #1 B2B Marketplace
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-2">
                  {BANNER_DEALS[bannerIdx].title}
                </h1>
                <p className="text-white/70 text-sm sm:text-base max-w-lg">
                  {(() => {
                    const deal = BANNER_DEALS[bannerIdx];
                    const catProducts = products.filter(p => p.productCategory === deal.category);
                    const maxDisc = catProducts.length ? Math.max(...catProducts.map(p => p.productDiscount || 0)) : 0;
                    const count = catProducts.length;
                    if (count) return `Browse ${count} products — up to ${maxDisc}% off from top brands`;
                    return deal.subtitle;
                  })()}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button onClick={() => { setActiveCategory(BANNER_DEALS[bannerIdx].category); setSearch(BANNER_DEALS[bannerIdx].category); }}
                    className="inline-flex items-center gap-1.5 bg-[#FFC831] text-[#0D0D0D] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#FFD454] transition-all active:scale-[0.97]">
                    Shop Now <ArrowRight size={14} />
                  </button>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#FFC831] bg-[#FFC831]/10 px-2.5 py-1 rounded-full">
                    {BANNER_DEALS[bannerIdx].badge}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                {(() => {
                  const catProducts = products.filter(p => p.productCategory === BANNER_DEALS[bannerIdx].category).slice(0, 3);
                  const items = catProducts.length > 0 ? catProducts : dealProducts.slice(0, 3);
                  return items.map((p) => (
                    <Link key={p._id} href={`/view/${p._id}`}
                      className="w-[120px] bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-2 hover:bg-white/15 transition-all">
                      <Img src={p.productImages?.[0]} alt={p.productName} className="w-full aspect-square rounded-lg mb-1.5" />
                      <p className="text-[9px] text-white/80 truncate font-medium">{p.productName}</p>
                      <p className="text-[10px] text-[#FFC831] font-bold">RWF {discountedPrice(p).toLocaleString()}</p>
                      {p.productDiscount > 0 && <span className="text-[8px] text-red-400 font-medium">-{p.productDiscount}% off</span>}
                    </Link>
                  ));
                })()}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-5">
              {BANNER_DEALS.map((_, i) => (
                <button key={i} onClick={() => setBannerIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === bannerIdx ? "w-8 bg-[#FFC831]" : "w-1.5 bg-white/30 hover:bg-white/50"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MID_BANNERS.map((b, i) => (
              <div key={i} className={`flex items-center gap-2.5 ${b.color} border rounded-xl px-4 py-2.5`}>
                <b.icon size={16} className="shrink-0" />
                <span className="text-xs font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Category pills */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-thin pb-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm shadow-[#FFC831]/20"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:shadow-sm"
                }`}>{cat}</button>
            ))}
          </div>

          {/* Deal of the Day */}
          {activeCategory === "All" && !search && dealProducts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Deal of the Day</h2>
                  <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full animate-pulse">
                    -{dealProducts[0].productDiscount}%
                  </span>
                </div>
                <button onClick={() => { setSearch(""); setVisibleCount(24); }}
                  className="text-xs font-medium text-[#FFC831] hover:underline flex items-center gap-1">
                  View All <ArrowRight size={12} />
                </button>
              </div>
              <ProductCard product={dealProducts[0]} addingId={addingId} onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} size="large" showBadge={false} />
            </div>
          )}

          {/* Mid-page deal banner */}
          {activeCategory === "All" && !search && dealProducts.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-[#0D0D0D] via-gray-900 to-[#1a1a1a] rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 sm:py-4">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-[#FFC831]/10 flex items-center justify-center">
                    <Clock size={18} className="text-[#FFC831]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Up to {dealProducts[0].productDiscount}% off top deals</h3>
                    <p className="text-[10px] text-gray-400">{dealProducts.length} hot items — limited stock</p>
                  </div>
                </div>
                <button onClick={() => {
                  const topCat = dealProducts[0]?.productCategory;
                  if (topCat) { setActiveCategory(topCat); setSearch(topCat); }
                  setVisibleCount(12);
                }}
                  className="text-xs font-semibold bg-[#FFC831] text-[#0D0D0D] px-4 py-2 rounded-lg hover:bg-[#FFD454] transition-all active:scale-[0.97]">
                  Grab Deals <ChevronRight size={12} className="inline" />
                </button>
              </div>
            </div>
          )}

          {/* Dynamic category spotlights */}
          {activeCategory === "All" && !search && (() => {
            const catsWithProducts = [...new Set(products.map(p => p.productCategory))]
              .filter(c => products.filter(p => p.productCategory === c).length >= 2)
              .slice(0, 2);
            const icons = [Zap, Sparkles];
            return catsWithProducts.map((cat, ci) => {
              const Icon = icons[ci % icons.length];
              const catProducts = products.filter(p => p.productCategory === cat).slice(0, 4);
              return (
                <div key={cat} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Icon size={16} className="text-yellow-500" /> {cat}
                    </h2>
                    <button onClick={() => handleCategoryClick(cat)}
                      className="text-xs font-medium text-[#FFC831] hover:underline flex items-center gap-1">
                      View All <ArrowRight size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {catProducts.map((product) => (
                      <ProductCard key={product._id} product={product} addingId={addingId} onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                    ))}
                  </div>
                </div>
              );
            });
          })()}

          {/* All Products */}
          <div className="flex items-center justify-between mb-5 pt-2 border-t border-gray-200/60">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {search ? `Search Results` : `All Products`}
              </h2>
              {search && <p className="text-xs text-gray-400">&ldquo;{search}&rdquo;</p>}
            </div>
            <span className="text-xs text-gray-400 font-medium bg-white border border-gray-200 px-2.5 py-1 rounded-full">
              {displayProducts.length} products
            </span>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Package size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No products found</p>
              <p className="text-xs text-gray-300 mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} addingId={addingId} onAddToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8 mb-6">
                  <button onClick={() => setVisibleCount(p => p + 12)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
                    Load More Products <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer trust section */}
        <div className="border-t border-gray-200/60 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders over RWF 50,000" },
                { icon: ShieldCheck, title: "Verified Suppliers", desc: "RDB certified businesses" },
                { icon: Award, title: "Quality Guarantee", desc: "7-day easy returns" },
                { icon: Clock, title: "Fast Delivery", desc: "2-7 business days" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FFC831]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#FFC831]" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyingPage;
