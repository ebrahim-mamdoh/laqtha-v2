"use client";

import React, { useState } from "react";
import Sidebar from "./chat/components/Sidebar/Sidebar";
import ChatHeader from "./chat/components/ChatHeader/ChatHeader";
import styles from "./mainLayout.module.css";

export default function PagesLayout({ children }) {
  // 👇 إدارة حالة فتح/قفل الـ Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className={styles.mainLayout}>
      {/* نمرر الحالة والفنكشن */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={styles.contentArea}>
        {/* نخلي ChatHeader يقدر يقفل/يفتح الـ Sidebar */}
        <ChatHeader onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
