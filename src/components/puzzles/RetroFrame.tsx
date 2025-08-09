"use client";

import type { ReactNode } from "react";

export default function RetroFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-2 border-black bg-[#F2F2F2]">
      <div className="bg-[#00008B] text-white px-3 py-1 flex items-center justify-between">
        <span className="font-mono text-sm">{title}</span>
        <div className="flex gap-1">
          <span className="w-3 h-3 bg-[#ff5f56] inline-block" />
          <span className="w-3 h-3 bg-[#ffbd2e] inline-block" />
          <span className="w-3 h-3 bg-[#27c93f] inline-block" />
        </div>
      </div>
      <div className="p-4 bg-[#FDFCF7]">{children}</div>
    </div>
  );
}


