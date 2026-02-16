"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  navigateTo: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = useCallback(
    (href: string) => {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push(href);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 100);
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function TransitionMain({ children }: { children: ReactNode }) {
  const { isTransitioning } = usePageTransition();

  return (
    <main
      className={`max-w-7xl mx-auto px-4 py-4 pb-safe transition-opacity duration-100 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </main>
  );
}
