"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/levels",
      });
    } catch {
      setIsLoading(false);
      setError("Sign in failed");
    }
  }

  // Google sign-in removed

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        
        {(error || urlError) && (
          <p className="text-red-600 text-sm text-center">
            {error || (urlError === 'CredentialsSignin' ? 'Invalid email or password' : 'Sign in failed')}
          </p>
        )}
        
        
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white rounded px-3 py-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <div className="text-sm text-center space-y-2">
          <p>
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </p>
          <p>
            No account? <Link href="/register" className="underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-6">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}

