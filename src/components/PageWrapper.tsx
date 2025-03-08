"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function PageWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        {children}
      </>
    ); // Render children without ThemeProvider during SSR
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 bg-background">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Navbar />
        <main className="container mx-auto p-4 bg-background border-t">
          {children}
        </main>
        <footer className="border-t py-4">
          <div className="container mx-auto text-center text-gray-500">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </div>
        </footer>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
