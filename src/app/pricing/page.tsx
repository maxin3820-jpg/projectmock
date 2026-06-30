import Link from "next/link";
import { university } from "@/config/university";

const features = [
  "Access to all 3 Premium Mock Tests",
  "100 questions per test (Full Syllabus)",
  "Detailed answer explanations",
  "Subject-wise performance analytics",
  "Unlimited test attempts",
  "Download result reports (PDF)",
  "Priority email support",
  "Access to future test updates",
];

const faqs = [
  { q: "How long does my access last?", a: "Your premium access is valid for the entire admission season — typically 6 months from purchase." },
  { q: "Are the questions similar to the real exam?", a: "Yes. Our questions are modeled after previous years' patterns and reviewed by subject-matter experts." },
  { q: "Can I attempt the tests multiple times?", a: "Absolutely. Re-attempt any test as many times as you'd like to track your improvement." },
  { q: "Is the free test really free?", a: "Yes — no credit card required. Just sign up and start immediately." },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
        padding: "56px 24px 64px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{
            display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#fbbf24",
            border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999,
            padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: 20
          }}>Simple Pricing</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            One Plan. Everything Included.
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd" }}>
            No hidden fees, no subscriptions. Pay once, get full access to all premium mock tests.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Pricing + Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32, marginBottom: 64 }}>

          {/* Price Card */}
          <div style={{
            background: `linear-gradient(160deg, ${university.colors.primary} 0%, ${university.colors.primaryLight} 100%)`,
            borderRadius: 24, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(30,58,95,0.3)"
          }}>
            {/* Top */}
            <div style={{ padding: "36px 36px 28px", position: "relative" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(245,158,11,0.12)" }} />
              <div style={{
                display: "inline-block", background: university.colors.accent,
                color: "#fff", padding: "4px 14px", borderRadius: 999,
                fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20
              }}>Best Value</div>
              <div style={{ fontSize: 13, color: "#93c5fd", fontWeight: 600, marginBottom: 8 }}>Premium Plan</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 1 }}>Rs. 999</span>
              </div>
              <div style={{ fontSize: 14, color: "#93c5fd" }}>One-time · Full access · No renewal</div>
            </div>

            {/* Features list */}
            <div style={{ background: "#fff", margin: "0 16px 16px", borderRadius: 16, padding: "24px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: `${university.colors.primary}15`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1
                    }}>
                      <svg width="11" height="11" fill="none" stroke={university.colors.primary} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 24, fontSize: 16, padding: "14px", justifyContent: "center", border: "none" }}
                type="button"
              >
                Buy Now — Rs. 999
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
                🔒 Secure payment · Instant access · No subscription
              </p>
            </div>

            <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
              <Link href="/mock-tests" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>
                Not ready? <span style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>Try the free test first →</span>
              </Link>
            </div>
          </div>

          {/* Right column: Compare + FAQ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Comparison table */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Free vs Premium</h3>
              </div>
              <table className="compare-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Feature</th>
                    <th style={{ textAlign: "center" }}>Free</th>
                    <th style={{ textAlign: "center", color: university.colors.primary }}>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Mock Tests", "1", "4"],
                    ["Questions / Test", "30", "100"],
                    ["Answer Explanations", "❌", "✅"],
                    ["Analytics Dashboard", "❌", "✅"],
                    ["Unlimited Attempts", "✅", "✅"],
                    ["PDF Reports", "❌", "✅"],
                    ["Priority Support", "❌", "✅"],
                  ].map(([f, fr, pr]) => (
                    <tr key={f}>
                      <td style={{ fontWeight: 500, color: "#334155" }}>{f}</td>
                      <td style={{ textAlign: "center", color: "#94a3b8" }}>{fr}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: university.colors.primaryLight }}>{pr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FAQ */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>FAQ</h3>
              </div>
              <div style={{ padding: "8px 0" }}>
                {faqs.map((faq, i) => (
                  <div key={faq.q} style={{ padding: "16px 24px", borderBottom: i < faqs.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <p style={{ fontWeight: 700, color: "#1e293b", fontSize: 14, marginBottom: 6 }}>{faq.q}</p>
                    <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
          {[
            { icon: "🔒", label: "Secure Payment" },
            { icon: "⚡", label: "Instant Access" },
            { icon: "🔄", label: "No Subscription" },
            { icon: "💬", label: "Priority Support" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 14, fontWeight: 600 }}>
              <span style={{ fontSize: 20 }}>{b.icon}</span> {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
