"use client";
import { useAdminStore } from "@/store/adminStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Results() {
  const { users, tests, darkMode } = useAdminStore();

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";

  const topPerformers = [...users].sort((a, b) => b.avgScore - a.avgScore).slice(0, 10);

  const scoreDistribution = [
    { range: "90-100", count: users.filter(u => u.avgScore >= 90).length },
    { range: "80-89", count: users.filter(u => u.avgScore >= 80 && u.avgScore < 90).length },
    { range: "70-79", count: users.filter(u => u.avgScore >= 70 && u.avgScore < 80).length },
    { range: "60-69", count: users.filter(u => u.avgScore >= 60 && u.avgScore < 70).length },
    { range: "Below 60", count: users.filter(u => u.avgScore < 60).length },
  ];

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Score distribution */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#2a5298" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Test stats */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Test Performance</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tests.map(t => (
              <div key={t.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{t.title}</span>
                  <span style={{ fontSize: 12, color: sub }}>{t.attempts} attempts</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: darkMode ? "#334155" : "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (t.attempts / 900) * 100)}%`, background: "linear-gradient(90deg,#1e3a5f,#2a5298)", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, margin: 0 }}>🏆 Top Performers</h3>
          <button onClick={() => {
            const csv = ["Rank,Name,University,Tests,Avg Score"].concat(topPerformers.map((u, i) => `${i + 1},${u.name},${u.university},${u.totalTests},${u.avgScore}%`)).join("\n");
            const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "leaderboard.csv"; a.click();
          }} style={{ padding: "6px 14px", borderRadius: 8, background: "#eff6ff", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Export
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Rank", "Name", "University", "Tests", "Avg Score", "Plan"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: sub, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${border}`, background: i < 3 ? (darkMode ? "#1e3a5f22" : "#eff6ff") : "transparent" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 16 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#2a5298", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: sub }}>{u.university}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: text }}>{u.totalTests}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: u.avgScore >= 80 ? "#16a34a" : u.avgScore >= 60 ? "#f59e0b" : "#dc2626" }}>{u.avgScore}%</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: u.plan === "premium" ? "#fef3c7" : "#f1f5f9", color: u.plan === "premium" ? "#92400e" : "#64748b" }}>{u.plan}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
