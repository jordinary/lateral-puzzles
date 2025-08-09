import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (user?.role !== "ADMIN") redirect("/levels");
  return <div className="max-w-6xl mx-auto p-6 space-y-6">{children}</div>;
}


