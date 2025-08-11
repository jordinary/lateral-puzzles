import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import PuzzleImage from "@/components/PuzzleImage";
import RetroPuzzleOne from "@/components/puzzles/RetroPuzzleOne";
import RetroPuzzleTwo from "@/components/puzzles/RetroPuzzleTwo";
import RetroPuzzleThree from "@/components/puzzles/RetroPuzzleThree";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export default async function LevelPage({ params, searchParams }: { params: Promise<{ number: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? (session.user as SessionUser).id : null;

  const p = await params;
  const number = Number(p.number);
  if (!Number.isFinite(number)) notFound();

  const level = await prisma.level.findUnique({ where: { number }, include: { answers: true } });
  if (!level) notFound();

  // Gate: Level 1 is always accessible to everyone
  if (number !== 1) {
    // For other levels, require login and unlock
    if (!userId) redirect("/login");
    const unlocked = await prisma.levelUnlock.findUnique({
      where: { userId_levelId: { userId, levelId: level.id } },
    });
    if (!unlocked) {
      redirect("/levels");
    }
  }

  const sp = await searchParams;

  // Render puzzle content - prioritize uploaded content over hardcoded components
  function renderPuzzle() {
    // If there's uploaded content or an image, display that
    if (level?.content || level?.assetUrl) {
      return (
        <div className="space-y-4">
          {level?.assetUrl && (
            <PuzzleImage 
              src={level.assetUrl}
              alt={`Level ${level.number} puzzle`}
            />
          )}
          {level?.content && (
            <div className="bg-gray-50 p-4 rounded border">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: level.content }}
              />
            </div>
          )}
        </div>
      );
    }

    // Fallback to hardcoded components for levels 1-3
    switch (level?.number) {
      case 1:
        return <RetroPuzzleOne />;
      case 2:
        return <RetroPuzzleTwo />;
      case 3:
        return <RetroPuzzleThree />;
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No puzzle content available for this level.</p>
            <p className="text-sm">Please contact an administrator to add content.</p>
          </div>
        );
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Level {level?.number}: {level?.title}</h1>
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
      {level?.hint && <details className="text-sm text-gray-600"><summary>Hint</summary><div className="mt-2">{level.hint}</div></details>}
      <form action={`/api/levels/${level?.number}/answer`} method="POST" className="space-y-3">
        <input type="text" name="answer" placeholder="Password" className="border rounded px-3 py-2 w-full" required />
        <button className="bg-black text-white rounded px-4 py-2">Submit</button>
      </form>
    </div>
  );
}


