import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Sanchalan, Content Management",
  robots: { index: false, follow: false },
};

export default function SanchalanPage() {
  return <AdminApp />;
}
