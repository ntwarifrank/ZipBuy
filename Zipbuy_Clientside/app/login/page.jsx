"use client";
import { useState, useEffect, Suspense } from "react";
import api from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  ShieldCheck, Zap, Globe, TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    body: "RDB certificate, tax clearance & ID review for every business.",
  },
  {
    icon: TrendingUp,
    title: "B2B at Scale",
    body: "Source bulk products from 200K+ suppliers across 200+ countries.",
  },
  {
    icon: Zap,
    title: "Instant Storefront",
    body: "Approved suppliers go live in under 48 hours with a branded store.",
  },
  {
    icon: Globe,
    title: "Secure Payments",
    body: "Every transaction is Stripe-protected with full buyer & seller coverage.",
  },
];

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRedirect = searchParams.get("redirect") || "";
  const [redirectTo, setRedirectTo] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("redirectAfterLogin");
    sessionStorage.removeItem("redirectAfterLogin");
    setRedirectTo(stored || urlRedirect);
  }, [urlRedirect]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const d = jwtDecode(token);
      if (d.role === "business") {
        router.push(d.verificationStatus === "approved"
          ? "/business/dashboard" : "/business/onboarding");
      } else {
        router.push(redirectTo || "/buyingpage");
      }
    } catch { localStorage.removeItem("token"); }
  }, [router, redirectTo]);

  const validate = () => {
    if (!form.email) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/login", form);
      if (data.success) {
        localStorage.setItem("token", data.token);
        if (data.user.role === "business") {
          router.push(data.user.verificationStatus === "approved"
            ? "/business/dashboard" : "/business/onboarding");
        } else {
          router.push(redirectTo || "/buyingpage");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name, extra = "") =>
    [
      "w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#3D3B36]",
      "placeholder:text-[#B8B5AD] transition-all duration-200 outline-none",
      active === name
        ? "border-[#FFC831] ring-2 ring-[#FFC831]/20 shadow-sm"
        : error && name === "email" && !form.email
          ? "border-red-400 ring-2 ring-red-100"
          : "border-[#E4E2DC] hover:border-[#C8C5BD]",
      extra,
    ].join(" ");

  return (
    <div className="h-dvh w-screen flex overflow-hidden bg-[#F8F7F4]">
      {/* ═══ LEFT — brand panel ═══ */}
      <aside className="hidden md:flex md:w-1/2 lg:w-[52%] bg-[#0D0D0D] flex-col relative overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FFC831 1px,transparent 1px),linear-gradient(90deg,#FFC831 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[#FFC831]/8 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-blue-600/6 blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col h-full px-8 lg:px-10 xl:px-12 pt-8 lg:pt-10 xl:pt-12 pb-6">
          {/* logo */}
          <Link href="/" className="flex items-center gap-1 w-fit mb-4 lg:mb-5">
            <span className="text-[#FFC831] font-black text-xl lg:text-2xl tracking-tight">ZIP</span>
            <span className="text-white font-black text-xl lg:text-2xl tracking-tight">BUY</span>
          </Link>

          {/* hero */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[11px] lg:text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC831] animate-pulse" />
              Africa&rsquo;s #1 B2B Marketplace
            </div>

            <h1 className="text-white font-black text-4xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-3 lg:mb-4">
              Trade with<br />
              <span className="text-[#FFC831]">verified</span><br />
              businesses
            </h1>

            <p className="text-[#888880] text-xs lg:text-sm leading-relaxed max-w-xs mb-4 lg:mb-5">
              Source products, connect with suppliers, and pay securely &mdash; all on one platform built for modern B2B trade.
            </p>

            {/* features — 2x2 grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2.5 max-w-xl">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-2 group min-w-0">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-[#FFC831]/10 border border-[#FFC831]/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#FFC831]/20 transition-colors">
                    <Icon size={13} className="text-[#FFC831]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs lg:text-sm font-semibold leading-tight mb-0.5">{title}</p>
                    <p className="text-[#888880] text-[11px] lg:text-xs leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ RIGHT — form panel ═══ */}
      <main className="flex-1 flex flex-col">
        {/* mobile logo */}
        <div className="md:hidden flex items-center justify-center pt-6 pb-2">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-[#FFC831] font-black text-2xl">ZIP</span>
            <span className="text-[#0D0D0D] font-black text-2xl">BUY</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-6 lg:py-8 max-w-xl w-full mx-auto">
          {/* heading */}
          <div className="mb-4">
            <h2 className="text-[#0D0D0D] font-black text-3xl lg:text-4xl tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-[#888880] text-sm lg:text-base">
              Sign in to continue to your account
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white font-black text-[9px]">!</span>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* email */}
            <div>
              <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setActive("email")}
                  onBlur={() => setActive(null)}
                  placeholder="you@company.com"
                  className={inp("email", "pl-11")}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#3D3B36] uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#FFC831] font-semibold hover:text-[#E5B000] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setActive("password")}
                  onBlur={() => setActive(null)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className={inp("password", "pl-11 pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] hover:text-[#3D3B36] transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 bg-[#FFC831] text-[#0D0D0D] font-bold text-sm rounded-xl hover:bg-[#FFD454] active:scale-[0.985] transition-all duration-150 shadow-[0_4px_14px_rgba(255,200,49,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" />
                  <span>Signing in&hellip;</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-[#E4E2DC]" />
            <span className="text-[#B8B5AD] text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-[#E4E2DC]" />
          </div>

          {/* register CTA */}
          <Link
            href="/register"
            className="w-full h-11 flex items-center justify-center gap-2 bg-white border border-[#E4E2DC] text-[#3D3B36] font-semibold text-sm rounded-xl hover:border-[#C8C5BD] hover:bg-[#F0EFE9] transition-all duration-150"
          >
            Create a free account
          </Link>

          {/* terms */}
          <p className="text-xs text-[#B8B5AD] text-center mt-4 leading-relaxed">
            By signing in you agree to ZipBuy&rsquo;s{" "}
            <a href="#" className="underline hover:text-[#3D3B36] transition-colors">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-[#3D3B36] transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
