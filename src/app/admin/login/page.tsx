import { Suspense } from "react";
import AdminLoginClient from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f2444,#1e3a5f,#2a5298)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#93c5fd", fontSize: 14, fontWeight: 600 }}>Loading...</div>
      </div>
    }>
      <AdminLoginClient />
    </Suspense>
  );
}
