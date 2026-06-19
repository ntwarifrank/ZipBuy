"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../lib/api";
import {
  Settings, User, Mail, Save, Shield, Bell,
  UserCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [admin, setAdmin] = useState({ name: "", email: "" });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile");
        if (data.success) {
          setAdmin({ name: data.user.name || data.user.firstName + " " + (data.user.lastName || ""), email: data.user.email });
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || data.user.mobileNumber || "");
        }
      } catch (err) {
        try {
          const { data } = await api.get("/api/me");
          if (data.success) {
            setAdmin({ name: data.user.name || "Admin", email: data.user.email });
            setEmail(data.user.email || "");
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    try {
      await api.put("/api/profile", { firstName, lastName, email, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  const inp = "w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Settings</h2>
          <p className="text-sm text-gray-400">Manage your account preferences.</p>
        </div>

        {/* Profile section */}
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <UserCircle size={32} className="text-[#FFC831]" />
            <div>
              <p className="text-sm font-bold text-[#0D0D0D]">{admin.name || "Admin"}</p>
              <p className="text-xs text-gray-400">{admin.email}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-[#0D0D0D]/20 border-t-[#FFC831] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inp} />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FFC831] text-[#0D0D0D] text-sm font-bold rounded-xl hover:bg-[#FFD454] transition-all shadow-sm">
              {saved ? (
                <><Save size={14} /> Saved!</>
              ) : (
                <><Save size={14} /> Save Changes</>
              )}
            </button>
          </div>
        </form>

        {/* Info card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Shield size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Administrator Account</p>
            <p className="text-xs text-amber-700/70 mt-0.5">You have full access to manage the marketplace. Changes to your profile are saved immediately.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
