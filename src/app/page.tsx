import Link from "next/link";
import { university } from "@/config/university";

const stats = [
  { value: "10,000+", label: "Students Enrolled" },
  { value: "500+", label: "Practice Questions" },
  { value: "95%", label: "Pass Rate" },
  { value: "4.9★", label: "Average Rating" },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real Exam Format",
    description: "Questions modeled after actual entrance exam patterns with accurate difficulty levels.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Timed Practice",
    description: "Experience real exam conditions with countdown timers on every mock test.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Detailed Analytics",
    description: "Track your performance with subject-wise breakdowns and improvement suggestions.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        className="relative overflow-hidden py-20 sm:py-28 px-4"
        style={{
          background: `linear-gradient(135deg, ${university.colors.primary} 0%, ${university.colors.primaryLight} 60%, #1e40af 100%)`,
        }}
      >
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ backgroundColor: university.colors.accent }}
          />
          <div
            className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10"
            style={{ backgroundColor: university.colors.accentLight }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* University Logo Badge */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl border-2 border-white/20"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
            >
              {university.logoText}
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-5 border border-white/20"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: university.colors.accentLight }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: university.colors.accentLight }} />
            Official Mock Test Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {university.name}
            <span className="block text-3xl sm:text-4xl lg:text-5xl font-bold mt-1" style={{ color: university.colors.accentLight }}>
              Mock Test Platform
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {university.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mock-tests"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-white shadow-lg hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: university.colors.accent }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Free Mock Test
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-white border-2 border-white/40 hover:bg-white/10 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Unlock Premium
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black" style={{ color: university.colors.primary }}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              Why choose our platform?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Everything you need to prepare with confidence and perform at your best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4"
                  style={{ backgroundColor: university.colors.primary }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
            }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: university.colors.accent, transform: "translate(30%, -30%)" }} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black mb-3">Ready to ace your exam?</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students who have already unlocked their potential with our premium mock tests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/mock-tests"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold bg-white hover:bg-slate-100 transition-colors duration-200"
                  style={{ color: university.colors.primary }}
                >
                  Try Free Test
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold border-2 border-white/40 hover:bg-white/10 transition-colors duration-200"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
