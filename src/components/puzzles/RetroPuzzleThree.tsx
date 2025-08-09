"use client";

import RetroFrame from "@/components/puzzles/RetroFrame";

export default function RetroPuzzleThree() {
  return (
    <RetroFrame title="Level 3 - Balance Scale">
      <div className="font-mono text-center space-y-3">
        <div className="mx-auto w-40 h-24 border-4 border-gray-800 bg-yellow-100 flex items-center justify-center">
          ⚖️
        </div>
        <p className="text-xs text-gray-700">How many weighings?</p>
      </div>
    </RetroFrame>
  );
}


