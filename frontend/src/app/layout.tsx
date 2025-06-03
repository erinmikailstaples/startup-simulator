"use client";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import providers and error boundary for application wrapping
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// export const metadata: Metadata = {
//   title: "Startup Simulator - AI-Powered Startup Idea Analysis",
//   description: "Analyze your startup idea and get instant AI-powered feedback on its viability. Receive scores on market potential, financial viability, innovation, and risk assessment.",
//   keywords: "startup, idea validation, business analysis, AI startup analysis, entrepreneurship, startup viability, startup simulator",
//   authors: [{ name: "Startup Simulator Team" }],
//   creator: "Startup Simulator",
//   publisher: "Startup Simulator",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   category: "technology",
//   openGraph: {
//     title: "Startup Simulator - AI-Powered Startup Idea Analysis",
//     description: "Analyze your startup idea and get instant AI-powered feedback on its viability.",
//     url: "https://startupsimulator.com",
//     siteName: "Startup Simulator",
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Startup Simulator - AI-Powered Startup Idea Analysis",
//     description: "Analyze your startup idea and get instant AI-powered feedback on its viability.",
//     creator: "@startupsimulator",
//   },
// };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#4F46E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
