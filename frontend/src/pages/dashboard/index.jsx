"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // فرض می‌کنیم این کامپوننت‌ها وجود دارند
import AdminHeader from "./components/Header"; // فرض می‌کنیم این کامپوننت‌ها وجود دارند
import DashboardPage from "./components/DashboardPage";

const Dashboard = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex" dir="rtl">
      {/* اطمینان حاصل کنید که کامپوننت‌های Sidebar و AdminHeader 
        در مسیر 'app/dashboard/components/' وجود دارند 
      */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <main
        id="mainContent"
        className="flex-1 p-6 bg-gray-800 text-white min-h-screen lg:mr-56"
      >
        <AdminHeader onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <DashboardPage />
      </main>
    </div>
  );
};

export default Dashboard;
