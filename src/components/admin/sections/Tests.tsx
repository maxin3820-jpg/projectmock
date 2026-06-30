"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";
import type { Database } from "@/lib/supabase/types";

type MockTest = Database["public"]["Tables"]["mock_tests"]["Row"];

const blank: Database["public"]["Tables"]["mock_tests"]["Insert"] = {
  title: "", subject_id: null, description: null, university_id: null,
  status: "draft", is_premium: false, duration_minutes: 60,
  total_questions: 50, passing_marks: 50, negative_marking: false,
  negative_marks_per_wrong: 0.25, randomize_questions: true, shuffle_options: true,
  max_attempts: 0, instructions: null, scheduled_at: null, published_at: null, created_by: null,
};

export default function Tests() {
  const { showToast, darkMode } = useAdminStore();
  const { getTests, createTest, updateTest, deleteTest } = useAdminData();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Partial<Database["public"]["Tables"]["mock_tests"]["Insert"]> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getTests();
    setTests((data ?? []) as MockTest[]);
    setLoading(false);
  }, [getTests]);

  useEffect(() => { load(); }, [load]);

  const filtered = tests.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";

  const statusColor = (s: string) => s === "published" ? { bg: "#dcfce7", text: "#16a34a" } : s === "draft" ? { bg: "#f1f5f9", text: "#64748b" } : { bg: "#fef3c7", text: "#92400e" };

  const handleSave = async () => {
    if (!modal) return;
    if (editId) {
      const { error } = await updateTest(editId, modal);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Test updated", "success");
    } else {
      const { error } = await createTest(modal as Database["public"]["Tables"]["mock_tests"]["Insert"]);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Test created", "success");
    }
    setModal(null); setEditId(null); load();
  };

  const handleToggleStatus = async (t: MockTest) => {
    const newStatus = t.status === "published" ? "draft" : "published";
    const { error } = await updateTest(t.id, { status: newStatus, published_at: newStatus === "published" ? new Date().toISOString() : null });
    if (error) showToast(error.message, "error");
    else { showToast(newStatus === "published" ? "Published" : "Unpublished", "info"); load(); }
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search tests..."
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }} />
        <button onClick={() => { setModal({ ...blank }); setEditId(null); }}
          style={{ padding: "9px 18px", borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Add Test
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 200, background: card, borderRadius: 16, border: `1px solid ${border}` }} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {filtered.map(t => {
            const sc = statusColor(t.status);
            return (
              <div key={t.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text }}>{t.status}</span>
                    {t.is_premium && <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>Premium</span>}
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button onClick={() => { setModal({ ...t }); setEditId(t.id); }}
                      style={{ padding: "4px 10px", borderRadius: 7, background: "#fef3c7", border: "none", color: "#92400e", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    <button onClick={() => setConfirmDelete(t.id)}
                      style={{ padding: "4px 10px", borderRadius: 7, background: "#fee2e2", border: "none", color: "#dc2626", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Del</button>
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: text, marginBottom: 4 }}>{t.title}</h3>
                <p style={{ fontSize: 13, color: sub, marginBottom: 12 }}>{t.description ?? "No description"}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {[`❓ ${t.total_questions} Qs`, `⏱ ${t.duration_minutes}min`, `✅ ${t.passing_marks}% pass`].map(m => (
                    <span key={m} style={{ fontSize: 11, color: sub, background: darkMode ? "#0f172a" : "#f8fafc", padding: "3px 9px", borderRadius: 6, border: `1px solid ${border}` }}>{m}</span>
                  ))}
                </div>
                <button onClick={() => handleToggleStatus(t)}
                  style={{ width: "100%", padding: "8px", borderRadius: 9, background: t.status === "published" ? "#fee2e2" : "#dcfce7", border: "none", color: t.status === "published" ? "#dc2626" : "#16a34a", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {t.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 20 }}>{editId ? "Edit Test" : "Add New Test"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(["title", "description"] as const).map(f => (
                <div key={f}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5, textTransform: "capitalize" }}>{f}</label>
                  {f === "description" ? (
                    <textarea value={(modal as Record<string, string>)[f] ?? ""} onChange={e => setModal({ ...modal, [f]: e.target.value })} rows={2}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                  ) : (
                    <input value={(modal as Record<string, string>)[f] ?? ""} onChange={e => setModal({ ...modal, [f]: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  )}
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {([["total_questions", "Questions"], ["duration_minutes", "Duration (min)"], ["passing_marks", "Pass Mark %"]] as const).map(([f, l]) => (
                  <div key={f}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>{l}</label>
                    <input type="number" value={(modal as Record<string, number>)[f] ?? 0} onChange={e => setModal({ ...modal, [f]: +e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Status</label>
                  <select value={modal.status ?? "draft"} onChange={e => setModal({ ...modal, status: e.target.value as MockTest["status"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {([["negative_marking", "Negative Marking"], ["randomize_questions", "Randomize Questions"], ["is_premium", "Premium Only"]] as const).map(([f, l]) => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: text }}>
                    <input type="checkbox" checked={(modal as Record<string, boolean>)[f] ?? false} onChange={e => setModal({ ...modal, [f]: e.target.checked })} style={{ width: 16, height: 16 }} />
                    {l}
                  </label>
                ))}
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Instructions</label>
                <textarea value={modal.instructions ?? ""} onChange={e => setModal({ ...modal, instructions: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {editId ? "Save Changes" : "Create Test"}
              </button>
              <button onClick={() => { setModal(null); setEditId(null); }} style={{ padding: "11px 20px", borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 340, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: text, marginBottom: 8 }}>Delete Test?</h3>
            <p style={{ fontSize: 13, color: sub, marginBottom: 20 }}>All associated questions will also be removed.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={async () => { const { error } = await deleteTest(confirmDelete); if (error) showToast(error.message, "error"); else { showToast("Deleted", "error"); setConfirmDelete(null); load(); } }}
                style={{ flex: 1, padding: 11, borderRadius: 10, background: "#dc2626", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
