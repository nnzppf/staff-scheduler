"use client";

import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  User,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initializeUserProfile } from "@/lib/firebase-user";
import { isEmailAuthorized } from "@/lib/auth-config";

interface LoginScreenProps {
  children: React.ReactNode;
}

export default function LoginScreen({ children }: LoginScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    // Check redirect result first (for mobile redirect flow)
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          if (isEmailAuthorized(result.user.email)) {
            await initializeUserProfile(result.user);
            setUser(result.user);
          } else {
            setError("Accesso non autorizzato. Contatta l'amministratore.");
            await auth.signOut();
          }
        }
      })
      .catch((err) => {
        console.error("Redirect result error:", err);
        const authErr = err as AuthError;
        if (authErr.code === "auth/unauthorized-domain") {
          setError("Dominio non autorizzato in Firebase. Contatta l'amministratore.");
        }
      });

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        if (isEmailAuthorized(currentUser.email)) {
          try {
            await initializeUserProfile(currentUser);
          } catch (err) {
            console.error("Error initializing user profile:", err);
          }
          setUser(currentUser);
          setError(null);
        } else {
          setError("Accesso non autorizzato. Contatta l'amministratore.");
          await auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);

    const provider = new GoogleAuthProvider();

    // Try popup first (works on most browsers), fallback to redirect
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        if (!isEmailAuthorized(result.user.email)) {
          setError("Accesso non autorizzato. Contatta l'amministratore.");
          await auth.signOut();
        }
      }
    } catch (err) {
      const authErr = err as AuthError;
      console.error("Sign in error:", authErr.code, authErr.message);

      // If popup blocked or unavailable, try redirect
      if (
        authErr.code === "auth/popup-blocked" ||
        authErr.code === "auth/popup-closed-by-user" ||
        authErr.code === "auth/cancelled-popup-request"
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return; // Page will redirect
        } catch (redirectErr) {
          console.error("Redirect error:", redirectErr);
          setError("Errore durante l'accesso. Riprova.");
        }
      } else if (authErr.code === "auth/unauthorized-domain") {
        setError(
          "Dominio non autorizzato. Vai su Firebase Console → Authentication → Settings → Authorized domains e aggiungi questo dominio."
        );
      } else {
        setError(`Errore: ${authErr.code || "sconosciuto"}. Riprova.`);
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Staff Scheduler
            </h1>
            <p className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block mb-4">
              by ZazzCode
            </p>
            <p className="text-gray-600 text-sm">
              Accedi con il tuo account Google per gestire i turni del personale.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 h-12 px-6 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {signingIn ? "Accesso in corso..." : "Accedi con Google"}
            </span>
          </button>

          <p className="text-xs text-gray-400 text-center mt-6">
            Solo gli account autorizzati possono accedere.
          </p>
        </div>
      </div>
    );
  }

  // Logged in - show app
  return <>{children}</>;
}
