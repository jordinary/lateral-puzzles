import { NextResponse } from "next/server";
import { readdir, access } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Check if directory exists
    try {
      await access(uploadsDir);
    } catch (error) {
      return NextResponse.json({
        error: "Uploads directory does not exist",
        path: uploadsDir,
        cwd: process.cwd(),
        exists: false
      });
    }

    // List files in directory
    const files = await readdir(uploadsDir);
    
    return NextResponse.json({
      uploadsDir,
      cwd: process.cwd(),
      exists: true,
      fileCount: files.length,
      files: files.map(file => ({
        name: file,
        path: `/uploads/${file}`,
        fullPath: path.join(uploadsDir, file)
      }))
    });
    
  } catch (error) {
    console.error("Debug uploads error:", error);
    return NextResponse.json({
      error: "Failed to read uploads directory",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
