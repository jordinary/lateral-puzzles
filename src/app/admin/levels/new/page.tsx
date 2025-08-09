"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLevelPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const res = await fetch("/api/admin/levels", {
      method: "POST",
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
    if (res.ok) {
      router.push("/admin/levels");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create level");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Level</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-red-800 font-medium">Error</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(error);
              }}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Copy
            </button>
          </div>
          <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap select-all">{error}</pre>
        </div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <label className="grid gap-1">
          <span className="text-sm">Number</span>
          <input name="number" type="number" required className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Title</span>
          <input name="title" required className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Description (shown under visual)</span>
          <textarea name="prompt" rows={4} className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Hint</span>
          <input name="hint" className="border rounded px-3 py-2" />
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
              <textarea name="content" rows={6} placeholder="Paste code or text here" className="border rounded px-3 py-2 font-mono" />
            </div>
          </div>
        </fieldset>
        <label className="grid gap-1">
          <span className="text-sm">Acceptable passwords (comma or newline separated)</span>
          <textarea name="answers" rows={3} className="border rounded px-3 py-2" />
        </label>
        <div>
          <button 
            className="bg-black text-white rounded px-4 py-2"
            onClick={() => setError(null)}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}


