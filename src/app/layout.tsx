import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import HydrationGate from "@/components/ui/HydrationGate";
import TransitionProvider, {
  TransitionMain,
} from "@/components/ui/TransitionProvider";

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
            <TransitionMain>{children}</TransitionMain>
          </TransitionProvider>
        </HydrationGate>
      </body>
    </html>
  );
}
