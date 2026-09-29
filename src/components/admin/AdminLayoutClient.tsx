"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page — full screen, no sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f1724]">{children}</div>;
  }

  // All other admin pages — sidebar + main content
  return (
    <div className="min-h-screen bg-[#0f1724]">
      <AdminSidebar />
      <main className="min-h-screen pt-14 md:pt-0 md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
