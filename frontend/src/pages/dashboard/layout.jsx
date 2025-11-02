// dashboard/layout.jsx
"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function DashboardLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex" dir="rtl">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main
        id="mainContent"
        className="flex-1 p-6 bg-gray-800 text-white min-h-screen lg:mr-56"
      >
        <Header onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
