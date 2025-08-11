import React from "react";

type PanelProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export default function Panel({ title, children, className, footer }: PanelProps) {
  return (
    <section className={["window", className].filter(Boolean).join(" ")}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      {title && (
        <header className="titlebar" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
          <div className="flex-1 truncate">{title}</div>
        </header>
      )}
      <div className="p-4">{children}</div>
      {footer && <footer className="border-t p-3 text-sm" style={{ borderColor: "var(--border)" }}>{footer}</footer>}
    </section>
  );
}


