"use client";

import { usePathname } from "next/navigation";

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/sanchalan")) return null;
  return <>{children}</>;
}
