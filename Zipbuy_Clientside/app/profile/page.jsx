"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Mail, Phone, MapPin, LogOut, Save, ChevronLeft,
  MapPinHouse, Globe, VenusMars, Heart, Store, AlertCircle,
  RefreshCw,
} from "lucide-react";
import api from "../../lib/api";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    mobileNumber: "", country: "", city: "",
    streetAddress: "", gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      sessionStorage.setItem("redirectAfterLogin", "/profile");
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [router]);

  async function fetchProfile() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/profile");
      if (data?.success) {
        setUserData(data.userData);
        setForm({
          firstName: data.userData.firstName || "",
          lastName: data.userData.lastName || "",
          email: data.userData.email || "",
          mobileNumber: data.userData.mobileNumber || "",
          country: data.userData.country || "",
          city: data.userData.city || "",
          streetAddress: data.userData.streetAddress || "",
          gender: data.userData.gender || "",
        });
      } else {
        setError(data?.message || "Failed to load profile");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load profile";
      setError(msg);
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const { data } = await api.put("/api/profile", form);
      if (data?.success) {
        setUserData(data.updatedUser);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(data?.message || "Failed to update profile");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      setError(msg);
      console.error("Profile update error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try { await api.post("/api/logout"); } catch {}
    localStorage.removeItem("token");
    sessionStorage.setItem("redirectAfterLogin", "/profile");
    router.push("/login");
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-md text-center shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 mb-1">Could not load profile</h2>
          <p className="text-xs text-gray-400 mb-4">{error}</p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={fetchProfile}
              className="text-xs font-semibold bg-[#FFC831] text-[#0D0D0D] px-4 py-2 rounded-lg hover:bg-[#FFD454] transition-colors flex items-center gap-1.5">
              <RefreshCw size={13} /> Retry
            </button>
            <button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }}
              className="text-xs font-medium text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <Link href="/buyingpage" className="flex items-center gap-1.5 group">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FFC831] to-[#FFD454] flex items-center justify-center shadow-sm">
                <span className="text-[#0D0D0D] font-black text-[10px]">Z</span>
              </div>
              <span className="font-bold text-sm tracking-tight">Zip<span className="text-[#FFC831]">Buy</span></span>
            </Link>
            <span className="text-sm text-gray-200">/</span>
            <h1 className="text-sm font-semibold text-gray-900">My Profile</h1>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFC831] to-[#FFD454] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-[#0D0D0D] font-black text-lg">
                {form.firstName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">
                {form.firstName} {form.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {form.email && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Mail size={11} className="text-gray-300" /> {form.email}
                  </span>
                )}
                {form.city && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin size={11} className="text-gray-300" /> {form.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-1.5">
            <User size={14} className="text-[#FFC831]" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">First Name</label>
              <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Last Name</label>
              <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
              <input type="tel" value={form.mobileNumber} onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Country</label>
              <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Street Address</label>
              <input type="text" value={form.streetAddress} onChange={(e) => setForm({ ...form, streetAddress: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Gender</label>
              <input type="text" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
            <p className="text-xs text-gray-400">
              {userData?.updatedAt
                ? `Updated ${new Date(userData.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : ""}
            </p>
            <button type="submit" disabled={saving}
              className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-5 py-2.5 transition-all duration-150 shadow-sm ${
                saved ? "bg-green-500 text-white" : "bg-[#FFC831] text-[#0D0D0D] hover:bg-[#FFD454]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}>
              <Save size={14} />
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
