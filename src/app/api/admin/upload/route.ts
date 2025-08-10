import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Basic role check via email or role claim
    const role = (session.user as SessionUser).role;
    const email = session.user.email;
    if (!(role === "ADMIN" || email === "admin@example.com")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get("file");
    
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed." 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".png";
    const name = `${crypto.randomUUID()}${ext}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, name);
    await writeFile(filePath, bytes);
    
    // Verify file was written successfully
    try {
      await access(filePath);
    } catch (error) {
      console.error("Failed to verify uploaded file:", error);
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    const url = `/uploads/${name}`;
    
    console.log(`File uploaded successfully: ${filePath} -> ${url}`);
    
    return NextResponse.json({ 
      url,
      filename: name,
      size: file.size,
      type: file.type
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Internal server error during upload" 
    }, { status: 500 });
  }
}


