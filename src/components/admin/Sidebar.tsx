"use client";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { signOut } from "@/lib/supabase/auth";

const sections = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "users",     icon: "👥", label: "Users" },
  { id: "tests",     icon: "📝", label: "Mock Tests" },
  { id: "questions", icon: "❓", label: "Question Bank" },
  { id: "results",   icon: "📊", label: "Results" },
  { id: "payments",  icon: "💳", label: "Payments" },
  { id: "announcements", icon: "📢", label: "Announcements" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "settings",  icon: "⚙️", label: "Settings" },
];

export default function Sidebar() {
  const { sidebarOpen, activeSection, setActiveSection, darkMode } = useAdminStore();
  const router = useRouter();

  const bg       = darkMode ? "#0f172a" : "#1e3a5f";
  const activeBg = darkMode ? "#1e293b" : "#2a5298";
  const borderC  = darkMode ? "#1e293b" : "#1a3356";

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <aside style={{
      width: sidebarOpen ? 220 : 60,
      background: bg,
      borderRight: `1px solid ${borderC}`,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.22s ease",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: sidebarOpen ? "18px 16px 14px" : "18px 10px 14px", borderBottom: `1px solid ${borderC}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
          NED
        </div>
        {sidebarOpen && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>Admin Panel</div>
            <div style={{ color: "#93c5fd", fontSize: 10 }}>NED University</div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 6px" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            title={!sidebarOpen ? s.label : undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10, padding: sidebarOpen ? "9px 10px" : "9px 13px",
              borderRadius: 9, border: "none", cursor: "pointer",
              background: activeSection === s.id ? activeBg : "transparent",
              color: activeSection === s.id ? "#fff" : "#93c5fd",
              fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500,
              marginBottom: 2, transition: "background 0.15s", textAlign: "left", whiteSpace: "nowrap",
            }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{s.icon}</span>
            {sidebarOpen && <span>{s.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "10px 6px", borderTop: `1px solid ${borderC}` }}>
        <button onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: 10, padding: sidebarOpen ? "9px 10px" : "9px 13px",
            borderRadius: 9, border: "none", cursor: "pointer",
            background: "transparent", color: "#f87171",
            fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", textAlign: "left",
          }}>
          <span style={{ fontSize: 17 }}>⏻</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
