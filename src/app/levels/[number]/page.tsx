import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import RetroPuzzleOne from "@/components/puzzles/RetroPuzzleOne";
import RetroPuzzleTwo from "@/components/puzzles/RetroPuzzleTwo";
import RetroPuzzleThree from "@/components/puzzles/RetroPuzzleThree";

export default async function LevelPage({ params, searchParams }: { params: Promise<{ number: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const p = await params;
  const number = Number(p.number);
  if (!Number.isFinite(number)) notFound();

  const level = await prisma.level.findUnique({ where: { number }, include: { answers: true } });
  if (!level) notFound();

  // Gate: ensure user has unlocked this level
  const unlocked = await prisma.levelUnlock.findUnique({
    where: { userId_levelId: { userId, levelId: level.id } },
  });
  if (!unlocked) {
    redirect("/levels");
  }

  const sp = await searchParams;

  // Choose a retro visual puzzle per level number
  function renderPuzzle() {
    switch (level.number) {
      case 1:
        return <RetroPuzzleOne />;
      case 2:
        return <RetroPuzzleTwo />;
      case 3:
        return <RetroPuzzleThree />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Level {level.number}: {level.title}</h1>
      {sp?.status === "wrong" && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3">Incorrect password. Try again.</div>
      )}
      <div className="rounded border bg-[#fefefe] shadow p-4">
        {renderPuzzle()}
      </div>
      <section className="border-2 border-black bg-[#F2F2F2]">
        <div className="bg-[#00008B] text-white px-3 py-1 font-mono text-sm">Description</div>
        <div className="p-4 bg-[#FDFCF7] whitespace-pre-wrap text-gray-800 text-sm">
          {level.prompt}
        </div>
      </section>
      {level.hint && <details className="text-sm text-gray-600"><summary>Hint</summary><div className="mt-2">{level.hint}</div></details>}
      <form action={`/api/levels/${level.number}/answer`} method="POST" className="space-y-3">
        <input type="text" name="answer" placeholder="Password" className="border rounded px-3 py-2 w-full" required />
        <button className="bg-black text-white rounded px-4 py-2">Submit</button>
      </form>
    </div>
  );
}


