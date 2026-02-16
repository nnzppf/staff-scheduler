"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initializeUserProfile } from "@/lib/firebase-user";
import { useAppShell, TabId } from "./AppShell";

export default function Header() {
  const { activeTab, setActiveTab, setSelectedDate } = useAppShell();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          await initializeUserProfile(currentUser);
        } catch (error) {
          console.error("Error initializing user profile:", error);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const navItems: { id: TabId; label: string }[] = [
    { id: "calendario", label: "Calendario" },
    { id: "storico", label: "Storico" },
    { id: "dipendenti", label: "Dipendenti" },
  ];

  const handleNav = (id: TabId) => {
    setSelectedDate(null);
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => handleNav("calendario")}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-bold text-gray-900">Staff Scheduler</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            by ZazzCode
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-2 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Auth Button */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">{user.displayName || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Esci
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Accedi con Google
              </button>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-3 text-sm font-medium border-b border-gray-100 transition-colors text-left ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Mobile Auth Button */}
            {!loading && (
              user ? (
                <>
                  <div className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                    {user.displayName || user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 text-left transition-colors"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleGoogleSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 text-left transition-colors"
                >
                  Accedi con Google
                </button>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
