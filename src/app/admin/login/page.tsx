"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/firestore";

function LoginForm() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState("https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev/uploads/e964a5b7-b0e4-40c4-9d06-c02c79401a2f-UpmarkLogoRGB-07Transparent.png");

  useEffect(() => {
    getSiteSettings().then(data => {
      setLogoUrl(data?.navbarLogoV3 || data?.editorialLogoUrl || "https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev/uploads/e964a5b7-b0e4-40c4-9d06-c02c79401a2f-UpmarkLogoRGB-07Transparent.png");
    }).catch(console.error);
  }, []);

  // Redirect if already logged in
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    router.replace("/admin");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in";
      if (message.includes("invalid-credential") || message.includes("wrong-password") || message.includes("user-not-found")) {
        setError("Invalid email or password.");
      } else if (message.includes("too-many-requests")) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src={logoUrl} alt="Upmark" width={280} height={280} className="h-16 sm:h-20 w-auto mx-auto" />
          <p className="text-muted-text text-sm mt-2">
            Admin Dashboard
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-secondary-surface rounded-2xl border border-primary-text/5 p-8 flex flex-col gap-6 shadow-2xl"
        >
          <div>
            <h2 className="text-xl font-semibold text-primary-text">Sign In</h2>
            <p className="text-sm text-muted-text mt-1">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-primary-text"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@upmark.co"
              className="w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-primary-text"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 pr-12 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-blue hover:bg-accent-blue/90 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-muted-text/60 mt-6">
          © {new Date().getFullYear()} Upmark. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// The login page needs its own AuthProvider but NOT the ProtectedRoute / AdminLayout.
// Since the admin/layout.tsx wraps everything in ProtectedRoute, we use a route group
// or handle this differently. The cleanest approach: the login page uses its own layout.
export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
