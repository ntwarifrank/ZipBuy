"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard, Smartphone, Check, ShieldCheck, Lock,
  ChevronRight, ArrowLeft, Building, Info,
} from "lucide-react";
import Nav from "../../nav/page";

const STEPS = ["Cart", "Checkout", "Payment", "Confirmation"];

const PAYMENT_METHODS = [
  { id: "mtn", name: "MTN Mobile Money", icon: Smartphone, description: "Pay with MTN MoMo" },
  { id: "airtel", name: "Airtel Money", icon: Smartphone, description: "Pay with Airtel Money" },
  { id: "card", name: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard (coming soon)" },
];

function PayContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderToken = params.orderToken;
  const amount = searchParams.get("amount") || "0";

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const numAmount = parseFloat(amount);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!selectedMethod) return;
    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setPaid(true);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-[#F8F7F4]">
        <Nav />
        <div className="flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm max-w-md w-full">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Payment Successful!</h2>
            <p className="text-sm text-gray-400 mb-1">Your payment of RWF {numAmount.toLocaleString()} has been processed.</p>
            <p className="text-xs text-gray-300 mb-6">Order: <span className="font-mono font-medium">{orderToken}</span></p>
            <div className="space-y-3">
              <Link href="/buyingpage"
                className="block w-full py-3 bg-[#FFC831] text-[#0D0D0D] font-bold text-sm rounded-xl hover:bg-[#FFD454] transition-all shadow-[0_4px_14px_rgba(255,200,49,0.35)]">
                Continue Shopping
              </Link>
              <button onClick={() => router.push("/profile")}
                className="block w-full py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all">
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  i < 2 ? "text-[#FFC831]" : i === 2 ? "text-[#FFC831]" : "text-gray-300"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 2 ? "bg-[#FFC831] text-[#0D0D0D]" :
                    i === 2 ? "bg-[#FFC831] text-[#0D0D0D]" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {i < 2 ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    i === 2 ? "text-gray-900" : "text-gray-400"
                  }`}>{step}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-1 sm:mx-3 ${
                    i < 2 ? "bg-[#FFC831]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/buyingpage" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/checkCart" className="hover:text-gray-600 transition-colors">Cart</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium">Payment</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Payment Methods */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-1">Payment Method</h2>
              <p className="text-xs text-gray-400 mb-5">Choose how you&apos;d like to pay</p>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const disabled = method.id === "card";
                  return (
                    <button
                      key={method.id}
                      disabled={disabled}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-[#FFC831] bg-[#FFC831]/5"
                          : disabled
                            ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedMethod === method.id
                          ? "bg-[#FFC831]/10"
                          : "bg-gray-50"
                      }`}>
                        <method.icon size={18} className={selectedMethod === method.id ? "text-[#FFC831]" : "text-gray-400"} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-400">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-[#FFC831] flex items-center justify-center shrink-0">
                          <Check size={12} className="text-[#0D0D0D]" />
                        </div>
                      )}
                      {disabled && (
                        <span className="text-[10px] font-medium text-gray-300 bg-gray-100 px-2 py-1 rounded shrink-0">
                          Coming soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedMethod && selectedMethod !== "card" && (
                <form onSubmit={handlePay} className="mt-6 pt-6 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Mobile Money Number
                  </label>
                  <p className="text-[10px] text-gray-400 mb-3">
                    Enter the phone number linked to your {selectedMethod === "mtn" ? "MTN" : "Airtel"} Mobile Money account
                  </p>
                  <div className="relative">
                    <Smartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="+250 7XX XXX XXX"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={processing || !phone.trim()}
                    className="w-full h-11 mt-4 flex items-center justify-center gap-2 bg-[#FFC831] text-[#0D0D0D] font-bold text-sm rounded-xl hover:bg-[#FFD454] active:scale-[0.985] transition-all duration-150 shadow-[0_4px_14px_rgba(255,200,49,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <><div className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><Lock size={15} /> Pay RWF {numAmount.toLocaleString()}</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Payment Summary */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-20">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building size={15} className="text-[#FFC831]" />
                Payment Summary
              </h2>

              <div className="space-y-2.5 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Order</span>
                  <span className="text-xs font-mono font-medium text-gray-900">#{orderToken?.slice(0, 10)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-gray-900 font-semibold">RWF {numAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Fee</span>
                  <span className="text-emerald-600 text-xs font-medium">Free</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-black text-gray-900">RWF {numAmount.toLocaleString()}</span>
              </div>

              <Link href="/checkCart"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-all">
                <ArrowLeft size={13} />
                Back to Cart
              </Link>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-300">
                <ShieldCheck size={11} />
                Secured with encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pay() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]"><div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" /></div>}>
      <PayContent />
    </Suspense>
  );
}
