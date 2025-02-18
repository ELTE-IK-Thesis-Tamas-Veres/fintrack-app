"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export default function ThemeWrapper({
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
      </ThemeProvider>
    </div>
  );
}
