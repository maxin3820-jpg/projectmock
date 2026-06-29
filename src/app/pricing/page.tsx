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
  {
    q: "How long does my access last?",
    a: "Your premium access is valid for the entire admission season — typically 6 months from the date of purchase.",
  },
  {
    q: "Are the questions similar to the real exam?",
    a: "Yes. Our questions are modeled after previous years' patterns and reviewed by subject-matter experts.",
  },
  {
    q: "Can I attempt the tests multiple times?",
    a: "Absolutely. You can re-attempt any test as many times as you'd like to track your progress.",
  },
  {
    q: "Is the free test really free?",
    a: "Yes — no credit card required. Just sign up and start the free mock test immediately.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ backgroundColor: `${university.colors.primary}15`, color: university.colors.primary }}
          >
            Simple Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
            One Plan. Everything Included.
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            No hidden fees, no subscriptions. Pay once and get full access to all premium mock tests.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(145deg, ${university.colors.primary}, ${university.colors.primaryLight})` }}
          >
            {/* Popular Badge */}
            <div className="absolute top-5 right-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ backgroundColor: university.colors.accent, color: "#fff" }}
              >
                Best Value
              </span>
            </div>

            {/* Header */}
            <div className="p-8 pb-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Premium Plan</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black">Rs. 999</span>
                <span className="text-lg opacity-70 mb-1">/ one-time</span>
              </div>
              <p className="text-sm opacity-70">
                Full access for the {new Date().getFullYear()} admission season
              </p>
            </div>

            {/* Features */}
            <div className="bg-white mx-4 mb-4 rounded-2xl p-6">
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${university.colors.primary}15` }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: university.colors.primary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-6 py-3.5 rounded-xl font-bold text-white text-base shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                style={{ backgroundColor: university.colors.accent }}
                type="button"
              >
                Buy Now — Rs. 999
              </button>

              <p className="text-xs text-slate-400 text-center mt-3">
                Secure payment · Instant access · No subscription
              </p>
            </div>

            {/* Free tier note */}
            <div className="px-8 pb-6 text-center text-white/70 text-sm">
              Not ready to pay?{" "}
              <Link href="/mock-tests" className="underline underline-offset-2 text-white font-medium hover:opacity-80">
                Try the free test first →
              </Link>
            </div>
          </div>
        </div>

        {/* Compare Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Free vs Premium</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-slate-600 font-medium">Feature</th>
                  <th className="text-center p-4 text-slate-600 font-medium">Free</th>
                  <th
                    className="text-center p-4 font-bold"
                    style={{ color: university.colors.primary }}
                  >
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["Mock Tests", "1", "4"],
                  ["Questions per Test", "30", "100"],
                  ["Answer Explanations", "❌", "✅"],
                  ["Performance Analytics", "❌", "✅"],
                  ["Unlimited Attempts", "✅", "✅"],
                  ["PDF Reports", "❌", "✅"],
                  ["Priority Support", "❌", "✅"],
                ].map(([feature, free, premium]) => (
                  <tr key={feature} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-700 font-medium">{feature}</td>
                    <td className="p-4 text-center text-slate-500">{free}</td>
                    <td className="p-4 text-center font-semibold" style={{ color: university.colors.primaryLight }}>
                      {premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
