"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { university } from "@/config/university";

export default function SignupPage() {
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Redirect to login after 2 seconds
    setTimeout(() => router.push("/login"), 2500);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", background: "#f8fafc" }}>

      {/* Left branding panel */}
      <div className="hero-gradient login-panel" style={{ width: "45%", padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(34,197,94,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontWeight: 900, fontSize: 20, marginBottom: 32 }}>
            {university.logoText}
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Join {university.name}
          </h2>
          <p style={{ color: "#93c5fd", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Create your free account and start preparing for your entrance exam today.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "🚀", text: "Get started in 30 seconds" },
              { icon: "📝", text: "Access premium mock tests" },
              { icon: "📊", text: "Track your progress" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  {item.icon}
                </div>
                <span style={{ color: "#bfdbfe", fontSize: 14, fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {success ? (
            /* Success state */
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>Account Created!</h2>
              <p style={{ color: "#64748b", fontSize: 15, marginBottom: 6 }}>
                Check your email to verify your account.
              </p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>Create account</h1>
                <p style={{ color: "#64748b", fontSize: 15 }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: university.colors.primaryLight, fontWeight: 700, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your full name" className="form-input" autoComplete="name" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" className="form-input" autoComplete="email" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <input type={showPw ? "text" : "password"} required value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                      className="form-input" style={{ paddingRight: 44 }} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, fontSize: 12, fontWeight: 600 }}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <input type={showPw ? "text" : "password"} required value={confirm}
                      onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                      className="form-input" autoComplete="new-password" />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                    ⚠ {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#16a34a", border: "none", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
                  {loading ? (
                    <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/><path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating account...</>
                  ) : "Create Free Account →"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20 }}>
                By signing up, you agree to our{" "}
                <Link href="#" style={{ color: "#64748b", textDecoration: "underline" }}>Terms</Link>
                {" & "}
                <Link href="#" style={{ color: "#64748b", textDecoration: "underline" }}>Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .login-panel { display: none !important; } }
      `}</style>
    </div>
  );
}
