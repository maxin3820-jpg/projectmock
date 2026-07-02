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
  const { sidebarOpen, setSidebarOpen, activeSection, setActiveSection, darkMode } = useAdminStore();
  const router = useRouter();

  const bg       = darkMode ? "#0f172a" : "#1e3a5f";
  const activeBg = darkMode ? "#1e293b" : "#2a5298";
  const borderC  = darkMode ? "#1e293b" : "#1a3356";

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  const handleNav = (id: string) => {
    setActiveSection(id);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay — closes sidebar when tapped */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{ display: "block" }}
        />
      )}

      <aside
        className={`admin-sidebar${sidebarOpen ? " open" : ""}`}
        style={{
          width: 220,
          background: bg,
          borderRight: `1px solid ${borderC}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${borderC}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
              NED
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>Admin Panel</div>
              <div style={{ color: "#93c5fd", fontSize: 10 }}>NED University</div>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#93c5fd", padding: 4, display: "none" }}
            className="sidebar-close-btn"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 6px" }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => handleNav(s.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 10, padding: "9px 10px",
                borderRadius: 9, border: "none", cursor: "pointer",
                background: activeSection === s.id ? activeBg : "transparent",
                color: activeSection === s.id ? "#fff" : "#93c5fd",
                fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500,
                marginBottom: 2, transition: "background 0.15s", textAlign: "left", whiteSpace: "nowrap",
              }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 6px", borderTop: `1px solid ${borderC}` }}>
          <button onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10, padding: "9px 10px",
              borderRadius: 9, border: "none", cursor: "pointer",
              background: "transparent", color: "#f87171",
              fontSize: 13, fontWeight: 600, textAlign: "left",
            }}>
            <span style={{ fontSize: 17 }}>⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            left: -240px;
            top: 0;
            z-index: 200;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
            transition: left 0.25s ease;
          }
          .admin-sidebar.open {
            left: 0 !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
