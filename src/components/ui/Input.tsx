import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className, id, ...rest }: InputProps) {
  const controlId = id || Math.random().toString(36).slice(2);
  return (
    <label htmlFor={controlId} className="grid gap-1">
      {label && <span className="text-xs mono text-muted">{label}</span>}
      <input
        id={controlId}
        className={[
          "border px-3 py-2 bg-[var(--surface)]",
          "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
          "border-[var(--border)]",
          className,
        ].filter(Boolean).join(" ")}
        {...rest}
      />
      {hint && <span className="text-[10px] text-muted">{hint}</span>}
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string };
export function TextArea({ label, hint, className, id, rows = 4, ...rest }: TextAreaProps) {
  const controlId = id || Math.random().toString(36).slice(2);
  return (
    <label htmlFor={controlId} className="grid gap-1">
      {label && <span className="text-xs mono text-muted">{label}</span>}
      <textarea
        id={controlId}
        rows={rows}
        className={[
          "border px-3 py-2 bg-[var(--surface)] font-mono",
          "focus:outline-none focus:ring-1 focus:ring-[var(--accent)]",
          "border-[var(--border)]",
          className,
        ].filter(Boolean).join(" ")}
        {...rest}
      />
      {hint && <span className="text-[10px] text-muted">{hint}</span>}
    </label>
  );
}


