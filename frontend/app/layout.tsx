import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phonetic | Your Smartphone. Your Smart Decision.",
  description:
    "Estimate your phone's resale value, discover smartphones that match your needs, and compare your options — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} h-full bg-white text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
