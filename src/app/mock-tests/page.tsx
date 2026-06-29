import Link from "next/link";
import { university } from "@/config/university";

interface TestCard {
  id: number;
  title: string;
  subject: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  locked: boolean;
  tag?: string;
}

const tests: TestCard[] = [
  {
    id: 1,
    title: "Free Mock Test",
    subject: "Mathematics & Physics",
    questions: 30,
    duration: "45 min",
    difficulty: "Medium",
    locked: false,
    tag: "Free",
  },
  {
    id: 2,
    title: "Premium Mock Test 1",
    subject: "Full Syllabus — Set A",
    questions: 100,
    duration: "2 hrs",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
  },
  {
    id: 3,
    title: "Premium Mock Test 2",
    subject: "Full Syllabus — Set B",
    questions: 100,
    duration: "2 hrs",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
  },
  {
    id: 4,
    title: "Premium Mock Test 3",
    subject: "Full Syllabus — Set C",
    questions: 100,
    duration: "2 hrs",
    difficulty: "Hard",
    locked: true,
    tag: "Premium",
  },
];

const difficultyColor: Record<TestCard["difficulty"], string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-700",
};

function LockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export default function MockTestsPage() {
  return (
    <div className="py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ backgroundColor: `${university.colors.primary}15`, color: university.colors.primary }}
          >
            {university.shortName} Entrance Preparation
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
            Mock Tests
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Practice with exam-style questions. Start free, then unlock all premium sets for complete preparation.
          </p>
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 group ${
                test.locked
                  ? "border-slate-200 hover:shadow-md"
                  : "border-slate-200 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Locked overlay */}
              {test.locked && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-3 rounded-2xl">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: university.colors.primary }}
                  >
                    <LockIcon />
                  </div>
                  <p className="text-slate-600 font-semibold text-sm">Premium Content</p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: university.colors.accent }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Unlock Premium
                  </Link>
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
                {/* Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                    style={
                      test.locked
                        ? { backgroundColor: `${university.colors.primary}12`, color: university.colors.primary }
                        : { backgroundColor: `${university.colors.accent}20`, color: "#92400e" }
                    }
                  >
                    {test.tag}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${difficultyColor[test.difficulty]}`}>
                    {test.difficulty}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-1">{test.title}</h2>
                <p className="text-slate-500 text-sm mb-5">{test.subject}</p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.questions} Questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {test.duration}
                  </span>
                </div>

                {/* Action */}
                {!test.locked ? (
                  <Link
                    href="#"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ backgroundColor: university.colors.primary }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Test
                  </Link>
                ) : (
                  <div className="w-full py-3 rounded-xl text-sm font-semibold text-slate-400 bg-slate-50 text-center cursor-not-allowed select-none">
                    Locked
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Want access to all 3 premium tests + future updates?
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:opacity-90 hover:scale-105 transition-all duration-200"
            style={{ backgroundColor: university.colors.accent }}
          >
            View Premium Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
