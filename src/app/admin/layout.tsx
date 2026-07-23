import React from "react";
import { requireAdmin } from "@/lib/auth/admin";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side authorization check before rendering ANY layout/markup
  await requireAdmin("/admin/templates");

  return (
    <div className="min-h-screen bg-background text-luxury-dark flex flex-col md:flex-row font-sansflex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
