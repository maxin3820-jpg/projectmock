"use client";
import { useAdminStore } from "@/store/adminStore";

export default function Toast() {
  const { toast, clearToast } = useAdminStore();
  if (!toast) return null;

  const colors = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", icon: "✓" },
    error: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626", icon: "✕" },
    info: { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb", icon: "i" },
  };
  const c = colors[toast.type];

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12,
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)", minWidth: 260, maxWidth: 360,
      animation: "slideUp 0.3s ease"
    }}>
      <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }}>
        {c.icon}
      </span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: c.text }}>{toast.message}</span>
      <button onClick={clearToast} style={{ background: "none", border: "none", cursor: "pointer", color: c.text, fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
