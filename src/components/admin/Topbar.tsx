"use client";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth";
import { signOut } from "@/lib/supabase/auth";

export default function Topbar({ title }: { title: string }) {
  const { sidebarOpen, setSidebarOpen, darkMode, toggleDarkMode } = useAdminStore();
  const { profile } = useSupabaseAuth();
  const router = useRouter();

  const bg = darkMode ? "#0f172a" : "#fff";
  const border = darkMode ? "#1e293b" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#64748b" : "#94a3b8";

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <header style={{ background: bg, borderBottom: `1px solid ${border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: sub, padding: 4, borderRadius: 6, display: "flex" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: text, margin: 0 }}>{title}</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={toggleDarkMode} style={{ background: darkMode ? "#1e293b" : "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, color: text, fontWeight: 600 }}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1e3a5f,#2a5298)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
            {(profile?.full_name ?? profile?.email ?? "A").charAt(0).toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: text, lineHeight: 1.2 }}>{profile?.full_name ?? "Admin"}</span>
            <span style={{ fontSize: 10, color: sub, textTransform: "capitalize" }}>{profile?.role ?? "admin"}</span>
          </div>
        </div>

        <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 8, background: "#fee2e2", border: "none", color: "#dc2626", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
