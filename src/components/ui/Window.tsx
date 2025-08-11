"use client";

import React from "react";

type WindowProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function Window({ title, actions, children, className, style }: WindowProps) {
  return (
    <div
      className={["window", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        ...style,
      }}
    >
      {(title || actions) && (
        <div className="titlebar" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
          <div className="flex-1 truncate">{title}</div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}


