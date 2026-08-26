import React from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminTabBar from "@/components/admin/AdminTabBar";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="ios-app-container">
        <AdminTopBar />
        {children}
        <AdminTabBar />
      </div>
    </ToastProvider>
  );
}