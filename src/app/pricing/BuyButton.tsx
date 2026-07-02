"use client";

export default function BuyButton() {
  return (
    <button
      type="button"
      style={{
        width: "100%",
        padding: "15px 24px",
        borderRadius: 14,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 800,
        color: "#fff",
        background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
        boxShadow: "0 4px 14px rgba(37,99,235,0.35), 0 2px 4px rgba(37,99,235,0.2)",
        transition: "all 0.2s ease",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(-2px)";
        btn.style.boxShadow = "0 8px 24px rgba(37,99,235,0.45), 0 2px 4px rgba(37,99,235,0.2)";
        btn.style.background = "linear-gradient(135deg, #1e40af, #1d4ed8)";
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = "0 4px 14px rgba(37,99,235,0.35), 0 2px 4px rgba(37,99,235,0.2)";
        btn.style.background = "linear-gradient(135deg, #1d4ed8, #2563eb)";
      }}
    >
      Buy Now — Rs. 999
    </button>
  );
}
