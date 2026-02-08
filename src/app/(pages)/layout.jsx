// ✅ Server Component — no "use client" directive
// 
// Why this matters for performance:
// - Server Components don't add to the JavaScript bundle
// - No hydration cost for this layout
// - Children can still be Client Components
// - Reduces Time to Interactive (TTI) significantly
//
// The client-side state (sidebar toggle) is isolated in LayoutClient.jsx

import LayoutClient from "./LayoutClient";

export default function PagesLayout({ children }) {
  return <LayoutClient>{children}</LayoutClient>;
}
