"use client";

import RetroFrame from "@/components/puzzles/RetroFrame";

export default function RetroPuzzleOne() {
  return (
    <RetroFrame title="Level 1 - CRT Monitor">
      <div className="font-mono text-center space-y-3">
        <div className="mx-auto w-64 h-40 bg-black text-green-400 flex items-center justify-center border-4 border-green-700">
          <div className="animate-pulse">$ 27 + 2 ≠ 29</div>
        </div>
        <p className="text-xs text-gray-700">Hint: Add apples to apples.</p>
      </div>
    </RetroFrame>
  );
}


