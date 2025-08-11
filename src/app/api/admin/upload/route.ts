import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import imagekit, { isImageKitConfigured } from "@/lib/imagekit";

export const runtime = "nodejs";

interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export async function POST(request: Request) {
  try {
    // Check if ImageKit is configured
    if (!isImageKitConfigured()) {
      return NextResponse.json({ 
        error: "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT environment variables." 
      }, { status: 500 });
    }

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

    // Validate file size (10MB limit for ImageKit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 10MB." 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = new Uint8Array(await file.arrayBuffer());
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const filename = `lateral-puzzles/${timestamp}-${randomId}`;

    // Upload to ImageKit
    const result = await imagekit!.upload({
      file: buffer,
      fileName: filename,
      folder: 'lateral-puzzles',
      useUniqueFileName: true,
      overwriteFile: false,
      tags: ['lateral-puzzles', 'puzzle-image']
    });

    if (!result || !result.url) {
      throw new Error('Upload failed - no result from ImageKit');
    }

    console.log(`File uploaded successfully to ImageKit: ${filename} -> ${result.url}`);
    
    return NextResponse.json({ 
      url: result.url,
      fileId: result.fileId,
      filename: filename,
      size: file.size,
      type: file.type,
      imagekitId: result.fileId
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Internal server error during upload";
    if (error instanceof Error) {
      if (error.message.includes('publicKey') || error.message.includes('privateKey')) {
        errorMessage = "ImageKit configuration error. Please check environment variables.";
      } else if (error.message.includes('urlEndpoint')) {
        errorMessage = "ImageKit URL endpoint error. Please check environment variables.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
