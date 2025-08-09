import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Basic role check via email or role claim
  const role = (session.user as any).role;
  const email = session.user.email;
  if (!(role === "ADMIN" || email === "admin@example.com")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".png";
  const name = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, name);
  await writeFile(filePath, bytes);
  const url = `/uploads/${name}`;
  return NextResponse.json({ url });
}


