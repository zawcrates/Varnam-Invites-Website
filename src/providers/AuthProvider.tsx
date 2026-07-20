"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import { AuthService } from '@/services/AuthService';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: typeof AuthService.signIn;
  signUp: typeof AuthService.signUp;
  signInWithGoogle: typeof AuthService.signInWithGoogle;
  signOut: typeof AuthService.signOut;
  resetPassword: typeof AuthService.resetPassword;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const fetchedProfile = await AuthService.getProfile(session.user.id);
          setProfile(fetchedProfile);
          setUser({
            id: session.user.id,
            name: fetchedProfile?.name || session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || "User",
            email: session.user.email || "",
          });
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error initializing auth session:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session?.user) {
        try {
          const fetchedProfile = await AuthService.getProfile(session.user.id);
          setProfile(fetchedProfile);
          setUser({
            id: session.user.id,
            name: fetchedProfile?.name || session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || "User",
            email: session.user.email || "",
          });
        } catch (err) {
          console.error("Error handling auth state change profile sync:", err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn: AuthService.signIn.bind(AuthService),
    signUp: AuthService.signUp.bind(AuthService),
    signInWithGoogle: AuthService.signInWithGoogle.bind(AuthService),
    signOut: AuthService.signOut.bind(AuthService),
    resetPassword: AuthService.resetPassword.bind(AuthService),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
