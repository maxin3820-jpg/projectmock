"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Users() {
  const { showToast, darkMode } = useAdminStore();
  const { getUsers, updateUser, deleteUser } = useAdminData();

  const [users, setUsers] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    const { data, count } = await getUsers(page, PER_PAGE, search, filter);
    setUsers((data ?? []) as Profile[]);
    setTotal(count ?? 0);
    setLoading(false);
  }, [getUsers, page, search, filter]);

  useEffect(() => { load(); }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(); }, 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";

  const statusColor = (s: string) => s === "active" ? { bg: "#dcfce7", text: "#16a34a" } : s === "suspended" ? { bg: "#fef3c7", text: "#92400e" } : { bg: "#fee2e2", text: "#dc2626" };
  const totalPages = Math.ceil(total / PER_PAGE);

  const handleUpdate = async (id: string, data: Partial<Profile>) => {
    const { error } = await updateUser(id, data);
    if (error) showToast(error.message, "error");
    else { showToast("User updated", "success"); load(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteUser(id);
    if (error) showToast(error.message, "error");
    else { showToast("User deleted", "error"); setConfirmDelete(null); load(); }
  };

  const exportCSV = () => {
    const csv = ["Name,Email,Plan,Status,Created"].concat(
      users.map(u => `${u.full_name ?? ""},${u.email},${u.plan},${u.status},${u.created_at}`)
    ).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "users.csv"; a.click();
    showToast("Exported", "success");
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search users..."
          style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }} />
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}
          style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none" }}>
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
          <option value="premium">Premium</option>
          <option value="free">Free</option>
        </select>
        <button onClick={exportCSV} style={{ padding: "9px 16px", borderRadius: 10, background: "#eff6ff", border: "none", color: "#2563eb", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                <th style={{ padding: "12px 16px" }}>
                  <input type="checkbox" checked={selected.length === users.length && users.length > 0}
                    onChange={e => setSelected(e.target.checked ? users.map(u => u.id) : [])} style={{ cursor: "pointer" }} />
                </th>
                {["Name", "Email", "Plan", "Status", "Role", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <div style={{ height: 14, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 4, width: j === 1 ? 120 : 80 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: sub }}>No users found</td></tr>
              ) : users.map((u, i) => {
                const sc = statusColor(u.status);
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${border}`, background: selected.includes(u.id) ? (darkMode ? "#1e40af22" : "#eff6ff") : "transparent" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <input type="checkbox" checked={selected.includes(u.id)}
                        onChange={e => setSelected(e.target.checked ? [...selected, u.id] : selected.filter(id => id !== u.id))} style={{ cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 47 % 360},60%,50%)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                          {(u.full_name ?? u.email).charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: text, whiteSpace: "nowrap" }}>{u.full_name ?? "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub, whiteSpace: "nowrap" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.plan === "premium" ? "#fef3c7" : "#f1f5f9", color: u.plan === "premium" ? "#92400e" : "#64748b" }}>{u.plan}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text }}>{u.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: sub }}>{u.role}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: sub, whiteSpace: "nowrap" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => setEditing(u)} style={{ padding: "5px 10px", borderRadius: 7, background: "#eff6ff", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleUpdate(u.id, { status: "suspended" })} style={{ padding: "5px 10px", borderRadius: 7, background: "#fef3c7", border: "none", color: "#92400e", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Suspend</button>
                        <button onClick={() => setConfirmDelete(u.id)} style={{ padding: "5px 10px", borderRadius: 7, background: "#fee2e2", border: "none", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <span style={{ fontSize: 13, color: sub }}>{total} users total</span>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${page === p ? "#2a5298" : border}`, background: page === p ? "#2a5298" : card, color: page === p ? "#fff" : text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 20 }}>Edit User</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(["full_name", "email", "phone"] as const).map(f => (
                <div key={f}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5, textTransform: "capitalize" }}>{f.replace("_", " ")}</label>
                  <input value={(editing[f] as string) ?? ""} onChange={e => setEditing({ ...editing, [f]: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Plan</label>
                  <select value={editing.plan} onChange={e => setEditing({ ...editing, plan: e.target.value as Profile["plan"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Status</label>
                  <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value as Profile["status"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 5 }}>Role</label>
                  <select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value as Profile["role"] })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                    <option value="student">Student</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={async () => { await handleUpdate(editing.id, editing); setEditing(null); }}
                style={{ flex: 1, padding: 11, borderRadius: 10, background: "#1e3a5f", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Save</button>
              <button onClick={() => setEditing(null)} style={{ padding: "11px 20px", borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: card, borderRadius: 20, padding: 28, width: "100%", maxWidth: 340, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: text, marginBottom: 8 }}>Delete User?</h3>
            <p style={{ fontSize: 13, color: sub, marginBottom: 20 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: 11, borderRadius: 10, background: "#dc2626", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: 11, borderRadius: 10, background: darkMode ? "#334155" : "#f1f5f9", border: "none", color: text, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
