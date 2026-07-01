"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    if (params.get("error") === "unauthorized") {
      setError("Access denied. Admin privileges required.");
    }
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles").select("role").eq("id", session.user.id).single();
        if (profile?.role === "admin" || profile?.role === "super_admin") {
          router.replace("/admin");
        }
      }
    });
  }, [params, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", data.user.id).single();
      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        await supabase.auth.signOut();
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f2444 0%,#1e3a5f 50%,#2a5298 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 24, overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2a5298)", padding: "32px 36px 28px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>
              NED
            </div>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>Admin Panel</h1>
            <p style={{ color: "#93c5fd", fontSize: 13, marginTop: 4 }}>NED University Mock Test Platform</p>
          </div>
          <div style={{ padding: "32px 36px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                    style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                  ⚠ {error}
                </div>
              )}
              <button type="submit" disabled={loading} style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#1e3a5f,#2a5298)", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
                ) : "Sign In to Admin Panel →"}
              </button>
            </form>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12, color: "#16a34a" }}>
              <strong>Note:</strong> Create an admin user in Supabase Auth and set their role to <code>admin</code> in the profiles table.
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
