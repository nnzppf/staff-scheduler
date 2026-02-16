"use client";

import { ReactNode } from "react";

/**
 * HydrationGate - ensures client-side hydration before rendering children.
 * Employee initialization is now handled by FirebaseSync after login.
 */
export default function HydrationGate({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
