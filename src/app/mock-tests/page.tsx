import Link from "next/link";
import { university } from "@/config/university";

interface Test {
  id: number;
  title: string;
  subject: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  locked: boolean;
  tag: string;
  topics: string[];
}

const tests: Test[] = [
  {
    id: 1,
    title: "Free Mock Test",
    subject: "Mathematics & Physics",
    questions: 30,
    duration: "45 min",
    difficulty: "Medium",
    locked: false,
    tag: "Free",
    topics: ["Algebra", "Calculus", "Mechanics"],
  },
  {
    id: 2,
    title: "Premium Mock Test 1",
    subject: "Full Syllabus — Set A",
    questions: 100,
    duration: "2 hours",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
    topics: ["Math", "Physics", "Chemistry", "English"],
  },
  {
    id: 3,
    title: "Premium Mock Test 2",
    subject: "Full Syllabus — Set B",
    questions: 100,
    duration: "2 hours",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
    topics: ["Math", "Physics", "Chemistry", "English"],
  },
  {
    id: 4,
    title: "Premium Mock Test 3",
    subject: "Full Syllabus — Set C",
    questions: 100,
    duration: "2 hours",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
    topics: ["Math", "Physics", "Chemistry", "English"],
  },
];

const diffBg: Record<Test["difficulty"], string> = {
  Easy: "#dcfce7",
  Medium: "#fef3c7",
  Hard: "#fee2e2",
};
const diffColor: Record<Test["difficulty"], string> = {
  Easy: "#15803d",
  Medium: "#b45309",
  Hard: "#b91c1c",
};

export default function MockTestsPage() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`, padding: "56px 24px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{
            display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#fbbf24",
            border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999,
            padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: 20
          }}>
            {university.shortName} Entrance Prep
          </span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Mock Tests
          </h1>
          <p style={{ fontSize: 17, color: "#93c5fd", maxWidth: 500, margin: "0 auto" }}>
            Practice with exam-style questions. Start free, then unlock all premium sets for complete preparation.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Free test — full width hero card */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            background: `linear-gradient(135deg, ${university.colors.primary} 0%, ${university.colors.primaryLight} 60%, #2563eb 100%)`,
            borderRadius: 24, padding: "36px 40px",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: 24, alignItems: "center",
            boxShadow: "0 12px 40px rgba(30,58,95,0.25)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", right: -40, top: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)", pointerEvents: "none"
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  background: university.colors.accent, color: "#fff",
                  padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.06em"
                }}>Free</span>
                <span style={{ background: diffBg.Medium, color: diffColor.Medium, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  Medium
                </span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
                Free Mock Test
              </h2>
              <p style={{ color: "#93c5fd", fontSize: 15, marginBottom: 16 }}>Mathematics & Physics</p>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {[
                  { icon: "❓", label: "30 Questions" },
                  { icon: "⏱", label: "45 Minutes" },
                  { icon: "📚", label: "Algebra, Calculus, Mechanics" },
                ].map(item => (
                  <span key={item.label} style={{ color: "#bfdbfe", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{item.icon}</span> {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Link href="#" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px", whiteSpace: "nowrap" }}>
                Start Test →
              </Link>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "32px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
            🔒 Premium Tests — Unlock All 3
          </span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        {/* Premium cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {tests.filter(t => t.locked).map((test) => (
            <div key={test.id} className="card" style={{ position: "relative" }}>
              <div className="lock-overlay">
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(30,58,95,0.25)"
                }}>
                  <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>Premium Content</p>
                  <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>Unlock to access this test</p>
                </div>
                <Link href="/pricing" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>
                  ✦ Unlock Premium
                </Link>
              </div>

              {/* Blurred card content */}
              <div style={{ padding: "24px 24px 20px", filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ background: `${university.colors.primary}12`, color: university.colors.primary, padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                    {test.tag}
                  </span>
                  <span style={{ background: diffBg[test.difficulty], color: diffColor[test.difficulty], padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    {test.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>{test.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{test.subject}</p>
                <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>❓ {test.questions} Questions</span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>⏱ {test.duration}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {test.topics.map(t => (
                    <span key={t} style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ height: 44, background: "#f1f5f9", borderRadius: 10 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48, padding: "32px 36px",
          background: `linear-gradient(135deg, ${university.colors.accent}15, ${university.colors.accent}08)`,
          border: `1.5px solid ${university.colors.accent}30`,
          borderRadius: 20, textAlign: "center"
        }}>
          <p style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", marginBottom: 6 }}>
            Get all 3 premium tests for just Rs. 999
          </p>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            One-time payment · Unlimited attempts · Full syllabus coverage
          </p>
          <Link href="/pricing" className="btn-primary" style={{ fontSize: 15 }}>
            View Premium Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
