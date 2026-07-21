"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const [sessionError, setSessionError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // 1. Session verification on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsValidSession(true);
          setCheckingSession(false);
          return;
        }

        // Check if there is an authorization code in URL
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError && data.session) {
            setIsValidSession(true);
          } else {
            console.error("Code exchange failed:", exchangeError);
            setSessionError(exchangeError?.message || "Verification code is invalid or has expired.");
            setIsValidSession(false);
          }
        } else {
          setSessionError("No active recovery session was found. Please request a new password reset email.");
          setIsValidSession(false);
        }
      } catch (err) {
        console.error("Error verifying recovery session:", err);
        setSessionError("An unexpected error occurred while checking authorization.");
        setIsValidSession(false);
      } finally {
        setCheckingSession(false);
      }
    };

    verifySession();
  }, []);

  // 2. Countdown redirect effect on success
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      // Redirect to home page with login modal open
      router.push('/?login=true');
    }
  }, [success, countdown, router]);

  // 3. Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Clear input states
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Password update exception:", err);
      setError("Failed to update password. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <Loader2 className="w-8 h-8 text-gold-dark animate-spin mb-4" />
        <p className="text-xs text-foreground/60 uppercase tracking-widest font-semibold">Verifying secure token...</p>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="bg-white border border-gold-medium/15 p-10 rounded-3xl max-w-md w-full luxury-shadow text-left">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="font-sansflex text-2xl font-bold text-luxury-dark mb-3 text-center">Invalid Link</h2>
        <p className="text-xs text-foreground/60 mb-8 leading-relaxed text-center">
          {sessionError}
        </p>
        <button
          onClick={() => router.push('/?login=true')}
          className="w-full inline-flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-4 rounded-full transition-all duration-300 cursor-pointer"
        >
          <span>Back to Login</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gold-medium/15 p-10 rounded-3xl max-w-md w-full luxury-shadow text-left">
      <div className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-sansflex font-semibold mb-1">
          secure update
        </p>
        <h2 className="text-2xl font-sansflex font-bold text-luxury-dark tracking-tight">
          Reset Password
        </h2>
        <div className="w-10 h-[1.5px] bg-gold-medium mx-auto mt-2" />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl font-sansflex font-medium flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6 text-center animate-fade-in">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sansflex font-bold text-luxury-dark text-lg">Password Updated</h3>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Your password has been changed successfully. Redirecting to login in {countdown} seconds...
            </p>
          </div>
          <button
            onClick={() => router.push('/?login=true')}
            className="w-full inline-flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-bold bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white py-4 rounded-full transition-all duration-300 cursor-pointer"
          >
            <span>Login Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="reset-password"
              className="text-[10px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-semibold"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                required
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-sm text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-luxury-dark transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="confirm-reset-password"
              className="text-[10px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-semibold"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-reset-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-sm text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-luxury-dark transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Update Password button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-4 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
