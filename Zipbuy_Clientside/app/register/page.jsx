"use client";
import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Mail, Lock, Phone, User,
  Building2, ArrowRight, CheckCircle2,
  ShieldCheck, Zap, Globe, TrendingUp,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "KYC Verified",
    body: "RDB certificate, tax clearance & ID checked before any supplier goes live.",
  },
  {
    icon: Zap,
    title: "Live in 48 Hours",
    body: "Approved suppliers get a branded storefront ready to receive orders.",
  },
  {
    icon: TrendingUp,
    title: "Built to Scale",
    body: "Manage products, orders, stock and payouts from one dashboard.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    body: "Connect with buyers across 200+ countries through one trusted platform.",
  },
];

function StrengthBar({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-lime-400", "bg-emerald-500"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : "bg-[#E4E2DC]"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${score <= 1 ? "text-red-500" : score === 2 ? "text-amber-500" : score === 3 ? "text-lime-600" : "text-emerald-600"}`}>
        {score > 0 ? `Password strength: ${labels[score]}` : ""}
      </p>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: "", role: "client",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [active, setActive] = useState(null);
  const [done, setDone] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setFieldErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don&rsquo;t match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true); setServerError("");
    try {
      const { data } = await api.post("/api/register", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setDone(true);
        setTimeout(() => router.push(form.role === "business" ? "/business/onboarding" : "/"), 1800);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (name, extra = "") =>
    [
      "w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#3D3B36]",
      "placeholder:text-[#B8B5AD] transition-all duration-200 outline-none",
      fieldErrors[name]
        ? "border-red-400 ring-2 ring-red-100"
        : active === name
          ? "border-[#FFC831] ring-2 ring-[#FFC831]/20 shadow-sm"
          : "border-[#E4E2DC] hover:border-[#C8C5BD]",
      extra,
    ].join(" ");

  return (
    <div className="h-dvh w-screen flex overflow-hidden bg-[#F8F7F4]">
      {/* ═══ LEFT — brand panel ═══ */}
      <aside className="hidden lg:flex lg:w-[44%] xl:w-[46%] bg-[#0D0D0D] flex-col relative overflow-hidden select-none">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FFC831 1px,transparent 1px),linear-gradient(90deg,#FFC831 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FFC831]/7 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col h-full px-8 lg:px-10 xl:px-12 pt-8 lg:pt-10 xl:pt-12 pb-6">
          {/* logo */}
          <Link href="/" className="flex items-center gap-0.5 w-fit mb-4 lg:mb-5">
            <span className="text-[#FFC831] font-black text-xl lg:text-2xl tracking-tight">ZIP</span>
            <span className="text-white font-black text-xl lg:text-2xl tracking-tight">BUY</span>
          </Link>

          {/* hero */}
          <div className="flex flex-col justify-center flex-1">
            <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[11px] lg:text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 w-fit">
              <Sparkles size={11} />
              Rwanda&rsquo;s #1 B2B Platform
            </div>

            <h1 className="text-white font-black text-4xl lg:text-5xl xl:text-5xl leading-[1.1] tracking-tight mb-3 lg:mb-4">
              Start selling<br />
              <span className="text-[#FFC831]">to thousands</span><br />
              of buyers
            </h1>

            <p className="text-[#888880] text-xs lg:text-sm leading-relaxed max-w-[260px] mb-4 lg:mb-5">
              Join as a buyer to source products, or register as a supplier and reach verified B2B buyers across Africa and beyond.
            </p>

            {/* features */}
            <div className="space-y-2.5 max-w-sm">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-2">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-[#FFC831]/10 border border-[#FFC831]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-[#FFC831]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs lg:text-sm font-semibold mb-0.5">{title}</p>
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
        <div className="lg:hidden flex items-center justify-center pt-6 pb-2">
          <Link href="/" className="flex items-center">
            <span className="text-[#FFC831] font-black text-2xl">ZIP</span>
            <span className="text-[#0D0D0D] font-black text-2xl">BUY</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-4 lg:py-6 max-w-2xl w-full mx-auto">
            {done ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h2 className="text-[#0D0D0D] font-black text-2xl mb-1">You&rsquo;re in!</h2>
                <p className="text-[#888880] text-sm">
                  {form.role === "business"
                    ? "Taking you to complete your business profile&hellip;"
                    : "Account created. Redirecting you now&hellip;"}
                </p>
              </div>
            ) : (
              <>
                {/* heading */}
                <div className="mb-3">
                  <h2 className="text-[#0D0D0D] font-black text-3xl tracking-tight mb-1">
                    Create your account
                  </h2>
                  <p className="text-[#888880] text-sm">
                    Free for buyers. Suppliers verified in 48h.
                  </p>
                </div>

                {/* role toggle */}
                <div className="flex p-1 bg-[#EDECEA] rounded-2xl mb-3 gap-1">
                  {[
                    { value: "client", label: "I&rsquo;m a Buyer", Icon: User },
                    { value: "business", label: "I&rsquo;m a Supplier", Icon: Building2 },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("role", value)}
                      className={[
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        form.role === value
                          ? "bg-white text-[#0D0D0D] shadow-sm border border-[#E4E2DC]"
                          : "text-[#888880] hover:text-[#3D3B36]",
                      ].join(" ")}
                    >
                      <Icon size={15} />
                      {value === "client" ? "I'm a Buyer" : "I'm a Supplier"}
                    </button>
                  ))}
                </div>

                {/* role hint */}
                <div className={[
                  "text-xs rounded-xl px-4 py-2.5 mb-3 border leading-relaxed",
                  form.role === "business"
                    ? "bg-[#FFF8E7] border-[#FFC831]/40 text-[#8A6A00]"
                    : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]",
                ].join(" ")}>
                  {form.role === "business"
                    ? "After signing up you&rsquo;ll complete your business profile and submit verification documents for review."
                    : "Buyer accounts are completely free with instant access to all verified suppliers and products."
                  }
                </div>

                {/* server error */}
                {serverError && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-black text-[9px]">!</span>
                    </div>
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  {/* name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        First Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => set("firstName", e.target.value)}
                          onFocus={() => setActive("firstName")}
                          onBlur={() => setActive(null)}
                          placeholder="John"
                          autoComplete="given-name"
                          className={inp("firstName", "pl-10")}
                        />
                      </div>
                      {fieldErrors.firstName && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        Last Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => set("lastName", e.target.value)}
                          onFocus={() => setActive("lastName")}
                          onBlur={() => setActive(null)}
                          placeholder="Doe"
                          autoComplete="family-name"
                          className={inp("lastName", "pl-10")}
                        />
                      </div>
                      {fieldErrors.lastName && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* email */}
                  <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        Email Address
                      </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        onFocus={() => setActive("email")}
                        onBlur={() => setActive(null)}
                        placeholder="you@company.com"
                        autoComplete="email"
                        className={inp("email", "pl-10")}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* phone */}
                  <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        Phone Number
                      </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        onFocus={() => setActive("phone")}
                        onBlur={() => setActive(null)}
                        placeholder="+250 7XX XXX XXX"
                        autoComplete="tel"
                        className={inp("phone", "pl-10")}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* password row — side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                        <input
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={(e) => set("password", e.target.value)}
                          onFocus={() => setActive("password")}
                          onBlur={() => setActive(null)}
                          placeholder="Min 6 characters"
                          autoComplete="new-password"
                          className={inp("password", "pl-10 pr-12")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] hover:text-[#3D3B36] transition-colors"
                          aria-label={showPw ? "Hide" : "Show"}
                        >
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                      )}
                      <StrengthBar password={form.password} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3D3B36] mb-1 uppercase tracking-wide">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                        <input
                          type={showCpw ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={(e) => set("confirmPassword", e.target.value)}
                          onFocus={() => setActive("confirmPassword")}
                          onBlur={() => setActive(null)}
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          className={inp("confirmPassword", "pl-10 pr-12")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCpw(!showCpw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8B5AD] hover:text-[#3D3B36] transition-colors"
                          aria-label={showCpw ? "Hide" : "Show"}
                        >
                          {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                      )}
                      {form.confirmPassword.length > 0 && !fieldErrors.confirmPassword && (
                        <p className={`text-xs mt-1 font-semibold flex items-center gap-1 ${
                          form.password === form.confirmPassword ? "text-emerald-600" : "text-red-500"
                        }`}>
                          {form.password === form.confirmPassword
                            ? <><CheckCircle2 size={12} /> Passwords match</>
                            : "✗ Passwords don&rsquo;t match"
                          }
                        </p>
                      )}
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
                        <span>Creating account&hellip;</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {form.role === "business" ? "Apply as a Supplier" : "Create Free Account"}
                        </span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* divider */}
                <div className="flex items-center gap-4 my-3">
                  <div className="flex-1 h-px bg-[#E4E2DC]" />
                  <span className="text-[#B8B5AD] text-xs font-medium">or</span>
                  <div className="flex-1 h-px bg-[#E4E2DC]" />
                </div>

                <Link
                  href="/login"
                  className="w-full h-11 flex items-center justify-center bg-white border border-[#E4E2DC] text-[#3D3B36] font-semibold text-sm rounded-xl hover:border-[#C8C5BD] hover:bg-[#F0EFE9] transition-all duration-150"
                >
                  Sign in to existing account
                </Link>

                <p className="text-xs text-[#B8B5AD] text-center mt-3 leading-relaxed">
                  By creating an account you agree to ZipBuy&rsquo;s{" "}
                  <a href="#" className="underline hover:text-[#3D3B36] transition-colors">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="underline hover:text-[#3D3B36] transition-colors">Privacy Policy</a>.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }
