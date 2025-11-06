"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import bootstrap js only in the browser
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null; // مفيش UI بيرجع
}
