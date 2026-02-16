import type { Metadata, Viewport } from "next";
import "./globals.css";
import HydrationGate from "@/components/ui/HydrationGate";

export const metadata: Metadata = {
  title: "Staff Scheduler",
  description: "Pianificazione turni dipendenti",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Staff Scheduler",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <HydrationGate>
          {children}
        </HydrationGate>
      </body>
    </html>
  );
}
