import type { Metadata } from "next";
import { Lora, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
});



export const metadata: Metadata = {
title: "CREATE: Climate & Energy Education",
description: "Empowering learners with climate science knowledge and energy literacy to build sustainable, resilient futures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster closeButton position="bottom-center"/>
          </ThemeProvider>
      </body>
    </html>
  );
}
