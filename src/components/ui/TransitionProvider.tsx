"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "fade-in" | "visible" | "fade-out">("idle");
  const [prevPathname, setPrevPathname] = useState(pathname);

  // When pathname changes, new page is mounted — start fade-out
  useEffect(() => {
    if (pathname !== prevPathname) {
      setPrevPathname(pathname);
      // Let new page render one frame, then fade out overlay
      requestAnimationFrame(() => {
        setPhase("fade-out");
        setTimeout(() => setPhase("idle"), 250);
      });
    }
  }, [pathname, prevPathname]);

  const navigateTo = useCallback(
    (href: string) => {
      // Phase 1: fade overlay in
      setPhase("fade-in");
      // Phase 2: once overlay is opaque, navigate
      setTimeout(() => {
        setPhase("visible");
        router.push(href);
      }, 150);
    },
    [router]
  );

  const overlayOpacity =
    phase === "idle" ? "opacity-0" :
    phase === "fade-in" ? "opacity-100" :
    phase === "visible" ? "opacity-100" :
    "opacity-0"; // fade-out

  const overlayDuration =
    phase === "fade-in" ? "duration-150" :
    phase === "fade-out" ? "duration-200" :
    "duration-0";

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
      <div
        className={`fixed inset-0 bg-background z-40 pointer-events-none transition-opacity ${overlayDuration} ${overlayOpacity}`}
        style={{ top: "57px" }}
      />
    </TransitionContext.Provider>
  );
}
