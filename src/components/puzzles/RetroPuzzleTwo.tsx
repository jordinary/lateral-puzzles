"use client";

import RetroFrame from "@/components/puzzles/RetroFrame";

export default function RetroPuzzleTwo() {
  return (
    <RetroFrame title="Level 2 - Switchboard">
      <div className="font-mono grid grid-cols-3 gap-4">
        <div className="col-span-3 text-center text-sm">Flip switches, wait, then feel.</div>
        <div className="p-4 border bg-white text-center">1</div>
        <div className="p-4 border bg-white text-center">2</div>
        <div className="p-4 border bg-white text-center">3</div>
        <div className="col-span-3 text-xs text-gray-700 text-center">One bulb is warm.</div>
      </div>
    </RetroFrame>
  );
}


