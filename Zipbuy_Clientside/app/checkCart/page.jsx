"use client";
import { useMemo, useEffect, useState } from "react";
import useCartStore from "../store/cartController";
import { useRouter } from "next/navigation";
import axios from "axios";
import Nav from "../nav/page";
import {
  ShoppingCart, Trash2, Plus, Minus, CreditCard,
  MapPin, Mail, User, Globe, Building, Hash,
  ArrowLeft, ShieldCheck, Package, ChevronRight,
  Check, Truck, Lock, Info,
} from "lucide-react";
import Link from "next/link";

const STEPS = ["Cart", "Checkout", "Payment", "Confirmation"];

const CheckCart = () => {
  const { cartIds, setCartIds, removeProduct, removeLastId } = useCartStore();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orderErrorMessage, setOrderErrorMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("Rwanda");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderToken, setOrderToken] = useState(null);

  const uniqueProducts = useMemo(() => {
    const seen = new Set();
    return products.filter((p) => {
      if (seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });
  }, [products]);

  const totalPrice = useMemo(() => {
    return products.reduce((total, product) => {
      const quantity = cartIds.filter((id) => id === product._id).length;
      const discounted = product.productPrice - (product.productPrice / 100) * (product.productDiscount || 0);
      return total + discounted * quantity;
    }, 0);
  }, [products, cartIds]);

  const totalOriginal = useMemo(() => {
    return products.reduce((total, product) => {
      const quantity = cartIds.filter((id) => id === product._id).length;
      return total + product.productPrice * quantity;
    }, 0);
  }, [products, cartIds]);

  const totalSavings = totalOriginal - totalPrice;
  const totalItems = cartIds.length;

  const fetchProductsData = async () => {
    if (cartIds.length === 0) { setProducts([]); return; }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/specificproduct`,
        { ids: cartIds }
      );
      if (res) setProducts(res.data);
    } catch (err) {
      console.error("Error fetching cart products:", err);
    }
  };

  useEffect(() => { fetchProductsData(); }, [cartIds]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderErrorMessage("");
    try {
      const token = Math.floor(100000 + Math.random() * 900000 * Math.random() * 20000).toString();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/placeorder`, {
        email, fullName, city, postalCode, streetAddress, country, orderToken: token,
        totalAmount: totalPrice.toFixed(2), cartProducts: products,
      });
      if (response.status === 200) {
        setOrderToken(token);
        setOrderSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      setOrderErrorMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const getQty = (id) => cartIds.filter((i) => i === id).length;
  const getUnitPrice = (p) => p.productPrice - (p.productPrice / 100) * (p.productDiscount || 0);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Nav />

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-0 py-4">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  i <= 1 ? "text-[#FFC831]" : i === 2 ? "text-gray-400" : "text-gray-300"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 1 ? "bg-[#FFC831] text-[#0D0D0D]" :
                    i === 1 ? "bg-[#FFC831] text-[#0D0D0D]" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {i < 1 ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    i === 1 ? "text-gray-900" : "text-gray-400"
                  }`}>{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-1 sm:mx-3 ${
                    i < 1 ? "bg-[#FFC831]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/buyingpage" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium">Cart</span>
        </div>

        {orderSubmitted ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Order Placed!</h2>
            <p className="text-sm text-gray-400 mb-1">Your order has been submitted successfully.</p>
            <p className="text-xs text-gray-300 mb-6">Order token: <span className="font-mono font-medium">{orderToken}</span></p>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/pay/${orderToken}?amount=${totalPrice.toFixed(2)}`)}
                className="block w-full py-3 bg-[#FFC831] text-[#0D0D0D] font-bold text-sm rounded-xl hover:bg-[#FFD454] transition-all shadow-[0_4px_14px_rgba(255,200,49,0.35)]"
              >
                Proceed to Payment — RWF {totalPrice.toLocaleString()}
              </button>
              <Link
                href="/buyingpage"
                className="block w-full py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ═══ Left: Cart Items ═══ */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingCart size={22} className="text-[#FFC831]" />
                    Shopping Cart
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
                </div>
                <Link href="/buyingpage" className="text-xs font-medium text-[#FFC831] hover:underline hidden sm:block">
                  Continue Shopping
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 sm:p-16 text-center shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={28} className="text-gray-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h2>
                  <p className="text-sm text-gray-400 mb-6">Looks like you haven&apos;t added anything yet.</p>
                  <Link
                    href="/buyingpage"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0D0D] bg-[#FFC831] rounded-xl px-5 py-2.5 hover:bg-[#FFD454] transition-all shadow-sm"
                  >
                    <ArrowLeft size={15} />
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Table header — hidden on mobile */}
                  <div className="hidden sm:grid sm:grid-cols-[80px_1fr_140px_100px] gap-4 px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    <span>Item</span>
                    <span>Product</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Subtotal</span>
                  </div>

                  {uniqueProducts.map((product) => {
                    const qty = getQty(product._id);
                    const unitPrice = getUnitPrice(product);
                    return (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-all duration-200"
                      >
                        {/* Mobile layout */}
                        <div className="flex sm:hidden gap-3">
                          <Link href={`/view/${product._id}`} className="shrink-0">
                            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                              {product.productImages?.[0] ? (
                                <img src={product.productImages[0]} alt={product.productName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                              )}
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <Link href={`/view/${product._id}`}>
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{product.productName}</h3>
                              </Link>
                              <button onClick={() => removeProduct(product._id)} className="p-1 text-gray-300 hover:text-red-500 shrink-0">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs font-bold text-gray-900">RWF {unitPrice.toLocaleString()}</span>
                              {product.productDiscount > 0 && (
                                <span className="text-[10px] text-gray-400 line-through">RWF {product.productPrice.toLocaleString()}</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                                <button onClick={() => qty > 1 && removeLastId(product._id)}
                                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${qty <= 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:bg-white hover:shadow-sm"}`} disabled={qty <= 1}>
                                  <Minus size={12} />
                                </button>
                                <span className="w-7 text-center text-sm font-semibold text-gray-900">{qty}</span>
                                <button onClick={() => setCartIds(product._id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm text-xs">
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-gray-900">RWF {(unitPrice * qty).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop layout */}
                        <div className="hidden sm:grid sm:grid-cols-[80px_1fr_140px_100px] gap-4 items-center">
                          <Link href={`/view/${product._id}`}>
                            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-50">
                              {product.productImages?.[0] ? (
                                <img src={product.productImages[0]} alt={product.productName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                              )}
                            </div>
                          </Link>
                          <div className="min-w-0">
                            <Link href={`/view/${product._id}`}>
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-[#FFC831] transition-colors">{product.productName}</h3>
                            </Link>
                            <p className="text-xs text-gray-400 mt-0.5">Unit Price: RWF {unitPrice.toLocaleString()}</p>
                            {product.productDiscount > 0 && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                                -{product.productDiscount}%
                              </span>
                            )}
                            <button onClick={() => removeProduct(product._id)}
                              className="text-[11px] text-gray-400 hover:text-red-500 mt-1 flex items-center gap-1 transition-colors">
                              <Trash2 size={11} />
                              Remove
                            </button>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                              <button onClick={() => qty > 1 && removeLastId(product._id)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-xs ${qty <= 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:bg-white hover:shadow-sm"}`} disabled={qty <= 1}>
                                <Minus size={13} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-gray-900">{qty}</span>
                              <button onClick={() => setCartIds(product._id)}
                                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-white hover:shadow-sm text-xs">
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">RWF {(unitPrice * qty).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Continue shopping — mobile */}
                  <div className="sm:hidden pt-2">
                    <Link href="/buyingpage" className="text-xs font-medium text-[#FFC831] hover:underline">
                      &larr; Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ Right: Order Summary ═══ */}
            {products.length > 0 && (
              <div className="w-full lg:w-[360px] shrink-0">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-20">
                  <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={16} className="text-[#FFC831]" />
                    Order Summary
                  </h2>

                  <div className="space-y-2.5 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Items ({totalItems})</span>
                      <span className="text-gray-900">RWF {totalOriginal.toLocaleString()}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Discount</span>
                        <span className="text-emerald-600 font-medium">- RWF {totalSavings.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Truck size={13} />
                        Shipping
                      </span>
                      <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-lg font-black text-gray-900">RWF {totalPrice.toLocaleString()}</div>
                      {totalSavings > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium">You save RWF {totalSavings.toLocaleString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Billing Form */}
                  <form onSubmit={handleOrder}>
                    {orderErrorMessage && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5 mb-3">
                        <Info size={13} className="shrink-0 mt-0.5" />
                        {orderErrorMessage}
                      </div>
                    )}

                    <div className="space-y-2.5 mb-4">
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Full Name" required
                          className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                          value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="email" placeholder="Email Address" required
                          className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                          value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input type="text" placeholder="City" required
                            className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                            value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="relative">
                          <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input type="text" placeholder="Postal" required
                            className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                            value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                        </div>
                      </div>
                      <div className="relative">
                        <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Street Address" required
                          className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                          value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                      </div>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select value={country} onChange={(e) => setCountry(e.target.value)} required
                          className="w-full h-9 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all appearance-none">
                          <option value="Rwanda">Rwanda</option>
                          <option value="Tanzania">Tanzania</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Drccongo">DRC Congo</option>
                          <option value="Burundi">Burundi</option>
                          <option value="Kenya">Kenya</option>
                          <option value="SouthSudan">South Sudan</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={submitting}
                      className="w-full h-11 flex items-center justify-center gap-2 bg-[#FFC831] text-[#0D0D0D] font-bold text-sm rounded-xl hover:bg-[#FFD454] active:scale-[0.985] transition-all duration-150 shadow-[0_4px_14px_rgba(255,200,49,0.35)] disabled:opacity-50 disabled:cursor-not-allowed">
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" /> Processing...</>
                      ) : (
                        <><Lock size={15} /> Place Order — RWF {totalPrice.toLocaleString()}</>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-300">
                    <ShieldCheck size={11} />
                    Secured with encryption
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckCart;
