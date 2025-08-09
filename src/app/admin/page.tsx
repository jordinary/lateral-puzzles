import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminHome() {
  const [users, solves, attempts] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.levelSolve.findMany({ orderBy: { solvedAt: "desc" }, take: 20, include: { level: true, user: true } }),
    prisma.answerAttempt.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { level: true, user: true } }),
  ]);
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div>
        <Link className="underline" href="/admin/levels">Manage Levels</Link>
      </div>
      <section>
        <h2 className="text-lg font-medium mb-2">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.createdAt.toLocaleString()}</td>
                  <td className="p-2">{u.lastLoginAt ? u.lastLoginAt.toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-medium mb-2">Recent Solves</h2>
        <ul className="space-y-1">
          {solves.map((s) => (
            <li key={s.id} className="text-sm">{s.user.name ?? s.user.email} solved Level {s.level.number} at {s.solvedAt.toLocaleString()}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-medium mb-2">Recent Attempts</h2>
        <ul className="space-y-1">
          {attempts.map((a) => (
            <li key={a.id} className="text-sm">
              {a.user.name ?? a.user.email} tried Level {a.level.number}: “{a.answerText}” → {a.isCorrect ? "correct" : "wrong"} ({a.createdAt.toLocaleString()})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


