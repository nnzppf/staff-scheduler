"use client";

import AppShell from "@/components/ui/AppShell";
import Header from "@/components/ui/Header";
import FirebaseSync from "@/components/ui/FirebaseSync";

export default function Home() {
  return (
    <AppShell>
      <FirebaseSync />
      <Header />
    </AppShell>
  );
}
