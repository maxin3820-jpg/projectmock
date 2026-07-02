import Link from "next/link";
import { university } from "@/config/university";
import BuyButton from "./BuyButton";

// Design tokens
const blue = {
  900: "#0c1e3e",
  800: "#1e3a5f",
  700: "#1d4ed8",
  600: "#2563eb",
  500: "#3b82f6",
  100: "#dbeafe",
  50:  "#eff6ff",
};
const green = {
  600: "#16a34a",
  500: "#22c55e",
  400: "#4ade80",
  100: "#dcfce7",
  50:  "#f0fdf4",
};

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

const compareRows = [
  { feature: "Mock Tests",           free: "1",     premium: "4",    freeIsCheck: false, premiumIsCheck: false },
  { feature: "Questions / Test",     free: "30",    premium: "100",  freeIsCheck: false, premiumIsCheck: false },
  { feature: "Answer Explanations",  free: false,   premium: true,   freeIsCheck: true,  premiumIsCheck: true  },
  { feature: "Analytics Dashboard",  free: false,   premium: true,   freeIsCheck: true,  premiumIsCheck: true  },
  { feature: "Unlimited Attempts",   free: true,    premium: true,   freeIsCheck: true,  premiumIsCheck: true  },
  { feature: "PDF Reports",          free: false,   premium: true,   freeIsCheck: true,  premiumIsCheck: true  },
  { feature: "Priority Support",     free: false,   premium: true,   freeIsCheck: true,  premiumIsCheck: true  },
];

