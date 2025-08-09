"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);
    setResetUrl(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800 text-sm">{message}</p>
            {resetUrl && (
              <div className="mt-3">
                <p className="text-green-700 text-xs mb-2">Development reset link:</p>
                <a 
                  href={resetUrl} 
                  className="text-blue-600 hover:underline text-xs break-all"
                >
                  {resetUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white rounded px-3 py-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-blue-600 hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
