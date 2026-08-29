"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="admin-app-layout">
        {/* Left Desktop Sidebar & Mobile Off-canvas Drawer */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="admin-main-wrapper">
          <AdminTopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <div className="admin-page-content-area">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}