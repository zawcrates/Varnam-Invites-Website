import { supabase } from "@/lib/supabase";
import type { AuthUser, UserProfile } from "@/types";
import { LoginFormData, SignupFormData } from "@/validations";

export class AuthService {
  /**
   * Resolve an email address from a phone number in the profiles table.
   */
  static async resolveEmailFromPhone(phone: string): Promise<string | null> {
    const cleanPhone = phone.replace(/\s+/g, '');
    
    let { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (!profile && cleanPhone.length === 10) {
      const { data: altProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("phone", "+91" + cleanPhone)
        .maybeSingle();
      profile = altProfile;
    }

    if (!profile && cleanPhone.length > 10) {
      const last10 = cleanPhone.slice(-10);
      const { data: suffixProfile } = await supabase
        .from("profiles")
        .select("email")
        .eq("phone", last10)
        .maybeSingle();
      profile = suffixProfile;
    }

    return profile?.email || null;
  }

  /**
   * Signs in a user using email or phone and password.
   */
  static async signIn(data: LoginFormData): Promise<{ user: AuthUser | null; error: string | null }> {
    const credential = data.email.trim();
    const password = data.password;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailToAuth = credential;

    if (!emailRegex.test(credential)) {
      const resolvedEmail = await this.resolveEmailFromPhone(credential);
      if (resolvedEmail) {
        emailToAuth = resolvedEmail;
      } else {
        return { user: null, error: "No account found with this mobile number." };
      }
    }

    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password: password,
    });

    if (authErr) {
      return { user: null, error: authErr.message };
    }

    if (authData.user) {
      const profile = await this.getProfile(authData.user.id);
      const authUser: AuthUser = {
        id: authData.user.id,
        name: profile?.name || authData.user.user_metadata?.display_name || authData.user.user_metadata?.full_name || "User",
        email: authData.user.email || "",
      };
      return { user: authUser, error: null };
    }

    return { user: null, error: "An unexpected error occurred." };
  }

  /**
   * Signs up a new user and creates their profile.
   */
  static async signUp(data: SignupFormData & { phone: string }): Promise<{ session: boolean; error: string | null }> {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          display_name: data.name.trim(),
          phone: data.phone.trim(),
        }
      }
    });

    if (signUpError) {
      return { session: false, error: signUpError.message };
    }

    return { session: !!authData?.session, error: null };
  }

  /**
   * Initiates Google OAuth Sign In.
   */
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    return { error: error ? error.message : null };
  }

  /**
   * Resets password.
   */
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });

    return { error: error ? error.message : null };
  }

  /**
   * Signs the current user out.
   */
  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Fetches the user profile by ID.
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.display_name,
      email: data.email,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }
}
export default AuthService;
