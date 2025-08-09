"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export default function Nav() {
  const { data } = useSession();
  const isAuthed = Boolean(data?.user);
  const user = data?.user as SessionUser | undefined;
  const isAdmin = user?.email === "admin@example.com" || user?.role === "ADMIN";
  return (
    <header className="w-full border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/levels" className="font-semibold">Lateral Puzzles</Link>
        <nav className="flex items-center gap-4">
          <Link href="/levels" className="underline">Levels</Link>
          {isAuthed && isAdmin && <Link href="/admin" className="text-sm underline">Admin</Link>}
          {isAuthed ? (
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm underline">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="text-sm underline">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}


