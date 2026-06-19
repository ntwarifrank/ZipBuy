"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowRight, ChevronRight, Check, Shield, Globe, Truck,
  TrendingUp, Star, Menu, X, ChevronDown, Building2,
  Package, Users, Award, Zap, HeadphonesIcon, Lock,
  BarChart3, Search, Mail, Phone, MapPin, Eye, EyeOff,
  PlayCircle, ExternalLink, CheckCircle2
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Suppliers", href: "#for-suppliers" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

const STATS = [
  { value: "200M+", label: "Products Listed", icon: Package },
  { value: "200K+", label: "Verified Suppliers", icon: Building2 },
  { value: "5,900+", label: "Categories", icon: BarChart3 },
  { value: "200+", label: "Countries Served", icon: Globe },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Account",
    description: "Sign up as a buyer or apply as a verified business supplier. Get approved in under 48 hours.",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "02",
    title: "Discover Products & Suppliers",
    description: "Browse millions of products across 5,900+ categories from verified global suppliers.",
    icon: Search,
    color: "from-alibabaOrange to-yellow-500",
  },
  {
    step: "03",
    title: "Negotiate & Order",
    description: "Connect directly with suppliers, request quotes, and place bulk orders with confidence.",
    icon: Package,
    color: "from-green-500 to-green-600",
  },
  {
    step: "04",
    title: "Pay & Ship Securely",
    description: "Transact through Stripe-secured payments and track your order from warehouse to door.",
    icon: Truck,
    color: "from-purple-500 to-purple-600",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Suppliers Only",
    description: "Every business on ZipBuy goes through a strict KYC process with RDB certificate, tax clearance, and document review by our admin team.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Lock,
    title: "Stripe-Secured Payments",
    description: "All transactions are processed through Stripe with full buyer protection — from payment initiation to delivery confirmation.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Source from verified suppliers across 200+ countries and regions. Ship anywhere in the world with transparent logistics.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Instant Storefront",
    description: "Approved suppliers get their own branded storefront — with product listings, profile, and order management ready to go.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Reach our team for supplier disputes, payment issues, or technical questions. We're here through every step of your trade.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    description: "Track orders, revenue, stock levels, and customer trends from a powerful admin and supplier dashboard.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const SUPPLIER_BENEFITS = [
  "Get a verified business badge displayed on your storefront",
  "List unlimited products with AI background removal",
  "Receive orders directly from thousands of buyers",
  "Manage your store, products, and stock in one dashboard",
  "Access analytics on views, orders, and revenue",
  "Get paid securely through Stripe integration",
];

const BUYER_BENEFITS = [
  "Browse products from hundreds of verified B2B suppliers",
  "Compare prices across multiple businesses",
  "Request bulk quotes and negotiate terms",
  "Pay once and track order progress in real-time",
  "Access supplier documents and certifications",
  "Raise disputes with full transaction protection",
];

const TESTIMONIALS = [
  {
    name: "Amara Diallo",
    role: "Procurement Director",
    company: "TechSupply Africa",
    text: "ZipBuy gave us access to verified electronics suppliers we couldn't find anywhere else. The verification process gives us real confidence when placing bulk orders.",
    rating: 5,
    avatar: "AD",
    color: "bg-blue-500",
  },
  {
    name: "Jean-Pierre Nkurunziza",
    role: "Business Owner",
    company: "Kigali Fashion House",
    text: "Setting up our storefront was seamless. Within 48 hours of approval we had our first 3 orders. The platform handles everything from product listing to payment.",
    rating: 5,
    avatar: "JN",
    color: "bg-green-500",
  },
  {
    name: "Sarah Mwangi",
    role: "Supply Chain Manager",
    company: "EastAfrica Logistics",
    text: "The background-removed product images automatically look professional. Our sales increased by 40% after moving to ZipBuy compared to our old manual process.",
    rating: 5,
    avatar: "SM",
    color: "bg-purple-500",
  },
];

const PRICING = [
  {
    name: "Buyer",
    price: "Free",
    period: "forever",
    description: "Perfect for businesses that want to source products from verified suppliers.",
    color: "border-gray-200",
    btnColor: "bg-darkGray text-white hover:bg-gray-800",
    badge: null,
    features: [
      "Browse all verified suppliers",
      "Unlimited product searches",
      "Direct supplier messaging",
      "Stripe-secured checkout",
      "Order tracking dashboard",
      "Dispute resolution support",
    ],
  },
  {
    name: "Supplier",
    price: "Contact Us",
    period: "custom pricing",
    description: "For verified businesses ready to sell to thousands of buyers on ZipBuy.",
    color: "border-alibabaOrange ring-2 ring-alibabaOrange",
    btnColor: "bg-alibabaOrange text-darkGray hover:bg-yellow-400",
    badge: "Most Popular",
    features: [
      "Verified supplier badge",
      "Branded storefront page",
      "Unlimited product listings",
      "AI background removal on images",
      "Order & stock management",
      "Stripe payout integration",
      "Sales analytics dashboard",
      "Priority admin support",
    ],
  },
];

const FAQS = [
  {
    q: "How does ZipBuy verify suppliers?",
    a: "Every supplier undergoes document verification including RDB certificate, tax clearance certificate, national ID, and trading license. Our admin team reviews all documents before granting the Verified badge.",
  },
  {
    q: "How long does supplier approval take?",
    a: "Most applications are reviewed within 48 business hours. You'll receive an email notification once your application is approved, rejected, or if we need additional information.",
  },
  {
    q: "How are payments handled?",
    a: "All payments are processed through Stripe, one of the world's most trusted payment platforms. Buyers pay securely at checkout, and suppliers receive payouts through Stripe's payout system.",
  },
  {
    q: "Can I sell internationally on ZipBuy?",
    a: "Yes. ZipBuy supports suppliers from 200+ countries and regions. You can set your own shipping zones, costs, and estimated delivery times per product.",
  },
  {
    q: "What happens if there's a dispute with an order?",
    a: "ZipBuy's support team mediates disputes between buyers and suppliers. Payments are held in escrow until delivery confirmation, protecting both sides of every transaction.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={16} className="fill-alibabaOrange text-alibabaOrange" />
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-full bg-alibabaOrange/10 flex items-center justify-center mb-3">
        <Icon size={22} className="text-alibabaOrange" />
      </div>
      <p className="text-3xl md:text-4xl font-extrabold text-darkGray">{stat.value}</p>
      <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
    </div>
  );
}

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-darkGray pr-4">{faq.q}</span>
        <ChevronDown
          size={20}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
          {faq.a}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Homepage = () => {
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

  // Registration form state
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", mobileNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Nav state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
        { ...form, name: `${form.firstName} ${form.lastName}` }
      );
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function scrollTo(id) {
    setMobileMenuOpen(false);
    document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="w-full bg-white text-darkGray overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            <span className={scrolled ? "text-alibabaOrange" : "text-alibabaOrange"}>ZIP</span>
            <span className={scrolled ? "text-darkGray" : "text-white"}>BUY</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-colors hover:text-alibabaOrange ${
                  scrolled ? "text-gray-600" : "text-white/90"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                scrolled
                  ? "text-darkGray hover:bg-gray-100 border border-gray-300"
                  : "text-white hover:bg-white/20 border border-white/40"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-bold bg-alibabaOrange text-darkGray rounded-lg hover:bg-yellow-400 transition-all shadow-lg"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? <X size={24} className={scrolled ? "text-darkGray" : "text-white"} />
              : <Menu size={24} className={scrolled ? "text-darkGray" : "text-white"} />
            }
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <div className="px-5 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-3 text-sm font-medium text-gray-700 hover:text-alibabaOrange hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold border border-gray-300 rounded-lg text-darkGray hover:bg-gray-50">
                  Sign In
                </Link>
                <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-bold bg-alibabaOrange text-darkGray rounded-lg hover:bg-yellow-400">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-darkGray to-gray-800 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-alibabaOrange/10 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-alibabaOrange/5 blur-2xl" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(#FFC831 1px, transparent 1px), linear-gradient(90deg, #FFC831 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left – copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-alibabaOrange/20 text-alibabaOrange text-xs font-bold px-4 py-2 rounded-full mb-6 border border-alibabaOrange/30">
                <Zap size={14} />
                <span>Rwanda's #1 B2B Marketplace</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Connect, Source &amp;{" "}
                <span className="text-alibabaOrange relative">
                  Trade
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C60 3 150 1 298 6" stroke="#FFC831" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>{" "}
                with Verified Businesses
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
                ZipBuy is the B2B marketplace where verified suppliers meet serious buyers.
                Browse thousands of products, negotiate bulk deals, and pay securely — all in one platform.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => scrollTo("#how-it-works")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-alibabaOrange text-darkGray font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-xl text-sm"
                >
                  See How It Works <ArrowRight size={18} />
                </button>
                <Link
                  href="/stores"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all text-sm"
                >
                  <Building2 size={18} /> Browse Suppliers
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500"].map((c, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-alibabaOrange text-alibabaOrange" />)}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">Trusted by 10,000+ businesses</p>
                </div>
              </div>
            </div>

            {/* Right – registration card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-alibabaOrange/10 text-alibabaOrange text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                  <Award size={13} /> Free to join as a buyer
                </div>
                <h2 className="text-2xl font-bold text-darkGray">Create your account</h2>
                <p className="text-sm text-gray-500 mt-1">Start sourcing from verified suppliers today</p>
              </div>

              {success ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle2 size={48} className="text-green-500" />
                  <p className="font-bold text-darkGray text-lg">Account created!</p>
                  <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
                      <X size={16} /> {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                        <input id="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="John" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                        <input id="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Doe" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                      <input id="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all" />
                    </div>
                    <div>
                      <label htmlFor="mobileNumber" className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input id="mobileNumber" type="tel" value={form.mobileNumber} onChange={handleChange} placeholder="+250 7XX XXX XXX" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                          <input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Min 8 chars" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all pr-9" />
                          <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">Confirm</label>
                        <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-alibabaOrange focus:border-alibabaOrange transition-all" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-alibabaOrange text-darkGray font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-md text-sm disabled:opacity-60 mt-1">
                      {loading ? "Creating account…" : "Create Free Account →"}
                    </button>
                    <p className="text-center text-xs text-gray-500">
                      Already have an account?{" "}
                      <Link href="/login" className="text-alibabaOrange font-semibold hover:underline">Sign in</Link>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <section className="bg-alibabaOrange/5 border-y border-alibabaOrange/20 py-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-alibabaOrange/20">
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <PlayCircle size={14} /> Simple &amp; Fast
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Start trading in 4 steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              ZipBuy is built to get you from registration to your first B2B transaction as quickly as possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-alibabaOrange/30 via-alibabaOrange/60 to-alibabaOrange/30" />

            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="absolute top-2 right-2 text-xs font-black text-gray-200 select-none text-5xl leading-none z-0">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg text-darkGray mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Shield size={14} /> Built for B2B Trust
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Everything your business needs
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              From supplier verification to secure payments, ZipBuy removes the friction from B2B trade.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className={feat.color} />
                  </div>
                  <h3 className="font-bold text-lg text-darkGray mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOR SUPPLIERS / FOR BUYERS ─────────────────────────────────────── */}
      <section id="for-suppliers" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Built for both sides of trade
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Whether you're sourcing for your business or selling at scale, ZipBuy has the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Supplier card */}
            <div className="rounded-2xl overflow-hidden border-2 border-alibabaOrange shadow-lg">
              <div className="bg-alibabaOrange px-8 py-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-darkGray/20 rounded-xl flex items-center justify-center">
                  <Building2 size={26} className="text-darkGray" />
                </div>
                <div>
                  <p className="text-xs font-bold text-darkGray/70 uppercase tracking-wider">For Businesses</p>
                  <h3 className="text-2xl font-extrabold text-darkGray">Become a Supplier</h3>
                </div>
              </div>
              <div className="bg-white px-8 py-7">
                <p className="text-sm text-gray-500 mb-6">
                  List your products on a verified marketplace, reach thousands of B2B buyers, and manage everything from one dashboard.
                </p>
                <ul className="space-y-3 mb-8">
                  {SUPPLIER_BENEFITS.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 size={17} className="text-alibabaOrange flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-alibabaOrange text-darkGray font-bold rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md"
                >
                  Apply as a Supplier <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Buyer card */}
            <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
              <div className="bg-darkGray px-8 py-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users size={26} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">For Businesses</p>
                  <h3 className="text-2xl font-extrabold text-white">Source Products</h3>
                </div>
              </div>
              <div className="bg-white px-8 py-7">
                <p className="text-sm text-gray-500 mb-6">
                  Join for free and get instant access to hundreds of verified suppliers, millions of products, and a seamless checkout experience.
                </p>
                <ul className="space-y-3 mb-8">
                  {BUYER_BENEFITS.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 size={17} className="text-darkGray flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/stores"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-darkGray text-white font-bold rounded-xl hover:bg-gray-700 transition-all text-sm shadow-md"
                >
                  Browse Suppliers <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BANNER ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-darkGray to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { icon: Shield, label: "KYC Verified Suppliers", sub: "RDB, tax clearance & ID checked" },
              { icon: Lock, label: "Stripe-Secured Payments", sub: "Escrow protection on every order" },
              { icon: Award, label: "Quality Guarantee", sub: "Dispute resolution on every trade" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-alibabaOrange/20 rounded-full flex items-center justify-center">
                    <Icon size={26} className="text-alibabaOrange" />
                  </div>
                  <p className="font-bold text-white text-lg">{item.label}</p>
                  <p className="text-gray-400 text-sm">{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 text-xs font-bold px-4 py-2 rounded-full mb-4">
              <Star size={14} /> Real Businesses, Real Results
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Trusted by businesses across Africa
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              See how ZipBuy is transforming B2B trade for suppliers and buyers on the continent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 flex flex-col">
                <StarRating count={t.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-darkGray text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Buying is always free. Supplying is tailored to your business size.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PRICING.map((plan, i) => (
              <div key={i} className={`rounded-2xl border-2 ${plan.color} p-8 relative shadow-sm hover:shadow-xl transition-all duration-300`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-alibabaOrange text-darkGray text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{plan.name}</p>
                  <p className="text-4xl font-extrabold text-darkGray">{plan.price}</p>
                  <p className="text-sm text-gray-400 mt-1">{plan.period}</p>
                </div>
                <p className="text-sm text-gray-500 mb-7">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <Check size={16} className="text-alibabaOrange flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 px-6 rounded-xl font-bold text-sm transition-all ${plan.btnColor}`}
                >
                  {plan.name === "Buyer" ? "Join for Free" : "Apply as Supplier"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-darkGray mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-500 text-sm">Everything you need to know before getting started.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-darkGray via-gray-800 to-gray-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-alibabaOrange/10 blur-3xl" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-5 text-center relative">
          <div className="inline-flex items-center gap-2 bg-alibabaOrange/20 text-alibabaOrange text-xs font-bold px-4 py-2 rounded-full mb-6 border border-alibabaOrange/30">
            <Zap size={14} /> Get started in minutes
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to grow your<br />
            <span className="text-alibabaOrange">B2B business?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of verified suppliers and buyers on ZipBuy. Create your free account today and start trading with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-alibabaOrange text-darkGray font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-xl text-base"
            >
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link
              href="/stores"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 border border-white/20 transition-all text-base"
            >
              <Building2 size={20} /> View Suppliers
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            No credit card required · Free for buyers · Supplier verification in 48h
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-darkGray text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="text-2xl font-extrabold mb-4">
                <span className="text-alibabaOrange">ZIP</span>
                <span className="text-white">BUY</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                Rwanda's leading B2B marketplace — connecting verified businesses to global buyers.
              </p>
              <div className="flex gap-3">
                {/* Facebook */}
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-alibabaOrange hover:text-darkGray text-white transition-all" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Twitter/X */}
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-alibabaOrange hover:text-darkGray text-white transition-all" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-alibabaOrange hover:text-darkGray text-white transition-all" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/stores" className="hover:text-alibabaOrange transition-colors">Browse Suppliers</Link></li>
                <li><Link href="/register" className="hover:text-alibabaOrange transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-alibabaOrange transition-colors">Sign In</Link></li>
                <li><a href="#how-it-works" className="hover:text-alibabaOrange transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-alibabaOrange transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-alibabaOrange transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-alibabaOrange transition-colors">Supplier FAQ</a></li>
                <li><a href="#" className="hover:text-alibabaOrange transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-alibabaOrange transition-colors">Return &amp; Refund</a></li>
                <li><a href="#" className="hover:text-alibabaOrange transition-colors">Dispute Resolution</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Mail size={15} className="text-alibabaOrange mt-0.5 flex-shrink-0" />
                  <span>support@zipbuy.rw</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone size={15} className="text-alibabaOrange mt-0.5 flex-shrink-0" />
                  <span>+250 788 000 000</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-alibabaOrange mt-0.5 flex-shrink-0" />
                  <span>Kigali, Rwanda</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} ZipBuy. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-alibabaOrange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-alibabaOrange transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-alibabaOrange transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Homepage;
