import Link from "next/link";
import { university } from "@/config/university";

const stats = [
  { value: "10,000+", label: "Students Enrolled" },
  { value: "500+", label: "Practice Questions" },
  { value: "95%", label: "Pass Rate" },
  { value: "4.9 ★", label: "Average Rating" },
];

const features = [
  {
    emoji: "📝",
    title: "Real Exam Format",
    desc: "Questions modeled after actual entrance exam patterns with accurate difficulty levels.",
  },
  {
    emoji: "⏱️",
    title: "Timed Practice",
    desc: "Experience real exam conditions with countdown timers on every mock test.",
  },
  {
    emoji: "📊",
    title: "Detailed Analytics",
    desc: "Track your performance with subject-wise breakdowns and improvement suggestions.",
  },
  {
    emoji: "🔒",
    title: "Secure & Private",
    desc: "Your test results and personal data are kept completely private and secure.",
  },
  {
    emoji: "📱",
    title: "Mobile Friendly",
    desc: "Practice anywhere, anytime — fully optimized for phones and tablets.",
  },
  {
    emoji: "🏆",
    title: "Expert Content",
    desc: "All questions reviewed by subject-matter experts with detailed explanations.",
  },
];

export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section className="hero-gradient" style={{ padding: "80px 24px 100px", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 500, height: 500, borderRadius: "50%",
          background: "rgba(245,158,11,0.07)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: -150, left: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(42,82,152,0.15)", pointerEvents: "none"
        }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>

          {/* University badge */}
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999, padding: "8px 20px", marginBottom: 32
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fbbf24", fontWeight: 900, fontSize: 11
            }}>
              {university.logoText}
            </div>
            <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em" }}>
              {university.name} Official Platform
            </span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
          </div>

          {/* Heading */}
          <h1 className="fade-up fade-up-1" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
            Crack Your{" "}
            <span className="gradient-text">{university.shortName}</span>
            <br />Entrance Exam
          </h1>

          <p className="fade-up fade-up-2" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#94a3b8", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
            {university.description}
          </p>

          {/* CTA Buttons */}
          <div className="fade-up fade-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link href="/mock-tests" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Free Mock Test
            </Link>
            <Link href="/pricing" className="btn-outline" style={{ fontSize: 16, padding: "14px 32px" }}>
              ✦ Unlock Premium
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>
              {["#f97316", "#06b6d4", "#8b5cf6", "#ec4899", "#10b981"].map((c, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: c, border: "2px solid #0f2444",
                  marginLeft: i === 0 ? 0 : -8, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700
                }}>
                  {String.fromCharCode(65 + i)}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 36, fontWeight: 900, color: university.colors.primary, lineHeight: 1 }}>
                  {s.value}
                </div>
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
            <span className="badge" style={{ background: `${university.colors.primary}12`, color: university.colors.primary, marginBottom: 14, display: "inline-block" }}>
              Why Choose Us
            </span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>
              Everything you need to succeed
            </h2>
            <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
              Practice smarter with tools designed around how students actually learn.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {features.map((f, i) => (
              <div key={f.title} className="card" style={{ padding: "28px 28px 24px" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `linear-gradient(135deg, ${university.colors.primary}15, ${university.colors.primaryLight}20)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 16
                }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTS PREVIEW ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <span className="badge" style={{ background: `${university.colors.accent}20`, color: "#92400e", marginBottom: 14, display: "inline-block" }}>
                Mock Tests
              </span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.2, marginBottom: 16 }}>
                Start free, upgrade when ready
              </h2>
              <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8, marginBottom: 28 }}>
                Get started with our free mock test — no signup required. When you&apos;re ready for the full experience, unlock all premium tests with one affordable payment.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {["1 free mock test — start immediately", "3 premium tests with full syllabus", "Detailed answer explanations", "Performance analytics dashboard"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                      background: `${university.colors.primary}15`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <svg width="12" height="12" fill="none" stroke={university.colors.primary} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/mock-tests" className="btn-dark">View All Tests →</Link>
                <Link href="/pricing" className="btn-primary">See Pricing</Link>
              </div>
            </div>

            {/* Test cards preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Free card */}
              <div style={{
                background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
                borderRadius: 16, padding: "20px 24px", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 8px 30px rgba(30,58,95,0.25)"
              }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Free</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Free Mock Test</div>
                  <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>30 questions · 45 min</div>
                </div>
                <div style={{
                  background: university.colors.accent,
                  padding: "8px 16px", borderRadius: 8,
                  fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap"
                }}>
                  Start →
                </div>
              </div>

              {/* Premium cards */}
              {["Premium Mock Test 1", "Premium Mock Test 2", "Premium Mock Test 3"].map((name, i) => (
                <div key={name} style={{
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  borderRadius: 16, padding: "18px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  opacity: 0.85
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Premium</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{name}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>100 questions · 2 hrs</div>
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${university.colors.primary} 0%, ${university.colors.primaryLight} 100%)`,
            borderRadius: 28, padding: "60px 40px", textAlign: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 20px 60px rgba(30,58,95,0.3)"
          }}>
            <div style={{
              position: "absolute", top: -60, right: -60, width: 240, height: 240,
              borderRadius: "50%", background: "rgba(245,158,11,0.12)", pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", bottom: -80, left: -40, width: 300, height: 300,
              borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none"
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
                Ready to ace your exam?
              </h2>
              <p style={{ fontSize: 17, color: "#93c5fd", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
                Join thousands of students who have already secured their spot at {university.name}.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/mock-tests" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Start Free Test
                </Link>
                <Link href="/pricing" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                  color: "#fff", border: "2px solid rgba(255,255,255,0.4)",
                  background: "transparent", textDecoration: "none", transition: "all 0.2s"
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
