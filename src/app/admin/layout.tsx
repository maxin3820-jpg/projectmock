import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — NED Mock Test Platform",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
