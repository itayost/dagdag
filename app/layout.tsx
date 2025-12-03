import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ג׳קו דגים | דגים טריים בתל אביב",
  description: "דגים טריים ואיכותיים ישירות מהים. מגוון רחב של דגי ים ומים מתוקים עם אפשרויות חיתוך לבחירתכם.",
  keywords: "דגים, דגים טריים, ג׳קו דגים, תל אביב, פירות ים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
