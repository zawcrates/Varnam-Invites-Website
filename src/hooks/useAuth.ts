"use client";

import { useAuthContext } from "@/providers/AuthProvider";

export function useAuth() {
  const {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  } = useAuthContext();

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
