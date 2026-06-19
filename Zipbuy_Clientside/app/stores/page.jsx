"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Search, Star, MapPin, ShieldCheck } from "lucide-react";
import api from "../../lib/api";
import Nav from "../nav/page";

export default function StoresDirectory() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    try {
      const { data } = await api.get("/api/stores");
      if (data.success) setBusinesses(data.businesses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = businesses.filter((biz) => {
    const name = (biz.businessProfile?.businessName || biz.name || "").toLowerCase();
    const desc = (biz.businessProfile?.businessDescription || "").toLowerCase();
    const cat = (biz.businessProfile?.category || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Store size={26} className="text-[#FFC831]" />
            Stores
          </h1>
          <p className="text-sm text-gray-400 mt-1">Browse verified businesses on ZipBuy</p>
        </div>

        {/* search */}
        <div className="relative max-w-md mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/20 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#FFC831] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Store size={24} className="text-gray-300" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              {searchQuery ? "No stores match your search" : "No stores yet"}
            </h2>
            <p className="text-sm text-gray-400">
              {searchQuery ? "Try a different search term" : "Check back later for new stores"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((biz) => {
              const name = biz.businessProfile?.businessName || biz.name || "Unnamed Store";
              return (
                <Link
                  key={biz._id}
                  href={`/stores/${biz._id}`}
                  className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {biz.businessProfile?.businessLogo ? (
                      <img
                        src={biz.businessProfile.businessLogo}
                        alt=""
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-[#FFC831] to-[#FFD454] rounded-xl flex items-center justify-center text-[#0D0D0D] text-xl font-bold shadow-sm">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#FFC831] transition-colors truncate">
                        {name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {biz.businessProfile?.category && (
                          <span className="text-[10px] font-medium bg-[#FFC831]/10 text-[#b38a00] px-2 py-0.5 rounded-full">
                            {biz.businessProfile.category}
                          </span>
                        )}
                        {biz.verificationStatus === "approved" && (
                          <ShieldCheck size={11} className="text-green-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                  {biz.businessProfile?.businessDescription && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                      {biz.businessProfile.businessDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] text-gray-300">
                    {biz.businessProfile?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {biz.businessProfile.city}
                        {biz.businessProfile.country ? `, ${biz.businessProfile.country}` : ""}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star size={10} className="fill-[#FFC831] text-[#FFC831]" />
                      4.5
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
