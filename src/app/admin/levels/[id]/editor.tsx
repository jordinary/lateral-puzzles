"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LevelData = {
  id: string;
  number: number;
  title: string;
  prompt: string;
  hint: string | null;
  assetUrl: string | null;
  content: string | null;
  answersMask: string; // masked in UI
};

export default function Editor({ level }: { level: LevelData }) {
  const router = useRouter();
  const [assetUrl, setAssetUrl] = useState<string | null>(level.assetUrl);
  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setAssetUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch(`/api/admin/levels/${level.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: payload.number,
        title: payload.title,
        prompt: payload.prompt,
        hint: payload.hint,
        content: payload.content,
        answers: payload.answers,
        assetUrl,
      }),
    });
    if (res.ok) router.push("/admin/levels");
  }

  async function onDelete() {
    if (!confirm("Delete this level?")) return;
    const res = await fetch(`/api/admin/levels/${level.id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/levels");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Level</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <label className="grid gap-1">
          <span className="text-sm">Number</span>
          <input name="number" type="number" defaultValue={level.number} required className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Title</span>
          <input name="title" defaultValue={level.title} required className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Description (shown under visual)</span>
          <textarea name="prompt" rows={4} defaultValue={level.prompt} className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Hint</span>
          <input name="hint" defaultValue={level.hint ?? ""} className="border rounded px-3 py-2" />
        </label>
        <fieldset className="grid gap-2 border rounded p-3">
          <legend className="text-sm">Visual content</legend>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
              {uploading && <span className="text-xs">Uploading…</span>}
              {assetUrl && <a className="underline text-xs" href={assetUrl} target="_blank">View image</a>}
            </div>
            <div className="grid gap-1">
              <span className="text-sm">Optional code/text block</span>
              <textarea name="content" rows={6} defaultValue={level.content ?? ""} placeholder="Paste code or text here" className="border rounded px-3 py-2 font-mono" />
            </div>
          </div>
        </fieldset>
        <label className="grid gap-1">
          <span className="text-sm">Acceptable passwords (comma or newline separated)</span>
          <textarea name="answers" rows={3} placeholder="Leave blank to keep existing" className="border rounded px-3 py-2" />
        </label>
        <div className="flex gap-3">
          <button className="bg-black text-white rounded px-4 py-2">Save</button>
          <button type="button" onClick={onDelete} className="border rounded px-4 py-2">Delete</button>
        </div>
      </form>
    </div>
  );
}


