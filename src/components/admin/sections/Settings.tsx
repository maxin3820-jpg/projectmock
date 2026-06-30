"use client";
import { useState, useEffect, useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useAdminData } from "@/lib/hooks/useAdmin";

export default function Settings() {
  const { showToast, darkMode } = useAdminStore();
  const { getSettings, updateSetting } = useAdminData();

  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: "", logo_text: "", primary_color: "#1e3a5f",
    accent_color: "#f59e0b", maintenance_mode: "false",
    google_analytics_id: "", contact_email: "", custom_css: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getSettings();
    setSettings(prev => ({ ...prev, ...data }));
    setLoading(false);
  }, [getSettings]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const errors: string[] = [];
    await Promise.all(Object.entries(settings).map(async ([key, value]) => {
      const { error } = await updateSetting(key, value);
      if (error) errors.push(key);
    }));
    setSaving(false);
    if (errors.length) showToast(`Failed to save: ${errors.join(", ")}`, "error");
    else showToast("Settings saved successfully", "success");
  };

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const border = darkMode ? "#334155" : "#e2e8f0";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const sub = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0f172a" : "#f8fafc";

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 9, border: `1.5px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" as const };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${border}` }}>{title}</h3>
      {children}
    </div>
  );

  if (loading) return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: sub }}>Loading settings...</p>
    </div>
  );

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Section title="🏫 General">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Website Name</label>
              <input value={settings.site_name} onChange={e => setSettings(s => ({ ...s, site_name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Logo Text</label>
              <input value={settings.logo_text} onChange={e => setSettings(s => ({ ...s, logo_text: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Contact Email</label>
              <input value={settings.contact_email} onChange={e => setSettings(s => ({ ...s, contact_email: e.target.value }))} style={inputStyle} />
            </div>
          </div>
        </Section>

        <Section title="🎨 Theme & Colors">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {([["primary_color", "Primary Color"], ["accent_color", "Accent Color"]] as const).map(([key, label]) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="color" value={settings[key] || "#000000"} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    style={{ width: 44, height: 44, borderRadius: 8, border: `1.5px solid ${border}`, cursor: "pointer", padding: 2 }} />
                  <input value={settings[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                    style={{ ...inputStyle, flex: 1, width: "auto" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: settings.primary_color || "#1e3a5f", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: settings.accent_color || "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 13 }}>
              {(settings.logo_text || "NED").slice(0, 3)}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{settings.site_name || "Platform Name"}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Live Preview</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ background: settings.accent_color || "#f59e0b", color: "#fff", padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>Button</div>
            </div>
          </div>
        </Section>

        <Section title="⚙️ System">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, border: `1px solid ${border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: text }}>🔧 Maintenance Mode</div>
              <div style={{ fontSize: 12, color: sub, marginTop: 2 }}>Show maintenance page to all visitors</div>
            </div>
            <div onClick={() => setSettings(s => ({ ...s, maintenance_mode: s.maintenance_mode === "true" ? "false" : "true" }))}
              style={{ width: 44, height: 24, borderRadius: 999, background: settings.maintenance_mode === "true" ? "#2a5298" : "#e2e8f0", position: "relative", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 2, left: settings.maintenance_mode === "true" ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </Section>

        <Section title="📊 Integrations">
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Google Analytics ID</label>
            <input value={settings.google_analytics_id} onChange={e => setSettings(s => ({ ...s, google_analytics_id: e.target.value }))} placeholder="G-XXXXXXXXXX" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Custom CSS</label>
            <textarea value={settings.custom_css} onChange={e => setSettings(s => ({ ...s, custom_css: e.target.value }))} placeholder="/* Add custom CSS */" rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
          </div>
        </Section>

        <Section title="🔐 Security Status">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "RLS Enabled (Supabase)", ok: true },
              { label: "Env Variables Protected", ok: true },
              { label: "Admin Route Guard", ok: true },
              { label: "CSRF via Supabase Auth", ok: true },
              { label: "2FA (Future)", ok: false },
              { label: "IP Whitelisting (Future)", ok: false },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 10, border: `1px solid ${border}` }}>
                <span style={{ fontSize: 16 }}>{s.ok ? "🛡️" : "⚠️"}</span>
                <span style={{ fontSize: 13, color: text, fontWeight: 500, flex: 1 }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.ok ? "#16a34a" : "#94a3b8" }}>{s.ok ? "Active" : "Pending"}</span>
              </div>
            ))}
          </div>
        </Section>

        <button onClick={handleSave} disabled={saving} style={{
          width: "100%", padding: "14px", borderRadius: 12,
          background: saving ? "#94a3b8" : "linear-gradient(135deg,#1e3a5f,#2a5298)",
          border: "none", color: "#fff", fontWeight: 800, fontSize: 16,
          cursor: saving ? "not-allowed" : "pointer",
          boxShadow: "0 8px 24px rgba(30,58,95,0.3)"
        }}>
          {saving ? "Saving..." : "💾 Save All Settings"}
        </button>
      </div>
    </div>
  );
}
