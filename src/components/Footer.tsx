import Link from "next/link";
import { university } from "@/config/university";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})` }}
              >
                {university.logoText}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{university.name}</p>
                <p className="text-xs text-slate-500">Mock Test Platform</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Helping students ace their entrance exams with expert-crafted mock tests.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Mock Tests", href: "/mock-tests" },
                { label: "Pricing", href: "/pricing" },
                { label: "Login", href: "/login" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${university.contactEmail}`} className="hover:text-white transition-colors">
                  {university.contactEmail}
                </a>
              </li>
              <li>
                <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {university.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} {university.name} Mock Test Platform. All rights reserved.</p>
          <p>Built for students, by educators.</p>
        </div>
      </div>
    </footer>
  );
}
