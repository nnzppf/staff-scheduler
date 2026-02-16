"use client";

import AppShell from "@/components/ui/AppShell";
import Header from "@/components/ui/Header";
import FirebaseSync from "@/components/ui/FirebaseSync";
import LoginScreen from "@/components/ui/LoginScreen";

export default function Home() {
  return (
    <LoginScreen>
      <AppShell>
        <FirebaseSync />
        <Header />
      </AppShell>
    </LoginScreen>
  );
}
