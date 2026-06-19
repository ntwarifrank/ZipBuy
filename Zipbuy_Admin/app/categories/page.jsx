"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import { Sparkles, Plus, X, Check, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleAdd() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    try {
      await api.post("/api/categories", { name: trimmed });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category");
    }
  }

  async function handleEdit(id) {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    try {
      await api.put(`/api/categories/${id}`, { name: trimmed });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update category");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[#0D0D0D]">Categories</h2>
          <p className="text-sm text-gray-400">{categories.length} categories</p>
        </div>

        {/* Add new */}
        <div className="flex items-center gap-2">
          <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New category name..."
            className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-[#0D0D0D] placeholder:text-gray-300 outline-none focus:border-[#FFC831] focus:ring-2 focus:ring-[#FFC831]/10 transition-all"
          />
          <button onClick={handleAdd} disabled={!newCategory.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FFC831] text-[#0D0D0D] text-xs font-bold rounded-xl hover:bg-[#FFD454] disabled:opacity-40 transition-all shadow-sm">
            <Plus size={13} /> Add
          </button>
        </div>

        {/* Category grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white rounded-xl border border-gray-100 px-3.5 py-2.5 flex items-center justify-between group hover:shadow-sm transition-shadow">
                {editing === cat._id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEdit(cat._id)}
                      className="flex-1 bg-gray-50 rounded-lg px-2 py-1 text-xs text-[#0D0D0D] outline-none border border-gray-100"
                      autoFocus
                    />
                    <button onClick={() => handleEdit(cat._id)} className="p-1 rounded hover:bg-gray-100"><Check size={12} className="text-green-600" /></button>
                    <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-gray-100"><X size={12} className="text-gray-400" /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles size={11} className="text-[#FFC831] shrink-0" />
                      <span className="text-xs font-medium text-[#0D0D0D] truncate">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing(cat._id); setEditValue(cat.name); }}
                        className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(cat._id)}
                        className="p-1 rounded hover:bg-red-50 transition-colors">
                        <X size={10} className="text-red-400" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
