import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminLevels() {
  const levels = await prisma.level.findMany({ orderBy: { number: "asc" } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Levels</h1>
        <Link href="/admin/levels/new" className="underline">New Level</Link>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Hint</th>
            <th className="p-2 text-left">Asset</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">{l.number}</td>
              <td className="p-2">{l.title}</td>
              <td className="p-2">{l.hint ?? "—"}</td>
              <td className="p-2">{l.assetUrl ? <a className="underline" href={l.assetUrl}>image</a> : "—"}</td>
              <td className="p-2 space-x-3">
                <Link href={`/admin/levels/${l.id}`} className="underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


