import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "tastemaxing",
  description: "Log live music. Tell your friends.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full text-white pb-20" style={{ backgroundColor: "#0A0A0A" }}>
        <main className="max-w-2xl mx-auto px-4 pt-8">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
