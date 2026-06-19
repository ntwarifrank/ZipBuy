"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, ArrowRight, Server, Users, TrendingUp, Globe } from "lucide-react";
import api from "../../lib/api";
import Link from "next/link";

const FEATURES = [
  { icon: Users, title: "User Management", body: "Manage buyers, suppliers, and their accounts from one place." },
  { icon: Server, title: "Business Approvals", body: "Review and verify supplier documentation with ease." },
  { icon: TrendingUp, title: "Platform Analytics", body: "Track orders, revenue, and growth across the marketplace." },
  { icon: Globe, title: "Full Control", body: "Manage products, categories, and platform settings." },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/homepage");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/api/admin/login", { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/homepage");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inp = (extra = "") =>
    [
      "w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#3D3B36]",
      "placeholder:text-[#B8B5AD] transition-all duration-200 outline-none",
      "border-[#E4E2DC] hover:border-[#C8C5BD]",
      "focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10",
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
        <div className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full bg-indigo-600/6 blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col h-full px-8 lg:px-10 xl:px-12 pt-8 lg:pt-10 xl:pt-12 pb-6">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2 w-fit mb-4 lg:mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#FFC831] flex items-center justify-center">
              <span className="text-[#0D0D0D] font-black text-[11px]">Z</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ZipBuy Admin</span>
          </Link>

          {/* hero */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[11px] lg:text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC831] animate-pulse" />
              Admin Control Panel
            </div>

            <h1 className="text-white font-black text-4xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-3 lg:mb-4">
              Manage your<br />
              <span className="text-[#FFC831]">marketplace</span><br />
              with ease
            </h1>

            <p className="text-[#888880] text-xs lg:text-sm leading-relaxed max-w-xs mb-4 lg:mb-5">
              Full control over users, businesses, products, orders, and platform analytics &mdash; all from one powerful dashboard.
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFC831] flex items-center justify-center">
              <span className="text-[#0D0D0D] font-black text-[11px]">Z</span>
            </div>
            <span className="text-[#0D0D0D] font-bold text-lg">ZipBuy Admin</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-6 lg:py-8 max-w-lg w-full mx-auto">
          {/* icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#FFC831]/10 border border-[#FFC831]/20 flex items-center justify-center mb-4">
            <ShieldCheck size={24} className="text-[#FFC831]" />
          </div>

          {/* heading */}
          <div className="mb-5">
            <h2 className="text-[#0D0D0D] font-black text-3xl lg:text-4xl tracking-tight mb-1">
              Admin Sign In
            </h2>
            <p className="text-[#888880] text-sm lg:text-base">
              Authorized personnel only.
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
              <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActive("email")}
                  onBlur={() => setActive(null)}
                  placeholder="admin@zipbuy.com"
                  className={inp("pl-11")}
                  required
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setActive("password")}
                  onBlur={() => setActive(null)}
                  placeholder="Enter your password"
                  className={inp("pl-11")}
                  required
                />
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
                  Signing in&hellip;
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-[#B8B5AD] text-center mt-6 leading-relaxed">
            &copy; 2026 ZipBuy Admin. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
