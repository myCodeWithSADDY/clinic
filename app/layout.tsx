import type { Metadata } from "next";

import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";


export const metadata: Metadata = {
  title: "Fahad Clinic",
  description: "Dr. Fahad Fayyaz Clinic",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning={true}
      className={cn("h-full", "antialiased",)}
    >
      <body className="min-h-full flex bg-accent flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
