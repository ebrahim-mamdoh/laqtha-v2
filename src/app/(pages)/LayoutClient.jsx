"use client";

/**
 * LayoutClient.jsx
 * 
 * Purpose: Minimal client wrapper that manages ONLY the shared sidebar state.
 * This isolates the useState to a small boundary, allowing the parent layout
 * to remain a Server Component.
 * 
 * Performance benefit: Reduces hydration cost by keeping state management
 * in a minimal component rather than the entire layout tree.
 */

import React, { useState, useCallback } from "react";
import Sidebar from "./chat/components/Sidebar/Sidebar";
import ChatHeader from "./chat/components/ChatHeader/ChatHeader";
import styles from "./mainLayout.module.css";

export default function LayoutClient({ children }) {
  // Sidebar open/close state - the only reason this needs to be a client component
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Memoized toggle function to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className={styles.mainLayout}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={styles.contentArea}>
        <ChatHeader onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