function GreenCheck() {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:24, height:24, borderRadius:"50%", background: green[100] }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke={green[600]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
function GrayX() {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:24, height:24, borderRadius:"50%", background:"#f1f5f9" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

export default function PricingPage() {
  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#f8fafc" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position:"relative", overflow:"hidden", padding:"88px 24px 96px", textAlign:"center",
        background:"linear-gradient(160deg,#f0f7ff 0%,#e8f4fd 50%,#f0fdf4 100%)" }}>

        {/* Geometric grid overlay */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(30,58,95,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,58,95,0.04) 1px,transparent 1px)",
          backgroundSize:"40px 40px" }} />
        {/* Glow blobs */}
        <div style={{ position:"absolute", top:-80, left:"10%", width:420, height:420, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, right:"8%", width:320, height:320, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(34,197,94,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:640, margin:"0 auto" }}>
          {/* Pill badge */}
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 18px",
            borderRadius:999, fontSize:12, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase",
            background: green[50], color: green[600], border:`1.5px solid ${green[100]}`, marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background: green[500], display:"inline-block" }} />
            Simple Pricing
          </span>

          {/* Gradient headline */}
          <h1 style={{ fontSize:"clamp(32px,5.5vw,56px)", fontWeight:900, lineHeight:1.1, marginBottom:16,
            background:`linear-gradient(135deg, ${blue[800]} 0%, ${blue[600]} 45%, ${green[600]} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            One Plan.<br />Everything Included.
          </h1>
          <p style={{ fontSize:18, color:"#475569", lineHeight:1.7, maxWidth:480, margin:"0 auto" }}>
            No hidden fees, no subscriptions. Pay once — get full access to all premium mock tests instantly.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1140, margin:"0 auto", padding:"72px 24px 96px" }}>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:36, alignItems:"start" }}>

          {/* ── PRICING CARD ───────────────────────────────────────────── */}
          <div style={{ position:"sticky", top:90 }}>
            <div style={{
              background:"#fff", borderRadius:28,
              boxShadow:"0 4px 6px rgba(0,0,0,0.04), 0 10px 40px rgba(30,58,95,0.10), 0 40px 80px rgba(30,58,95,0.06)",
              border:`1.5px solid ${green[100]}`, overflow:"hidden", position:"relative"
            }}>
              {/* Green top accent bar */}
              <div style={{ height:4, background:`linear-gradient(90deg,${green[500]},${green[400]})` }} />

              <div style={{ padding:"32px 32px 28px" }}>
                {/* Best Value badge */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                  <span style={{ padding:"5px 14px", borderRadius:999, fontSize:11, fontWeight:800,
                    textTransform:"uppercase", letterSpacing:"0.08em",
                    background: green[100], color: green[600], border:`1px solid ${green[100]}` }}>
                    ✦ Best Value
                  </span>
                  <span style={{ fontSize:12, color:"#94a3b8", fontWeight:500 }}>One-time payment</span>
                </div>

                <p style={{ fontSize:13, fontWeight:600, color:"#64748b", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  Premium Plan
                </p>

                {/* Price */}
                <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:4 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#64748b", marginBottom:10 }}>Rs.</span>
                  <span style={{ fontSize:64, fontWeight:900, lineHeight:1, color: blue[800] }}>999</span>
                </div>
                <p style={{ fontSize:13, color:"#94a3b8", marginBottom:28 }}>
                  Full access · 6-month admission season
                </p>

                {/* Features */}
                <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                      <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
                        width:22, height:22, borderRadius:"50%", background: green[100], flexShrink:0, marginTop:1 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke={green[600]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span style={{ fontSize:14, color:"#334155", fontWeight:500, lineHeight:1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <BuyButton />

                <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", marginTop:12 }}>
                  🔒 Secured &amp; Encrypted · No recurring charges
                </p>
              </div>

              {/* Free test nudge */}
              <div style={{ borderTop:"1px solid #f1f5f9", padding:"16px 32px", background:"#fafafa" }}>
                <Link href="/mock-tests" style={{ textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  <span style={{ fontSize:13, color:"#64748b" }}>Not ready?</span>
                  <span style={{ fontSize:13, fontWeight:700, color: blue[600] }}>Try the free test first →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

            {/* COMPARISON TABLE */}
            <div style={{ background:"#fff", borderRadius:24,
              boxShadow:"0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
              border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ padding:"22px 28px 18px" }}>
                <h3 style={{ fontSize:17, fontWeight:800, color: blue[900], margin:0 }}>Free vs Premium</h3>
                <p style={{ fontSize:13, color:"#94a3b8", marginTop:4 }}>See what you get with each plan</p>
              </div>

              {/* Table header */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 110px",
                padding:"10px 28px", background:"#f8fafc", borderTop:"1px solid #f1f5f9", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em" }}>Feature</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.05em", textAlign:"center" }}>Free</span>
                <span style={{ fontSize:11, fontWeight:700, color: green[600], textTransform:"uppercase", letterSpacing:"0.05em", textAlign:"center" }}>Premium</span>
              </div>

              {/* Rows */}
              {compareRows.map((row, i) => (
                <div key={row.feature} style={{
                  display:"grid", gridTemplateColumns:"1fr 100px 110px",
                  padding:"13px 28px", alignItems:"center",
                  borderBottom: i < compareRows.length - 1 ? "1px solid #f8fafc" : "none",
                  background: i % 2 === 0 ? "#fff" : "#fafeff",
                }}>
                  <span style={{ fontSize:14, fontWeight:500, color:"#334155" }}>{row.feature}</span>

                  {/* Free cell */}
                  <span style={{ textAlign:"center", display:"flex", justifyContent:"center" }}>
                    {typeof row.free === "boolean"
                      ? row.free ? <GreenCheck /> : <GrayX />
                      : <span style={{ fontSize:14, fontWeight:600, color:"#64748b" }}>{row.free}</span>}
                  </span>

                  {/* Premium cell */}
                  <span style={{ textAlign:"center", display:"flex", justifyContent:"center",
                    background: green[50], borderRadius:8, padding:"4px 0", margin:"0 8px" }}>
                    {typeof row.premium === "boolean"
                      ? row.premium ? <GreenCheck /> : <GrayX />
                      : <span style={{ fontSize:14, fontWeight:800, color: green[600] }}>{row.premium}</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div style={{ background:"#fff", borderRadius:24,
              boxShadow:"0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
              border:"1px solid #e2e8f0", overflow:"hidden" }}>
              <div style={{ padding:"22px 28px 18px", borderBottom:"1px solid #f1f5f9" }}>
                <h3 style={{ fontSize:17, fontWeight:800, color: blue[900], margin:0 }}>Frequently Asked</h3>
              </div>
              {faqs.map((faq, i) => (
                <div key={faq.q} style={{
                  padding:"18px 28px",
                  borderBottom: i < faqs.length - 1 ? "1px solid #f8fafc" : "none"
                }}>
                  <p style={{ fontWeight:700, color: blue[900], fontSize:14, marginBottom:6 }}>{faq.q}</p>
                  <p style={{ color:"#64748b", fontSize:13, lineHeight:1.75, margin:0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
        <div style={{ marginTop:72, padding:"36px 40px", background:"#fff",
          borderRadius:24, border:"1px solid #e2e8f0",
          boxShadow:"0 2px 4px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)" }}>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:40 }}>
            {[
              { icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke={blue[600]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke={green[600]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ), label:"Secure Payment", desc:"256-bit encryption" },
              { icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={blue[600]} strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke={green[600]} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ), label:"Instant Access", desc:"Unlock in seconds" },
              { icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke={blue[600]} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="19" cy="12" r="2" fill={green[500]} stroke={green[500]}/>
                </svg>
              ), label:"No Subscription", desc:"Pay once, yours forever" },
              { icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={blue[600]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10h8M8 14h5" stroke={green[600]} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ), label:"Priority Support", desc:"Response within 24h" },
            ].map(b => (
              <div key={b.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:46, height:46, borderRadius:14,
                  background:`linear-gradient(135deg,${blue[50]},${green[50]})`,
                  border:`1px solid ${blue[100]}`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {b.icon}
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color: blue[900], margin:0 }}>{b.label}</p>
                  <p style={{ fontSize:12, color:"#94a3b8", margin:0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
        <div style={{ marginTop:64, textAlign:"center" }}>
          <p style={{ fontSize:15, color:"#64748b", marginBottom:16 }}>
            Still have questions? We&apos;re here to help.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/mock-tests" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"12px 28px",
              borderRadius:12, fontSize:15, fontWeight:700, textDecoration:"none",
              color: blue[700], background: blue[50], border:`1.5px solid ${blue[100]}`,
            }}>
              Try Free Test First
            </Link>
            <Link href="/login" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"12px 28px",
              borderRadius:12, fontSize:15, fontWeight:700, textDecoration:"none",
              color:"#fff", background:`linear-gradient(135deg,${green[600]},${green[500]})`,
              boxShadow:`0 4px 14px rgba(22,163,74,0.3)`,
            }}>
              Get Started Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
