import Link from "next/link";
import { university } from "@/config/university";

interface Test {
  id: number;
  title: string;
  subject: string;
  setLabel: string;
  questions: number;
  duration: string;
  difficulty: "Hard";
  topics: string[];
}

const tests: Test[] = [
  { id: 1, title: "Premium Mock Test 1", subject: "Full Syllabus — Set A", setLabel: "Set A", questions: 100, duration: "2 hours", difficulty: "Hard", topics: ["Math", "Physics", "Chemistry", "English"] },
  { id: 2, title: "Premium Mock Test 2", subject: "Full Syllabus — Set B", setLabel: "Set B", questions: 100, duration: "2 hours", difficulty: "Hard", topics: ["Math", "Physics", "Chemistry", "English"] },
  { id: 3, title: "Premium Mock Test 3", subject: "Full Syllabus — Set C", setLabel: "Set C", questions: 100, duration: "2 hours", difficulty: "Hard", topics: ["Math", "Physics", "Chemistry", "English"] },
];

export default function MockTestsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`, padding: "clamp(40px,6vw,72px) 24px clamp(48px,7vw,80px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{ display: "inline-block", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 999, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
            {university.shortName} Entrance Prep
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Premium Mock Tests
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#93c5fd", maxWidth: 500, margin: "0 auto" }}>
            Full-syllabus mock tests designed to mirror the real {university.shortName} entrance exam. Unlock all 3 with one payment.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(32px,5vw,60px) 16px clamp(48px,6vw,80px)" }}>

        {/* Premium cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 48 }}>
          {tests.map((test) => (
            <div key={test.id} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "relative" }}>
              {/* Top accent */}
              <div style={{ height: 3, background: "linear-gradient(90deg,#16a34a,#22c55e)" }} />
              <div style={{ padding: "24px 24px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Premium
                  </span>
                  <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    Hard
                  </span>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{test.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>{test.subject}</p>
                <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>❓</span> {test.questions} Questions
                  </span>
                  <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>⏱</span> {test.duration}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {test.topics.map(t => (
                    <span key={t} style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
                {/* Lock overlay CTA */}
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", textAlign: "center", border: "1px dashed #e2e8f0" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <svg width="18" height="18" fill="none" stroke="#fff" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 10 }}>Premium Content</p>
                  <Link href="/pricing" className="btn-primary" style={{ padding: "9px 20px", fontSize: 14, display: "inline-flex" }}>
                    ✦ Unlock Premium
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: "clamp(24px,4vw,40px)", marginBottom: 40, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 20, textAlign: "center" }}>What&apos;s included in Premium?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { icon: "📝", text: "100 questions per test" },
              { icon: "📊", text: "Subject-wise analytics" },
              { icon: "💡", text: "Detailed explanations" },
              { icon: "🔄", text: "Unlimited attempts" },
              { icon: "📄", text: "PDF result reports" },
              { icon: "🎯", text: "Full syllabus coverage" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <span style={{ fontSize: 14, color: "#334155", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: 20, padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
          <p style={{ fontWeight: 800, fontSize: "clamp(16px,2.5vw,20px)", color: "#0f172a", marginBottom: 6 }}>
            Get all 3 premium tests for just Rs. 999
          </p>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            One-time payment · Unlimited attempts · Full syllabus coverage
          </p>
          <Link href="/pricing" className="btn-primary" style={{ fontSize: 15, padding: "12px 32px" }}>
            View Premium Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
