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
  const [showOverlay, setShowOverlay] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // When pathname changes, the new page has mounted — hide the overlay
  useEffect(() => {
    if (pathname !== prevPathname) {
      setPrevPathname(pathname);
      // Small delay to let the new page render before removing overlay
      setTimeout(() => setShowOverlay(false), 30);
    }
  }, [pathname, prevPathname]);

  const navigateTo = useCallback(
    (href: string) => {
      // Show overlay immediately to cover everything
      setShowOverlay(true);
      // Navigate after overlay is visible
      setTimeout(() => {
        router.push(href);
      }, 60);
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
      {/* Full-screen overlay that covers the flash */}
      <div
        className={`fixed inset-0 bg-background z-40 pointer-events-none transition-opacity duration-100 ${
          showOverlay ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "57px" }} // Below the header (h-14 + border)
      />
    </TransitionContext.Provider>
  );
}
