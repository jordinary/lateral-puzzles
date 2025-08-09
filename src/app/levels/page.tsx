import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LevelsIndex() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="p-6">
        <p>
          Please <a className="underline" href="/login">sign in</a> to view your levels.
        </p>
      </div>
    );
  }
  const userId = (session.user as any).id as string;

  const levels = await prisma.level.findMany({ orderBy: { number: "asc" } });
  const unlocks = await prisma.levelUnlock.findMany({ where: { userId } });
  const unlockedIds = new Set(unlocks.map((u) => u.levelId));

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Levels</h1>
      <ul className="space-y-2">
        {levels.map((lvl) => {
          const unlocked = unlockedIds.has(lvl.id);
          return (
            <li key={lvl.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">Level {lvl.number}: {lvl.title}</div>
                {!unlocked && <div className="text-sm text-gray-500">Locked</div>}
              </div>
              {unlocked ? (
                <Link className="underline" href={`/levels/${lvl.number}`}>Open</Link>
              ) : (
                <span className="text-gray-400">Open</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}


