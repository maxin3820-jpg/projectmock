"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
import { useSupabaseAuth } from "@/lib/hooks/useSupabaseAuth";
import { useAdminStore } from "@/store/adminStore";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import Toast from "@/components/admin/Toast";
import Dashboard from "@/components/admin/sections/Dashboard";
import Users from "@/components/admin/sections/Users";
import Tests from "@/components/admin/sections/Tests";
import Questions from "@/components/admin/sections/Questions";
import Results from "@/components/admin/sections/Results";
import Payments from "@/components/admin/sections/Payments";
import Announcements from "@/components/admin/sections/Announcements";
import Analytics from "@/components/admin/sections/Analytics";
import Settings from "@/components/admin/sections/Settings";

const sectionTitles: Record<string, string> = {
  dashboard: "Dashboard",
  users: "User Management",
  tests: "Mock Tests",
  questions: "Question Bank",
  results: "Results & Leaderboard",
  payments: "Payment Management",
  announcements: "Announcements",
  analytics: "Analytics",
  settings: "Website Settings",
};

const sectionMap: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  users: <Users />,
  tests: <Tests />,
  questions: <Questions />,
  results: <Results />,
  payments: <Payments />,
  announcements: <Announcements />,
  analytics: <Analytics />,
  settings: <Settings />,
};

export default function AdminPage() {
  const { user, profile, loading } = useSupabaseAuth();
  const { activeSection, darkMode } = useAdminStore();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Do NOT redirect while still loading — wait for full auth + profile data
    if (loading) return;
    // Only redirect once to prevent loops
    if (hasRedirected.current) return;

    const isAdmin = ["admin", "super_admin"].includes(profile?.role ?? "");

    if (!user || !isAdmin) {
      hasRedirected.current = true;
      router.replace("/admin/login");
    }
  }, [loading, user, profile, router]);

  // Show spinner while loading — never render redirect logic yet
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
        <div style={{ textAlign: "center", color: "#93c5fd" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite", margin: "0 auto 12px", display: "block" }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(147,197,253,0.3)" strokeWidth="4"/>
            <path fill="#93c5fd" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Loading Admin Panel...</p>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Not admin — render nothing (redirect is in flight)
  if (!user || !["admin", "super_admin"].includes(profile?.role ?? "")) {
    return null;
  }

  const bg = darkMode ? "#0f172a" : "#f8fafc";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: bg, position: "relative" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar title={sectionTitles[activeSection] ?? "Admin Panel"} />
        <div style={{ flex: 1, overflow: "auto", background: bg }}>
          {sectionMap[activeSection] ?? <Dashboard />}
        </div>
      </div>
      <Toast />
    </div>
  );
}
