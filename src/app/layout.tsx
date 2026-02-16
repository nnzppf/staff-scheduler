import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import HydrationGate from "@/components/ui/HydrationGate";
import TransitionProvider from "@/components/ui/TransitionProvider";

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
          <TransitionProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-4 pb-safe">
              {children}
            </main>
          </TransitionProvider>
        </HydrationGate>
      </body>
    </html>
  );
}
