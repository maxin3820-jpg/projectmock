import Link from "next/link";
import { university } from "@/config/university";

export default function Footer() {
  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", marginTop: "auto" }}>
      <style>{`
        .footer-link { color: #94a3b8; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .footer-link:hover { color: #fff; }
        .footer-ext { color: #94a3b8; text-decoration: none; font-size: 14px; }
        .footer-ext:hover { color: #fff; }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${university.colors.primary}, ${university.colors.primaryLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 14
              }}>
                {university.logoText}
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{university.name}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>Mock Test Platform</div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>
              Helping students ace their entrance exams with expert-crafted mock tests.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Quick Links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Home", href: "/" },
                { label: "Mock Tests", href: "/mock-tests" },
                { label: "Pricing", href: "/pricing" },
                { label: "Login", href: "/login" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Contact
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`mailto:${university.contactEmail}`} className="footer-ext">
                {university.contactEmail}
              </a>
              <a href={university.website} target="_blank" rel="noopener noreferrer" className="footer-ext">
                {university.website}
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #1e293b", marginTop: 40, paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} {university.name} Mock Test Platform. All rights reserved.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ fontSize: 12 }}>Built for students, by educators.</p>
            <Link href="/admin/login" style={{ fontSize: 11, color: "#334155", textDecoration: "none", padding: "4px 10px", border: "1px solid #1e293b", borderRadius: 6, transition: "color 0.2s" }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
