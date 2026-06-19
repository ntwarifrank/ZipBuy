"use client";
import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Building2, Upload, ShieldCheck, ArrowRight, CheckCircle2,
  FileText, Image, AlertCircle, Sparkles, X, Clock,
  MapPin, Phone, FileCheck,
} from "lucide-react";

const DOCUMENT_OPTIONS = [
  { value: "rdb_certificate", label: "RDB Certificate" },
  { value: "tax_clearance", label: "Tax Clearance Certificate" },
  { value: "national_id", label: "National ID / Passport" },
  { value: "trading_license", label: "Trading License" },
];

const CATEGORIES_CACHE_KEY = "zipbuy_categories_v2";

const STEPS = [
  { id: 1, label: "Business Info", icon: Building2 },
  { id: 2, label: "Address & Logo", icon: MapPin },
  { id: 3, label: "Documents", icon: FileText },
  { id: 4, label: "Submit", icon: ShieldCheck },
];

export default function BusinessOnboarding() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Profile form
  const [businessName, setBusinessName] = useState("");
  const [businessRegNumber, setBusinessRegNumber] = useState("");
  const [businessTaxId, setBusinessTaxId] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");

  // Documents
  const [documentType, setDocumentType] = useState("rdb_certificate");
  const [documentFile, setDocumentFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Logo
  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      try { setCategoryOptions(JSON.parse(cached).map(c => c.name).concat(["Other"])); } catch {}
    }
    api.get("/categories").then((res) => {
      const cats = res.data.categories || [];
      setCategoryOptions(cats.map(c => c.name).concat(["Other"]));
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cats));
    }).catch(() => setCategoryOptions(["Other"]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "business") {
        router.push("/buyingpage");
        return;
      }
      if (decoded.verificationStatus === "approved") {
        router.push("/business/dashboard");
        return;
      }
      fetchProfile();
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  async function fetchProfile() {
    try {
      const { data } = await api.get("/api/business/profile");
      if (data.success) {
        setProfile(data.user);
        setBusinessName(data.user.businessProfile?.businessName || "");
        setBusinessRegNumber(data.user.businessProfile?.businessRegNumber || "");
        setBusinessTaxId(data.user.businessProfile?.businessTaxId || "");
        setBusinessPhone(data.user.businessProfile?.businessPhone || "");
        setCategory(data.user.businessProfile?.category || "");
        setDescription(data.user.businessProfile?.businessDescription || "");
        setProvince(data.user.businessProfile?.businessAddress?.province || "");
        setDistrict(data.user.businessProfile?.businessAddress?.district || "");
        setSector(data.user.businessProfile?.businessAddress?.sector || "");

        // Determine current step based on profile completion
        const bp = data.user.businessProfile || {};
        if (bp.businessName && bp.category) {
          if (bp.businessAddress?.province && bp.businessAddress?.district) {
            if ((data.user.documents || []).length > 0) {
              setStep(4);
            } else {
              setStep(3);
            }
          } else {
            setStep(2);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put("/api/business/profile", {
        businessName,
        businessRegNumber,
        businessTaxId,
        businessPhone,
        category,
        businessDescription: description,
        businessAddress: { province, district, sector },
      });
      if (data.success) {
        setProfile(data.user);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleUploadLogo(e) {
    e.preventDefault();
    if (!logoFile) return;
    setUploadingLogo(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);
      const { data } = await api.post("/api/business/logo", formData);
      if (data.success) {
        setLogoFile(null);
        fetchProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleUploadDocument(e) {
    e.preventDefault();
    if (!documentFile) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("document", documentFile);
      formData.append("documentType", documentType);
      const { data } = await api.post("/api/business/documents", formData);
      if (data.success) {
        setProfile((prev) => ({ ...prev, documents: data.documents }));
        setDocumentFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmitVerification() {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.post("/api/business/submit-verification", {});
      if (data.success) {
        fetchProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit for verification");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  const status = profile?.verificationStatus;
  const docs = profile?.documents || [];
  const hasLogo = profile?.businessProfile?.businessLogo;

  // Check if submitted (pending/approved/rejected)
  if (status === "pending" || status === "approved" || status === "rejected" || status === "info_needed") {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-100 p-8 lg:p-10 text-center shadow-xl">
          {status === "approved" ? (
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
          ) : status === "rejected" ? (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={40} className="text-red-500" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
              <Clock size={40} className="text-amber-500" />
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {status === "approved" ? "Business Verified!" :
             status === "rejected" ? "Verification Rejected" :
             status === "info_needed" ? "Additional Info Required" :
             "Verification in Progress"}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {status === "approved"
              ? "Your business is verified. You can now start selling on ZipBuy."
              : status === "rejected"
                ? "Your verification could not be approved. Please review the feedback below."
                : status === "info_needed"
                  ? "The admin has requested additional information. Please check the notes below."
                  : "We're reviewing your documents. This usually takes 24-48 hours."}
          </p>

          {profile?.verificationNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-amber-700 mb-1">Admin Notes:</p>
              <p className="text-sm text-amber-600">{profile.verificationNotes}</p>
            </div>
          )}

          {status === "approved" ? (
            <button
              onClick={() => router.push("/business/dashboard")}
              className="inline-flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 transition-all"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : status === "rejected" || status === "info_needed" ? (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 transition-all"
            >
              Update Profile
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFC831] to-[#FFA800] flex items-center justify-center shadow-lg shadow-[#FFC831]/25">
                <span className="text-[#0D0D0D] font-black text-sm">Z</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">ZipBuy Business</span>
            </div>
            <button
              onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
              className="text-xs font-medium text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        {/* header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FFC831]/10 border border-[#FFC831]/20 text-[#FFC831] text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-3">
            <Sparkles size={10} />
            Business Onboarding
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Set Up Your Business</h1>
          <p className="text-xs text-gray-400 mt-1">Complete your profile and documents to start selling on ZipBuy.</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s.id
                      ? "bg-gradient-to-br from-[#FFC831] to-[#FFA800] text-[#0D0D0D] shadow-lg shadow-[#FFC831]/20"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${
                    step >= s.id ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-all duration-300 ${
                    step > s.id ? "bg-[#FFC831]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
                <Building2 size={14} className="text-[#0D0D0D]" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Business Information</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your registered business name"
                  className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Registration Number</label>
                  <input
                    type="text"
                    value={businessRegNumber}
                    onChange={(e) => setBusinessRegNumber(e.target.value)}
                    placeholder="RDB reg. number"
                    className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">TIN / Tax ID</label>
                  <input
                    type="text"
                    value={businessTaxId}
                    onChange={(e) => setBusinessTaxId(e.target.value)}
                    placeholder="Tax identification number"
                    className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Business Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B5AD] pointer-events-none" />
                    <input
                      type="tel"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full bg-white border border-[#E4E2DC] rounded-xl pl-10 pr-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD] appearance-none cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Business Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers about your business..."
                  className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD] min-h-[80px] resize-y"
                  rows={3}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save & Continue"}
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Address & Logo */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
                  <MapPin size={14} className="text-[#0D0D0D]" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Business Address</h2>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Province *</label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="e.g. Kigali"
                      className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">District *</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Nyarugenge"
                      className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Sector</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="e.g. Kimisagara"
                      className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] placeholder:text-[#B8B5AD] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all hover:border-[#C8C5BD]"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-10 px-4 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save & Continue"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </div>

            {/* Logo */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
                  <Image size={14} className="text-[#0D0D0D]" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Business Logo</h2>
              </div>
              <form onSubmit={handleUploadLogo} className="space-y-4">
                {hasLogo ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.businessProfile.businessLogo}
                      alt="Business Logo"
                      className="w-20 h-20 object-cover rounded-2xl border border-gray-100 shadow-sm"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Logo uploaded</p>
                      <p className="text-[10px] text-gray-400">You can upload a new logo to replace it.</p>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 h-28 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#FFC831]/40 hover:bg-[#FFC831]/5 transition-all duration-200">
                    <Upload size={20} className="text-gray-300" />
                    <span className="text-xs text-gray-400 font-medium">Click to upload your business logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
                {logoFile && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {logoFile.name}
                    <button
                      type="button"
                      onClick={() => setLogoFile(null)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                {logoFile && (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={uploadingLogo}
                      className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 disabled:opacity-50 transition-all"
                    >
                      {uploadingLogo ? "Uploading Logo..." : "Upload Logo"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[#FFC831]/10 flex items-center justify-center">
                <FileCheck size={14} className="text-[#0D0D0D]" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Verification Documents</h2>
            </div>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              Upload your RDB Certificate, TIN, National ID/Passport, Tax Clearance, and Trading License. These documents will be reviewed by our admin team.
            </p>

            {/* Uploaded documents */}
            {docs.length > 0 && (
              <div className="mb-5 space-y-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Uploaded Documents</p>
                {docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-700">
                        {DOCUMENT_OPTIONS.find((o) => o.value === doc.type)?.label || doc.type}
                      </span>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#FFC831] hover:text-[#E5B000] transition-colors"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 text-sm text-[#3D3B36] focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {DOCUMENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#3D3B36] mb-1.5 uppercase tracking-wide">File</label>
                    <label className="flex items-center gap-2 h-10 px-3 bg-white border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#FFC831]/40 transition-all">
                      <Upload size={14} className="text-gray-300" />
                      <span className="text-xs text-gray-400">
                        {documentFile ? documentFile.name : "Choose file..."}
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setDocumentFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={!documentFile || uploading}
                    className="h-10 px-4 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 disabled:opacity-50 transition-all whitespace-nowrap"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </form>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-10 px-4 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={docs.length === 0}
                className="inline-flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 disabled:opacity-50 transition-all"
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submit */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC831]/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-[#FFC831]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Ready for Verification</h2>
            <p className="text-xs text-gray-400 mb-1 max-w-sm mx-auto">
              Please review your information before submitting. Our admin team will verify your documents within 24-48 hours.
            </p>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left max-w-sm mx-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Business Name</span>
                  <span className="font-semibold text-gray-900">{businessName || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                  <span className="text-gray-400">Category</span>
                  <span className="font-semibold text-gray-900">{category || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                  <span className="text-gray-400">Documents</span>
                  <span className="font-semibold text-gray-900">{docs.length} uploaded</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-gray-200/50 pt-2">
                  <span className="text-gray-400">Address</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[140px]">{province || "—"}{district ? `, ${district}` : ""}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="h-10 px-4 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmitVerification}
                disabled={saving}
                className="inline-flex items-center gap-2 h-11 px-6 bg-gradient-to-r from-[#FFC831] to-[#FFA800] text-[#0D0D0D] font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#FFC831]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0D0D0D]/20 border-t-[#0D0D0D] rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Submit for Verification
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
