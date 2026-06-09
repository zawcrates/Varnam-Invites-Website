"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // Common states
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCredential = credential.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const generalPhoneRegex = /^\+?[0-9]{1,3}?[6-9]\d{9}$/;

    const isValidEmail = emailRegex.test(trimmedCredential);
    const isValidPhone = phoneRegex.test(trimmedCredential.replace(/\s+/g, '')) || generalPhoneRegex.test(trimmedCredential.replace(/\s+/g, ''));

    if (!isValidEmail && !isValidPhone) {
      setError("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    // Direct login simulation
    console.log("Sign in with", trimmedCredential, password);
    
    let userFullName = "Guest User";
    try {
      const simulatedUsers = JSON.parse(localStorage.getItem("simulated_users") || "{}");
      const user = simulatedUsers[trimmedCredential.toLowerCase()];
      if (user && user.password === password) {
        userFullName = user.fullName;
      } else {
        // Fallback: extract name from email prefix or phone number
        if (isValidEmail) {
          const prefix = trimmedCredential.split('@')[0];
          userFullName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        } else {
          userFullName = "User " + trimmedCredential.slice(-4);
        }
      }
    } catch (e) {
      console.error(e);
    }

    const userData = { name: userFullName, email: trimmedCredential };
    localStorage.setItem("current_user", JSON.stringify(userData));
    onLoginSuccess(userData);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
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

    // Save user detail to simulated DB and set current session in localStorage
    const userData = { name: fullName.trim(), email: signupEmail.trim() };
    try {
      const simulatedUsers = JSON.parse(localStorage.getItem("simulated_users") || "{}");
      simulatedUsers[signupEmail.trim().toLowerCase()] = {
        fullName: fullName.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
      };
      localStorage.setItem("simulated_users", JSON.stringify(simulatedUsers));
      localStorage.setItem("current_user", JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }

    // Simulate signup success
    setSignupSuccess(true);
    setTimeout(() => {
      // Trigger login success immediately
      onLoginSuccess(userData);
      // Note: We don't reset the signup success or isSignup state here anymore,
      // so it doesn't try to flip the 3D card back to login form *while* the modal is fading out.
      // These are cleaned up in the useEffect when the modal is fully closed.
    }, 1200);
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
                height: isSignup ? (signupSuccess ? 320 : 660) : 460 
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

                  <div className="px-8 pt-10 pb-8 flex-grow flex flex-col justify-center">
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

                  <div className="px-8 pt-8 pb-6 flex-grow flex flex-col justify-center">
                    
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
