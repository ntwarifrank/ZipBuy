"use client";
import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Building2, Search, CheckCircle, XCircle,
  FileText, ExternalLink, X, Mail, ShieldCheck,
  Ban, Phone, MapPin, Calendar, Clock, AlertCircle,
  ChevronLeft, ChevronRight, MessageSquare, Loader2,
  Eye, CheckSquare, FileCheck, Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

const STATUS_TABS = ["pending", "approved", "rejected", "info_needed", "none"];

const STATUS_MAP = {
  pending: ["bg-amber-50 text-amber-700 border border-amber-200/50", "Pending"],
  approved: ["bg-emerald-50 text-emerald-700 border border-emerald-200/50", "Approved"],
  rejected: ["bg-red-50 text-red-600 border border-red-200/50", "Rejected"],
  info_needed: ["bg-blue-50 text-blue-700 border border-blue-200/50", "Info Needed"],
  none: ["bg-gray-50 text-gray-500 border border-gray-100", "Incomplete"],
};

const DOC_LABELS = {
  rdb_certificate: "RDB Certificate",
  tax_clearance: "Tax Clearance",
  national_id: "National ID / Passport",
  trading_license: "Trading License",
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [counts, setCounts] = useState({});
  const [reviewedDocs, setReviewedDocs] = useState({});
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: filter, page, limit: 15 });
      if (search) params.set("search", search);
      const { data } = await api.get(`/api/admin/businesses?${params}`);
      if (data.success) {
        setBusinesses(data.businesses);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) { setError("Failed to fetch businesses"); }
    finally { setLoading(false); }
  }, [filter, page, search]);

  useEffect(() => { setPage(1); }, [filter, search]);
  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  useEffect(() => {
    Promise.all(
      STATUS_TABS.map((s) =>
        api.get(`/api/admin/businesses?status=${s}&limit=1`).then((r) => [s, r.data.pagination?.total || 0]).catch(() => [s, 0])
      )
    ).then((results) => setCounts(Object.fromEntries(results)));
  }, []);

  async function handleApprove(id) {
    const docTypes = (selected?.documents || []).map(d => d.type);
    const allReviewed = docTypes.every(t => reviewedDocs[t]);
    if (!allReviewed) { setError("Review all documents before approving"); return; }
    setActing(true);
    try {
      const { data } = await api.put(`/api/admin/businesses/${id}/approve`, {
        notes: actionMsg,
        documentsVerified: Object.keys(reviewedDocs).filter(k => reviewedDocs[k]),
      });
      if (data.success) { closeModal(); fetchBusinesses(); }
    } catch (err) { setError(err.response?.data?.message || "Failed to approve"); }
    finally { setActing(false); }
  }

  async function handleReject(id) {
    if (!rejectReason) return;
    setActing(true);
    try {
      const { data } = await api.put(`/api/admin/businesses/${id}/reject`, { reason: rejectReason });
      if (data.success) { closeModal(); fetchBusinesses(); }
    } catch (err) { setError(err.response?.data?.message || "Failed to reject"); }
    finally { setActing(false); }
  }

  async function handleRequestInfo(id) {
    if (!actionMsg) return;
    setActing(true);
    try {
      const { data } = await api.put(`/api/admin/businesses/${id}/request-info`, { message: actionMsg });
      if (data.success) { closeModal(); fetchBusinesses(); }
    } catch (err) { setError(err.response?.data?.message || "Failed to request info"); }
    finally { setActing(false); }
  }

  async function handleToggleStatus(id) {
    setActing(true);
    try {
      await api.put(`/api/admin/businesses/${id}/toggle-status`, {});
      setConfirmAction(null);
      fetchBusinesses();
    } catch (err) { setError(err.response?.data?.message || "Failed to toggle status"); }
    finally { setActing(false); }
  }

  function openReview(biz) {
    setSelected(biz);
    setShowModal(true);
    setActionMsg("");
    setRejectReason("");
    setConfirmAction(null);
    setPreviewDoc(null);
    setPreviewError(false);
    const initial = {};
    (biz.documents || []).forEach(d => { initial[d.type] = false; });
    setReviewedDocs(initial);
  }

  function closeModal() {
    setShowModal(false);
    setSelected(null);
    setActionMsg("");
    setRejectReason("");
    setConfirmAction(null);
    setPreviewDoc(null);
    setReviewedDocs({});
  }

  const toggleDocReview = (type) => {
    setReviewedDocs(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const allDocsReviewed = selected && (selected.documents || []).length > 0 &&
    (selected.documents || []).every(d => reviewedDocs[d.type]);

  const Badge = ({ status }) => {
    const [c, l] = STATUS_MAP[status] || STATUS_MAP.none;
    return <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${c}`}>{l}</span>;
  };

  const isImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url) || url.includes("cloudinary");

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#0D0D0D] tracking-tight">Business Verification</h2>
          <p className="text-sm text-gray-400 mt-0.5">Review and manage business account applications</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      <div className="relative mb-4">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by business name, email, or phone..."
          className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all" />
      </div>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab] ?? 0;
          return (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                filter === tab
                  ? "bg-[#FFC831] text-[#0D0D0D] shadow-sm"
                  : "bg-white text-gray-500 border border-gray-100/80 hover:border-gray-200 hover:shadow-sm"
              }`}>
              {tab === "none" ? "Incomplete" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  filter === tab ? "bg-[#0D0D0D]/10 text-[#0D0D0D]" : "bg-gray-100 text-gray-500"
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
      ) : businesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100/80 shadow-sm py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-gray-200" />
          </div>
          <p className="text-sm font-semibold text-gray-400">No businesses found</p>
          <p className="text-xs text-gray-300 mt-1">
            {search ? "Try a different search term" : `No businesses with "${filter}" status`}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Business</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Contact</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Docs</th>
                    <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {businesses.map((biz) => (
                    <tr key={biz._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFC831]/25 to-[#FFA800]/10 border border-[#FFC831]/20 flex items-center justify-center text-xs font-bold text-[#0D0D0D] shrink-0">
                            {(biz.businessProfile?.businessName || "B").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#0D0D0D] truncate">
                              {biz.businessProfile?.businessName || biz.firstName + " " + (biz.lastName || "") || biz.name || "N/A"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{biz.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="text-xs text-gray-600">{biz.businessProfile?.businessPhone || biz.mobileNumber || "—"}</div>
                        {biz.businessProfile?.businessAddress?.province && (
                          <div className="text-[11px] text-gray-400">{biz.businessProfile.businessAddress.province}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        {biz.businessProfile?.category ? (
                          <span className="text-[11px] font-medium bg-[#FFC831]/10 text-[#0D0D0D] px-2.5 py-1 rounded-full">{biz.businessProfile.category}</span>
                        ) : <span className="text-[11px] text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          (biz.documents || []).length >= 3 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>{(biz.documents || []).length}/4 docs</span>
                      </td>
                      <td className="px-4 py-3.5"><Badge status={biz.verificationStatus} /></td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openReview(biz)}
                            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-[#FFC831]/10 text-[#0D0D0D] hover:bg-[#FFC831]/20 transition-all whitespace-nowrap">
                            Review
                          </button>
                          <button onClick={() => setConfirmAction({ id: biz._id, active: biz.isActive })}
                            className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                              biz.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}>
                            {biz.isActive ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={15} className="text-gray-500" /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${page === p ? "bg-[#FFC831] text-[#0D0D0D]" : "text-gray-400 hover:bg-gray-100"}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={15} className="text-gray-500" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Suspend/Activate Confirmation */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto">
              <AlertCircle size={24} className="text-amber-500" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-[#0D0D0D]">
                {confirmAction.active ? "Suspend Business?" : "Activate Business?"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {confirmAction.active
                  ? "This business will not be able to access their account or manage products."
                  : "This business will regain full access to their account."}
              </p>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-100 text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => handleToggleStatus(confirmAction.id)} disabled={acting}
                className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50 ${
                  confirmAction.active ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                }`}>
                {acting ? <Loader2 size={14} className="animate-spin mx-auto" /> : confirmAction.active ? "Suspend" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Lightbox */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative max-w-2xl w-full max-h-[85vh] z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewDoc(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-20 hover:bg-gray-50 transition-all">
              <X size={14} className="text-gray-500" />
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[#FFC831]" />
                  <span className="text-xs font-bold text-[#0D0D0D]">{DOC_LABELS[previewDoc.type] || previewDoc.type}</span>
                </div>
                <a href={previewDoc.url} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <ExternalLink size={11} /> Open original
                </a>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto bg-gray-50/30 flex items-center justify-center min-h-[300px]">
                {isImageUrl(previewDoc.url) && !previewError ? (
                  <img src={previewDoc.url} alt={previewDoc.type}
                    className="max-w-full max-h-[60vh] rounded-lg shadow-sm object-contain"
                    onError={() => setPreviewError(true)} />
                ) : (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-400">Document Preview</p>
                    <p className="text-xs text-gray-300 mt-1">Click Open original to view the full document</p>
                    {previewError && (
                      <p className="text-xs text-red-400 mt-2">Failed to load image preview</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[3vh] overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFC831]/25 to-[#FFA800]/10 border border-[#FFC831]/20 flex items-center justify-center text-sm font-bold text-[#0D0D0D] shrink-0">
                  {(selected.businessProfile?.businessName || "B").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0D0D0D]">
                    {selected.businessProfile?.businessName || selected.firstName + " " + (selected.lastName || "") || "N/A"}
                  </h3>
                  <Badge status={selected.verificationStatus} />
                </div>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"><X size={16} className="text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Business Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100/80 space-y-2.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Business Information</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Email", value: selected.email, icon: Mail },
                    { label: "Phone", value: selected.businessProfile?.businessPhone || selected.mobileNumber || "—", icon: Phone },
                    { label: "Category", value: selected.businessProfile?.category || "—", icon: Building2 },
                    { label: "Reg Number", value: selected.businessProfile?.businessRegNumber || "—", icon: FileText },
                    { label: "Tax ID", value: selected.businessProfile?.businessTaxId || "—", icon: FileText },
                    { label: "Location", value: [selected.businessProfile?.businessAddress?.province, selected.businessProfile?.businessAddress?.district].filter(Boolean).join(", ") || "—", icon: MapPin },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon size={12} className="text-[#FFC831] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-xs font-medium text-[#0D0D0D] truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selected.businessProfile?.businessDescription && (
                  <div className="pt-2 border-t border-gray-100/80">
                    <p className="text-[10px] text-gray-400 mb-1">Description</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{selected.businessProfile.businessDescription}</p>
                  </div>
                )}
              </div>

              {/* Account Owner */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100/80 space-y-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Account Owner</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    {(selected.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D0D0D]">{selected.firstName} {selected.lastName}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={10} /> Joined {new Date(selected.createdAt).toLocaleDateString()}</span>
                      {selected.lastLogin && (
                        <span className="flex items-center gap-1"><Clock size={10} /> Last login {new Date(selected.lastLogin).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Verification */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Document Verification</p>
                  <span className="text-[10px] font-medium text-gray-500">
                    {Object.values(reviewedDocs).filter(Boolean).length}/{(selected.documents || []).length} reviewed
                  </span>
                </div>

                {selected.documents?.length > 0 ? (
                  <div className="space-y-3">
                    {selected.documents.map((doc, i) => {
                      const reviewed = reviewedDocs[doc.type];
                      return (
                        <div key={i} className={`rounded-xl border p-3.5 transition-all ${
                          reviewed
                            ? "bg-emerald-50/50 border-emerald-200/60"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                reviewed ? "bg-emerald-100" : "bg-gray-100"
                              }`}>
                                <FileText size={15} className={reviewed ? "text-emerald-600" : "text-gray-400"} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-[#0D0D0D]">{DOC_LABELS[doc.type] || doc.type}</p>
                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                  <span className="truncate">{doc.name || doc.type}</span>
                                  <span>•</span>
                                  <span>Uploaded {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => { setPreviewDoc(doc); setPreviewError(false); }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-all" title="Preview document">
                                <Eye size={14} className="text-gray-400" />
                              </button>
                              <button onClick={() => toggleDocReview(doc.type)}
                                className={`p-2 rounded-lg transition-all ${
                                  reviewed ? "bg-emerald-100 text-emerald-600" : "hover:bg-gray-100 text-gray-400"
                                }`} title={reviewed ? "Mark as unreviewed" : "Mark as reviewed"}>
                                {reviewed ? <CheckSquare size={14} /> : <CheckSquare size={14} className="opacity-40" />}
                              </button>
                            </div>
                          </div>
                          {/* Progress bar for reviewed state */}
                          {reviewed && (
                            <div className="mt-2.5 flex items-center gap-2 text-[10px] text-emerald-600">
                              <ShieldCheck size={11} />
                              <span>Verified — document appears authentic</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Overall progress bar */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${selected.documents.length > 0 ? (Object.values(reviewedDocs).filter(Boolean).length / selected.documents.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200/50">
                    <AlertTriangle size={20} className="mx-auto text-amber-400 mb-2" />
                    <p className="text-xs font-semibold text-amber-700">No documents uploaded</p>
                    <p className="text-[11px] text-amber-600 mt-0.5">This business has not submitted any verification documents yet.</p>
                  </div>
                )}

                {/* Missing document warning */}
                {selected.documents?.length < 4 && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/50">
                    <AlertTriangle size={12} />
                    <span>Only {selected.documents.length}/4 required documents submitted</span>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div className="space-y-3 pt-2 border-t border-gray-50">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Verification Decision</p>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Admin Notes (optional)</label>
                  <textarea value={actionMsg} onChange={(e) => setActionMsg(e.target.value)}
                    placeholder="Add notes about this review..."
                    rows={2}
                    className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rejection Reason</label>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explain why this business application is being rejected..."
                    rows={2}
                    className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all resize-none" />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button onClick={() => handleApprove(selected._id)} disabled={acting || !allDocsReviewed}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold rounded-xl hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all group">
                    {acting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={16} />}
                    <span className="text-left leading-tight">
                      Approve
                      {!allDocsReviewed && selected?.documents?.length > 0 && (
                        <span className="block text-[10px] font-medium opacity-75">Review all docs first</span>
                      )}
                    </span>
                  </button>
                  <button onClick={() => handleRequestInfo(selected._id)} disabled={acting || !actionMsg}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-bold rounded-xl hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <MessageSquare size={14} /> Request Info
                  </button>
                  <button onClick={() => handleReject(selected._id)} disabled={acting || !rejectReason}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white text-sm font-bold rounded-xl hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    {acting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={16} />}
                    <span className="text-left leading-tight">
                      Reject
                      {!rejectReason && <span className="block text-[10px] font-medium opacity-75">Add reason first</span>}
                    </span>
                  </button>
                </div>

                {!allDocsReviewed && selected?.documents?.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/50">
                    <AlertTriangle size={12} />
                    <span>Review and verify all documents before approving this business</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
