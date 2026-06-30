"use client";
import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";
import { createClient } from "@/lib/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

const trafficData = [
  { day: "Mon", visits: 420 }, { day: "Tue", visits: 380 }, { day: "Wed", visits: 510 },
  { day: "Thu", visits: 470 }, { day: "Fri", visits: 620 }, { day: "Sat", visits: 390 }, { day: "Sun", visits: 280 },
];
const revenueData = [
  { month: "Jan", revenue: 12000 }, { month: "Feb", revenue: 18000 }, { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 }, { month: "May", revenue: 19000 }, { month: "Jun", revenue: 28000 },
];
const growthData = [
  { month: "Jan", users: 200 }, { month: "Feb", users: 450 }, { month: "Mar", users: 700 },
  { month: "Apr", users: 1100 }, { month: "May", users: 1600 }, { month: "Jun", users: 2200 },
];

export default function Dashboard() {
  const { darkMode } = useAdminStore();
  const { getDashboardStats } = useAdminData();
  const supabase = createClient();

  const [stats, setStats] = useState({ totalUsers: 0, totalTests: 0, totalQuestions: 0, totalRevenue: 0, totalAttempts: 0, premiumUsers: 0 });
  const [recentUsers, setRecentUsers] = useState<{ id: string; full_name: string | null; email: string; plan: string; university_id: string | null }[]>([]);
  const [recentPayments, setRecentPayments] = useState<{ id: string; profiles: { full_name: string | null } | null; final_amount: number; method: string | null; status: string }[]>([]);
  const [attemptsData, setAttemptsData] = useState<{ week: string; attempts: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [s, users, payments, attempts] = await Promise.all([
        getDashboardStats(),
        supabase.from("profiles").select("id,full_name,email,plan,university_id").order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("id,final_amount,method,status,profiles(full_name)").order("created_at", { ascending: false }).limit(5),
        supabase.from("test_attempts").select("created_at").eq("status", "completed").order("created_at", { ascending: false }).limit(200),
      ]);
      setStats(s);
      setRecentUsers((users.data ?? []) as typeof recentUsers);
      setRecentPayments((payments.data ?? []) as unknown as typeof recentPayments);

      // Group attempts by week
      const grouped: Record<string, number> = {};
      (attempts.data ?? []).forEach(a => {
        const w = `W${Math.ceil(new Date(a.created_at).getDate() / 7)}`;
        grouped[w] = (grouped[w] ?? 0) + 1;
      });
      setAttemptsData(Object.entries(grouped).map(([week, attempts]) => ({ week, attempts })).slice(0, 6));
      setLoading(false);
    }
    load();
  }, [getDashboardStats, supabase]);

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";

  const StatCard = ({ label, value, icon, color, change }: { label: string; value: string | number; icon: string; color: string; change?: string }) => (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: text, lineHeight: 1.2 }}>
          {loading ? <span style={{ background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 6, display: "inline-block", width: 60, height: 24 }} /> : value}
        </div>
        <div style={{ fontSize: 12, color: sub, marginTop: 3 }}>{label}</div>
        {change && <div style={{ fontSize: 11, color: "#16a34a", marginTop: 4, fontWeight: 600 }}>{change}</div>}
      </div>
    </div>
  );

  const chartProps = { style: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px" } };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="#2a5298" />
        <StatCard label="Premium Users" value={stats.premiumUsers} icon="⭐" color="#8b5cf6" change={stats.totalUsers ? `${Math.round(stats.premiumUsers / stats.totalUsers * 100)}% of total` : ""} />
        <StatCard label="Total Tests" value={stats.totalTests} icon="📝" color="#06b6d4" />
        <StatCard label="Questions" value={stats.totalQuestions} icon="❓" color="#ec4899" />
        <StatCard label="Total Attempts" value={stats.totalAttempts} icon="🎯" color="#f97316" />
        <StatCard label="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon="💰" color="#16a34a" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div {...chartProps}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Daily Traffic</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trafficData}>
              <defs><linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2a5298" stopOpacity={0.3}/><stop offset="95%" stopColor="#2a5298" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="#2a5298" fill="url(#cg1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div {...chartProps}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Test Attempts</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attemptsData.length ? attemptsData : [{ week: "W1", attempts: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="attempts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div {...chartProps}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Revenue (PKR)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div {...chartProps}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>User Growth</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData}>
              <defs><linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="url(#cg2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Recent Registrations</h3>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ height: 40, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 8 }} />)}
            </div>
          ) : recentUsers.length === 0 ? (
            <p style={{ color: sub, fontSize: 13, textAlign: "center", padding: 20 }}>No users yet</p>
          ) : recentUsers.map((u, i) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `hsl(${i * 60},60%,50%)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {(u.full_name ?? u.email).charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.full_name ?? u.email}</div>
                <div style={{ fontSize: 11, color: sub }}>{u.email}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, background: u.plan === "premium" ? "#fef3c7" : "#f1f5f9", color: u.plan === "premium" ? "#92400e" : "#64748b", fontWeight: 700, flexShrink: 0 }}>
                {u.plan}
              </span>
            </div>
          ))}
        </div>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Recent Payments</h3>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ height: 40, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 8 }} />)}
            </div>
          ) : recentPayments.length === 0 ? (
            <p style={{ color: sub, fontSize: 13, textAlign: "center", padding: 20 }}>No payments yet</p>
          ) : recentPayments.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: p.status === "success" ? "#dcfce7" : p.status === "failed" ? "#fee2e2" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {p.status === "success" ? "✓" : p.status === "failed" ? "✕" : "⏳"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.profiles?.full_name ?? "Unknown"}</div>
                <div style={{ fontSize: 11, color: sub }}>{p.method ?? "—"}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: p.status === "success" ? "#16a34a" : p.status === "failed" ? "#dc2626" : "#f59e0b", flexShrink: 0 }}>
                Rs. {p.final_amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
