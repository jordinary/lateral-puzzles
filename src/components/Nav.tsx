"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import MenuBar from "./ui/MenuBar";

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
    <header className="w-full border-b border-[var(--border)] bg-[var(--surface-2)]">
      <div className="max-w-5xl mx-auto">
        <MenuBar
          left={[
            { href: "/levels", label: "Lateral Puzzles" },
            { href: "/levels", label: "Levels" },
            ...(isAuthed && isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
          ]}
          right={
            isAuthed ? (
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="menu-item text-sm">Sign out</button>
            ) : (
              <Link href="/login" className="menu-item text-sm">Sign in</Link>
            )
          }
        />
      </div>
    </header>
  );
}


