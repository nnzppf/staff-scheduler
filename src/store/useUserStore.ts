import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";

export type UserRole = "admin" | "manager" | null;

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  createdAt: number;
}

interface UserStoreState {
  currentUser: User | null;
  userProfile: UserProfile | null;
  setCurrentUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserRole: (role: UserRole) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      userProfile: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateUserRole: (role) => {
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, role }
            : null,
        }));
      },
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "staff-scheduler-user",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
