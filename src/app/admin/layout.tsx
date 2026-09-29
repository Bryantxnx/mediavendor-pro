import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Panel | MediaVendor Pro",
  description: "MediaVendor Pro administration dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f1724]">
      <AdminSidebar />

      {/* Main content area — offset by sidebar width on desktop, top bar on mobile */}
      <main className="min-h-screen pt-14 md:pt-0 md:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
