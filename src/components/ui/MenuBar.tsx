"use client";

import Link from "next/link";
import React from "react";

type MenuItem = { href: string; label: string; className?: string };

type MenuBarProps = {
  left?: MenuItem[];
  right?: React.ReactNode;
  className?: string;
};

export default function MenuBar({ left = [], right, className }: MenuBarProps) {
  return (
    <div className={["titlebar", className].filter(Boolean).join(" ")}>
      <nav className="flex items-center gap-4">
        {left.map((item, idx) => (
          <React.Fragment key={item.href + idx}>
            {idx > 0 && <span className="menu-sep">|</span>}
            <Link href={item.href} className={["menu-item", item.className].filter(Boolean).join(" ")}>{item.label}</Link>
          </React.Fragment>
        ))}
      </nav>
      <div className="flex-1" />
      {right}
    </div>
  );
}


