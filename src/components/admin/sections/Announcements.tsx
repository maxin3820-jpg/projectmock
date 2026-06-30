"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";
import type { Database } from "@/lib/supabase/types";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
type AnnInsert = Database["public"]["Tables"]["announcements"]["Insert"];

const blank: Partial<AnnInsert> = { title: "", message: "", type: "banner", target: "all", is_active: true };

export default function Announcements() {
  const { showToast, darkMode } = useAdminStore();
  const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdminData();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<AnnInsert> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getAnnouncements();
    setItems((data ?? []) as Announcement[]);
    setLoading(false);
  }, [getAnnouncements]);

  useEffect(() => { load(); }, [load]);

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";

  const typeColor = (t: string) => t === "banner" ? { bg: "#eff6ff", text: "#2563eb" } : t === "popup" ? { bg: "#fef3c7", text: "#92400e" } : { bg: "#f0fdf4", text: "#16a34a" };
  const typeIcon = (t: string) => t === "banner" ? "📣" : t === "popup" ? "💬" : "🔔";

  const handleSave = async () => {
    if (!modal) return;
    if (editId) {
      const { error } = await updateAnnouncement(editId, modal);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Updated", "success");
    } else {
      const { error } = await createAnnouncement(modal as AnnInsert);
      if (error) { showToast(error.message, "error"); return; }
      showToast("Announcement created", "success");
    }
    setModal(null); setEditId(null); load();
  };

  const handleToggle = async (a: Announcement) => {
    const { error } = await updateAnnouncement(a.id, { is_active: !a.is_active });
    if (error) showToast(error.message, "error");
    else { showToast(a.is_active ? "Deactivated" : "Activated", "info"); load(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteAnnouncement(id);
    if (error) showToast(error.message, "error");
    else { showToast("Deleted", "error"); load(); }
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button onClick={() => { setModal({ ...blank }); setEditId(null); }}
          style={{ padding: "9px 18px", borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + New Announcement
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ height: 160, background: card, borderRadius: 16, border: `1px solid ${border}` }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", color: sub }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📢</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No announcements yet</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Create your first announcement to notify users.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {items.map(a => {
            const tc = typeColor(a.type);
            return (
              <div key={a.id} style={{ background: card, border: `1.5px solid ${a.is_active ? "#2a5298" : border}`, borderRadius: 16, padding: 20, opacity: a.is_active ? 1 : 0.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.text }}>
                      {typeIcon(a.type)} {a.type}
                    </span>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: sub }}>{a.target}</span>
                  </div>
                  {/* Toggle */}
                  <div onClick={() => handleToggle(a)}
                    style={{ width: 36, height: 20, borderRadius: 999, background: a.is_active ? "#2a5298" : "#e2e8f0", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                    <div style={{ position: "absolute", top: 2, left: a.is_active ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 6 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: sub, lineHeight: 1.6, marginBottom: 14 }}>{a.message}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setModal({ title: a.title, message: a.message, type: a.type, target: a.target, is_active: a.is_active }); setEditId(a.id); }}
                    style={{ flex: 1, padding: "8px", borderRadius: 9, background: "#eff6ff", border: "none", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(a.id)}
                    style={{ flex: 1, padding: "8px", borderRadius: 9, background: "#fee2e2", border: "none", color: "#dc2626", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 480 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 20 }}>{editId ? "Edit Announcement" : "New Announcement"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Title</label>
                <input value={modal.title ?? ""} onChange={e => setModal({ ...modal, title: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Message</label>
                <textarea value={modal.message ?? ""} onChange={e => setModal({ ...modal, message: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Type</label>
                  <select value={modal.type ?? "banner"} onChange={e => setModal({ ...modal, type: e.target.value as Announcement["type"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="banner">Banner</option>
                    <option value="popup">Popup</option>
                    <option value="notification">Notification</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Target</label>
                  <select value={modal.target ?? "all"} onChange={e => setModal({ ...modal, target: e.target.value as Announcement["target"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="all">All Users</option>
                    <option value="premium">Premium</option>
                    <option value="free">Free</option>
                  </select>
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={modal.is_active ?? true} onChange={e => setModal({ ...modal, is_active: e.target.checked })} style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>Active (visible to users)</span>
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                {editId ? "Save" : "Create"}
              </button>
              <button onClick={() => { setModal(null); setEditId(null); }} style={{ padding: "11px 20px", borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
