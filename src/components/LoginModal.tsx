"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // Common states
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [maxModalHeight, setMaxModalHeight] = useState(660);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setMaxModalHeight(window.innerHeight - 40);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Login states
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const loginInputRef = useRef<HTMLInputElement>(null);

  // Signup states
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupCountryCode, setSignupCountryCode] = useState("+91");
  const signupInputRef = useRef<HTMLInputElement>(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focus input when modal opens or flips, and reset on close
  useEffect(() => {
    if (!isOpen) {
      // Wait for exit animation to finish before resetting tab/state to avoid glitchy flip on exit
      const timer = setTimeout(() => {
        setIsSignup(false);
        setSignupSuccess(false);
        setError("");
        setFullName("");
        setSignupEmail("");
        setSignupPhone("");
        setSignupCountryCode("+91");
        setSignupPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowSignupPassword(false);
        setShowConfirmPassword(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setError("");
      setTimeout(() => {
        if (isSignup) {
          signupInputRef.current?.focus();
        } else {
          loginInputRef.current?.focus();
        }
      }, 250);
    }
  }, [isOpen, isSignup]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCredential = credential.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const generalPhoneRegex = /^\+?[0-9]{1,3}?[6-9]\d{9}$/;

    const isValidEmail = emailRegex.test(trimmedCredential);
    const cleanPhone = trimmedCredential.replace(/\s+/g, '');
    const isValidPhone = phoneRegex.test(cleanPhone) || generalPhoneRegex.test(cleanPhone);

    if (!isValidEmail && !isValidPhone) {
      setError("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    try {
      let emailToAuth = trimmedCredential;

      // If logging in with a phone number, fetch the corresponding email from the Profiles table
      if (isValidPhone) {
        let { data: profileData } = await supabase
          .from("Profiles")
          .select("email")
          .eq("mobile", cleanPhone)
          .maybeSingle();

        if (!profileData && cleanPhone.length === 10) {
          const { data: altProfileData } = await supabase
            .from("Profiles")
            .select("email")
            .eq("mobile", "+91" + cleanPhone)
            .maybeSingle();
          profileData = altProfileData;
        }

        if (!profileData && cleanPhone.length > 10) {
          const last10 = cleanPhone.slice(-10);
          const { data: suffixProfileData } = await supabase
            .from("Profiles")
            .select("email")
            .eq("mobile", last10)
            .maybeSingle();
          profileData = suffixProfileData;
        }

        if (profileData?.email) {
          emailToAuth = profileData.email;
        } else {
          setError("No account found with this mobile number. Please sign up.");
          return;
        }
      }

      // Authenticate with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password,
      });

      if (authErr) {
        setError(authErr.message);
        return;
      }

      if (authData.user) {
        // Fetch user profile name
        const { data: userProfile } = await supabase
          .from("Profiles")
          .select("name")
          .eq("email", emailToAuth)
          .maybeSingle();

        let userDisplayName = "User";
        if (userProfile?.name) {
          userDisplayName = userProfile.name;
        } else if (authData.user.email) {
          const prefix = authData.user.email.split('@')[0];
          userDisplayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        }

        const userData = { name: userDisplayName, email: emailToAuth };
        localStorage.setItem("current_user", JSON.stringify(userData));
        onLoginSuccess(userData);
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during login.";
      setError(message);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!fullName.trim() || !signupEmail.trim() || !signupPhone.trim() || !signupPassword || !confirmPassword) {
      setError("Please fill in all details.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(signupEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const cleanPhone = signupPhone.trim().replace(/\s+/g, '');
    const internationalPhoneRegex = /^\d{7,14}$/;

    const isValidPhone = signupCountryCode === "+91"
      ? phoneRegex.test(cleanPhone)
      : internationalPhoneRegex.test(cleanPhone);

    if (!isValidPhone) {
      setError(signupCountryCode === "+91"
        ? "Please enter a valid 10-digit mobile number."
        : "Please enter a valid phone number (7 to 14 digits).");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      // Create user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Insert record into Profiles table (saving with country code prefix and UUID id)
      const fullPhone = signupCountryCode + cleanPhone;
      if (authData?.user) {
        const { error: profileError } = await supabase.from("Profiles").insert({
          id: authData.user.id,
          name: fullName.trim(),
          email: signupEmail.trim(),
          mobile: fullPhone,
        });

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      const userData = {
        name: fullName.trim(),
        email: signupEmail.trim(),
      };

      // Set current session in localStorage
      localStorage.setItem("current_user", JSON.stringify(userData));

      // Trigger signup success UI
      setSignupSuccess(true);
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during signup.";
      setError(message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });

      if (oAuthError) {
        setError(oAuthError.message);
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred during Google sign in.";
      setError(message);
    }
  };

  const toggleView = () => {
    setError("");
    setIsSignup(!isSignup);
    // Reset visibility states
    setShowPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
    setSignupCountryCode("+91");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-luxury-dark/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label={isSignup ? "Sign Up" : "Login"}
          >
            {/* Height-animated outer container */}
            <motion.div
              animate={{ 
                height: isSignup 
                  ? (signupSuccess ? Math.min(320, maxModalHeight) : Math.min(720, maxModalHeight)) 
                  : Math.min(540, maxModalHeight)
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm overflow-visible"
              style={{ perspective: 1200 }}
            >
              {/* Rotating card wrapper */}
              <motion.div
                animate={{ rotateY: isSignup ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full h-full"
              >
                
                {/* ─── FRONT SIDE: LOGIN ─── */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className={`absolute inset-0 w-full h-full rounded-2xl border border-gold-medium/20 bg-white shadow-2xl shadow-luxury-dark/30 overflow-hidden flex flex-col justify-between ${
                    isSignup ? "pointer-events-none opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                >
                  {/* Subtle gold top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-medium to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gold-medium/10 hover:bg-gold-medium/20 text-luxury-dark/60 hover:text-luxury-dark transition-all duration-200 cursor-pointer"
                    aria-label="Close login"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div className="px-8 pt-10 pb-8 flex-grow flex flex-col justify-center overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8 text-center">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-sansflex font-semibold mb-1">
                        already have an account
                      </p>
                      <h2 className="text-2xl font-sansflex font-bold text-luxury-dark tracking-tight">
                        Login
                      </h2>
                    </div>

                    {error && !isSignup && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl font-sansflex font-medium">
                        {error}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                      {/* Email / Mobile */}
                      <div className="flex flex-col gap-1.5 text-left">
                        <label
                          htmlFor="login-credential"
                          className="text-[10px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-semibold"
                        >
                          Email / Mobile
                        </label>
                        <input
                          id="login-credential"
                          ref={loginInputRef}
                          type="text"
                          value={credential}
                          onChange={(e) => setCredential(e.target.value)}
                          placeholder="Enter email or mobile"
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-sm text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
                        />
                      </div>

                      {/* Password */}
                      <div className="flex flex-col gap-1.5 text-left">
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor="login-password"
                            className="text-[10px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-semibold"
                          >
                            Password
                          </label>
                          <Link
                            href="/forgot-password"
                            onClick={onClose}
                            className="text-[10px] text-gold-dark hover:text-gold-medium font-sansflex transition-colors font-semibold"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <div className="relative">
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
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

                      {/* Sign In button */}
                      <button
                        type="submit"
                        className="mt-2 w-full py-3 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/20 cursor-pointer"
                      >
                        Sign In
                      </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gold-medium/20"></div>
                      </div>
                      <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-luxury-dark/45 font-sansflex font-bold">
                        or continue with
                      </span>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full py-2.5 rounded-full border border-gold-medium/30 bg-white hover:bg-gold-light/10 text-luxury-dark text-xs font-semibold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Google</span>
                    </button>

                    {/* Switch View Trigger */}
                    <p className="mt-6 text-center text-xs text-luxury-dark/60 font-sansflex">
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={toggleView}
                        className="text-gold-dark hover:text-luxury-dark font-bold transition-colors cursor-pointer"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </div>

                {/* ─── BACK SIDE: SIGNUP ─── */}
                <div
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className={`absolute inset-0 w-full h-full rounded-2xl border border-gold-medium/20 bg-white shadow-2xl shadow-luxury-dark/30 overflow-hidden flex flex-col justify-between ${
                    !isSignup ? "pointer-events-none opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                >
                  {/* Subtle gold top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-medium to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gold-medium/10 hover:bg-gold-medium/20 text-luxury-dark/60 hover:text-luxury-dark transition-all duration-200 cursor-pointer"
                    aria-label="Close signup"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div className="px-8 pt-8 pb-6 flex-grow flex flex-col justify-center overflow-y-auto">
                    
                    {signupSuccess ? (
                      /* Success View */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 py-6"
                      >
                        <div className="w-16 h-16 bg-[#1b7937]/15 rounded-full flex items-center justify-center mx-auto text-[#1b7937] ring-8 ring-[#1b7937]/5">
                          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <div>
                          <h3 className="font-sansflex font-bold text-lg text-luxury-dark mb-1">Registration Complete!</h3>
                          <p className="text-xs text-[#1b7937] font-semibold uppercase tracking-wider font-sansflex">Logging you in...</p>
                        </div>
                      </motion.div>
                    ) : (
                      /* Form View */
                      <>
                        {/* Header */}
                        <div className="mb-5 text-center">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-sansflex font-semibold mb-1">
                            join varnam invites
                          </p>
                          <h2 className="text-2xl font-sansflex font-bold text-luxury-dark tracking-tight">
                            Sign Up
                          </h2>
                        </div>

                        {error && isSignup && (
                          <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl font-sansflex font-medium text-left">
                            {error}
                          </div>
                        )}

                        <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
                          {/* Name */}
                          <div className="flex flex-col gap-1 text-left">
                            <label
                              htmlFor="signup-fullname"
                              className="text-[9px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-bold"
                            >
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                              <input
                                id="signup-fullname"
                                ref={signupInputRef}
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Virat Kohli"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-xs text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex flex-col gap-1 text-left">
                            <label
                              htmlFor="signup-email-input"
                              className="text-[9px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-bold"
                            >
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                              <input
                                id="signup-email-input"
                                type="email"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                placeholder="info@virat.com"
                                required
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-xs text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200 font-mono"
                              />
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex flex-col gap-1 text-left">
                            <label
                              htmlFor="signup-phone"
                              className="text-[9px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-bold"
                            >
                              Mobile Number
                            </label>
                            <div className="flex gap-1.5">
                              <select
                                value={signupCountryCode}
                                onChange={(e) => setSignupCountryCode(e.target.value)}
                                className="bg-white border border-gold-medium/30 rounded-xl px-2 py-2 text-xs outline-none text-luxury-dark font-mono font-semibold cursor-pointer focus:border-gold-dark focus:ring-1 focus:ring-gold-dark"
                              >
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                                <option value="+971">+971</option>
                                <option value="+65">+65</option>
                                <option value="+61">+61</option>
                              </select>
                              <div className="relative flex-grow">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                                <input
                                  id="signup-phone"
                                  type="tel"
                                  value={signupPhone}
                                  onChange={(e) => setSignupPhone(e.target.value)}
                                  placeholder="9876543210"
                                  required
                                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-xs text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200 font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Password */}
                          <div className="flex flex-col gap-1 text-left">
                            <label
                              htmlFor="signup-pass"
                              className="text-[9px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-bold"
                            >
                              Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                              <input
                                id="signup-pass"
                                type={showSignupPassword ? "text" : "password"}
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-10 py-2 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-xs text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-luxury-dark transition-colors cursor-pointer"
                              >
                                {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="flex flex-col gap-1 text-left">
                            <label
                              htmlFor="signup-confpass"
                              className="text-[9px] uppercase tracking-widest text-luxury-dark/60 font-sansflex font-bold"
                            >
                              Confirm Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/45" />
                              <input
                                id="signup-confpass"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-10 py-2 rounded-xl bg-white border border-gold-medium/30 focus:border-gold-dark focus:ring-1 focus:ring-gold-dark outline-none text-xs text-luxury-dark placeholder:text-luxury-dark/40 font-sansflex transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-luxury-dark transition-colors cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Sign Up Button */}
                          <button
                            type="submit"
                            className="mt-3 w-full py-3 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/20 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Create Account</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-3 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gold-medium/20"></div>
                          </div>
                          <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-luxury-dark/45 font-sansflex font-bold">
                            or continue with
                          </span>
                        </div>

                        {/* Google Sign Up Button */}
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="w-full py-2.5 rounded-full border border-gold-medium/30 bg-white hover:bg-gold-light/10 text-luxury-dark text-xs font-semibold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              fill="#EA4335"
                            />
                          </svg>
                          <span>Google</span>
                        </button>

                        {/* Switch View Trigger */}
                        <div className="mt-5 text-center text-xs text-luxury-dark/60 font-sansflex">
                          Already have an account?{" "}
                          <button
                            onClick={toggleView}
                            className="text-gold-dark hover:text-luxury-dark font-bold transition-colors cursor-pointer"
                          >
                            Log In
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
