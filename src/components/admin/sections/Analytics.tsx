"use client";
import { useAdminStore } from "@/store/adminStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const deviceData = [
  { name: "Mobile", value: 58 },
  { name: "Desktop", value: 32 },
  { name: "Tablet", value: 10 },
];
const COLORS = ["#2a5298", "#f59e0b", "#16a34a"];

const monthlyVisits = [
  { month: "Jan", visits: 1200 }, { month: "Feb", visits: 1900 }, { month: "Mar", visits: 2400 },
  { month: "Apr", visits: 2100 }, { month: "May", visits: 3200 }, { month: "Jun", visits: 2800 },
];

const trafficSources = [
  { source: "Direct", pct: 38 }, { source: "Google", pct: 32 }, { source: "Social Media", pct: 18 },
  { source: "Referral", pct: 8 }, { source: "Other", pct: 4 },
];

export default function Analytics() {
  const { users, tests, darkMode } = useAdminStore();
  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";

  const mostAttempted = [...tests].sort((a, b) => b.attempts - a.attempts).slice(0, 5);

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Monthly traffic */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Monthly Traffic</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyVisits}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2a5298" stopOpacity={0.3}/><stop offset="95%" stopColor="#2a5298" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: sub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="visits" stroke="#2a5298" fill="url(#ag)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device breakdown */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Device Usage</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {deviceData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: sub, flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: text }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Traffic sources */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Traffic Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trafficSources.map(s => (
              <div key={s.source}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{s.source}</span>
                  <span style={{ fontSize: 12, color: sub }}>{s.pct}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: darkMode ? "#334155" : "#f1f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: "linear-gradient(90deg,#1e3a5f,#2a5298)", borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most attempted tests */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Most Attempted Tests</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mostAttempted.map((t, i) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 16 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</p>
                  <p style={{ fontSize: 11, color: sub, margin: 0 }}>{t.subject}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2a5298", flexShrink: 0 }}>{t.attempts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User location */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>User Locations</h3>
          {[
            { city: "Karachi", pct: 42 }, { city: "Lahore", pct: 28 }, { city: "Islamabad", pct: 16 },
            { city: "Hyderabad", pct: 9 }, { city: "Other", pct: 5 },
          ].map(l => (
            <div key={l.city} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>📍 {l.city}</span>
                <span style={{ fontSize: 12, color: sub }}>{l.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: darkMode ? "#334155" : "#f1f5f9", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${l.pct}%`, background: "#f59e0b", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>Key Metrics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Avg Session Time", value: "12m 34s", icon: "⏱" },
              { label: "Bounce Rate", value: "24%", icon: "↩" },
              { label: "Avg Completion", value: "78%", icon: "✅" },
              { label: "Return Rate", value: "61%", icon: "🔄" },
              { label: "Page Views/Visit", value: "4.2", icon: "📄" },
              { label: "New vs Return", value: "39/61", icon: "👥" },
            ].map(m => (
              <div key={m.label} style={{ background: darkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${border}`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: text }}>{m.value}</div>
                <div style={{ fontSize: 11, color: sub }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
