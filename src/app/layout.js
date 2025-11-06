import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

import Providers from "../app/providers";
import { AuthProvider } from "../context/AuthContext";
import BootstrapClient from "./components/BootstrapClient";
import ClientWrapper from "./components/ClientWrapper";
import "./globals.css";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Lqtha App",
  description: "Booking chatbot with auth system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} ${geistSans.variable} ${geistMono.variable}`}
      >
        <Providers>
          <AuthProvider>
            <BootstrapClient />
            <ClientWrapper>{children}</ClientWrapper>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
