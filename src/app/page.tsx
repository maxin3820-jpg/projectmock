import Link from "next/link";
import { university } from "@/config/university";

const stats = [
  { value: "10,000+", label: "Students Enrolled" },
  { value: "500+", label: "Practice Questions" },
  { value: "95%", label: "Pass Rate" },
  { value: "4.9 ★", label: "Average Rating" },
];

const features = [
  { emoji: "📝", title: "Real Exam Format", desc: "Questions modeled after actual entrance exam patterns with accurate difficulty levels." },
  { emoji: "⏱️", title: "Timed Practice", desc: "Experience real exam conditions with countdown timers on every mock test." },
  { emoji: "📊", title: "Detailed Analytics", desc: "Track your performance with subject-wise breakdowns and improvement suggestions." },
  { emoji: "🔒", title: "Secure & Private", desc: "Your test results and personal data are kept completely private and secure." },
  { emoji: "📱", title: "Mobile Friendly", desc: "Practice anywhere, anytime — fully optimized for phones and tablets." },
  { emoji: "🏆", title: "Expert Content", desc: "All questions reviewed by subject-matter experts with detailed explanations." },
];

export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section className="hero-gradient" style={{ padding: "80px 24px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: -60, width: 420, height: 420, borderRadius: "50%", background: "rgba(34,197,94,0.07)", pointerEvents: "none", transform: "translateY(-30%)" }} />
        <div style={{ position: "absolute", bottom: -150, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(42,82,152,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* University badge */}
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "8px 20px", marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", fontWeight: 900, fontSize: 11 }}>
              {university.logoText}
            </div>
            <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
              {university.name} Official Platform
            </span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
          </div>

          <h1 className="fade-up fade-up-1" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
            Crack Your <span className="gradient-text">{university.shortName}</span>
            <br />Entrance Exam
          </h1>

          <p className="fade-up fade-up-2" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
            {university.description}
          </p>

          {/* CTA — only premium, no free test */}
          <div className="fade-up fade-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              ✦ Unlock Premium Access
            </Link>
            <Link href="/mock-tests" className="btn-outline" style={{ fontSize: 16, padding: "14px 32px" }}>
              View Mock Tests
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {["#f97316", "#06b6d4", "#8b5cf6", "#ec4899", "#10b981"].map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid #0f2444", marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              ))}
            </div>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              <strong style={{ color: "#e2e8f0" }}>2,000+ students</strong> joined this week
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, textAlign: "center" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 36, fontWeight: 900, color: university.colors.primary, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="badge" style={{ background: `${university.colors.primary}12`, color: university.colors.primary, marginBottom: 14, display: "inline-block" }}>Why Choose Us</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>Everything you need to succeed</h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>Practice smarter with tools designed around how students actually learn.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: "28px 28px 24px" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${university.colors.primary}15, ${university.colors.primaryLight}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16 }}>{f.emoji}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM TESTS PREVIEW ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="badge" style={{ background: "#dcfce7", color: "#16a34a", marginBottom: 14, display: "inline-block" }}>Premium Tests</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.2, marginBottom: 16 }}>Unlock full exam preparation</h2>
            <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
              Get all 3 premium mock tests with full syllabus, detailed explanations, and performance analytics — for one affordable payment.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
            {["Premium Mock Test 1", "Premium Mock Test 2", "Premium Mock Test 3"].map((name, i) => (
              <div key={name} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Premium</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Full Syllabus — Set {String.fromCharCode(65 + i)}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6 }}>100 questions</span>
                  <span style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6 }}>2 hours</span>
                  <span style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6 }}>Hard</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: 16, padding: "14px 40px" }}>
              Get All 3 Tests — Rs. 999 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${university.colors.primary} 0%, ${university.colors.primaryLight} 100%)`,
            borderRadius: 28, padding: "clamp(32px, 6vw, 60px) clamp(20px, 5vw, 40px)", textAlign: "center",
            position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,58,95,0.3)"
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(34,197,94,0.12)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
                Ready to ace your exam?
              </h2>
              <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#93c5fd", maxWidth: 480, margin: "0 auto 32px" }}>
                Join thousands of students who have already secured their spot at {university.name}.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/pricing" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Unlock Premium Access
                </Link>
                <Link href="/pricing" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                  color: "#fff", border: "2px solid rgba(255,255,255,0.4)",
                  background: "transparent", textDecoration: "none"
                }}>
                  View Pricing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
