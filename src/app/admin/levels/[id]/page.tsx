import { prisma } from "@/lib/prisma";
import Editor from "./editor";

export default async function EditLevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const level = await prisma.level.findUnique({ where: { id }, include: { answers: true } });
  if (!level) return <div className="p-6">Not found</div>;
  const answers = level.answers.map(() => "••••").join(", ");
  return <Editor level={{ ...level, answersMask: answers }} />;
}


