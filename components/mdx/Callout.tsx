import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ title?: string; type?: "info" | "warn" | "success" | "error" }>;

export default function Callout({ title, type = "info", children }: Props) {
  const color = {
    info: "#2563eb",
    warn: "#d97706",
    success: "#16a34a",
    error: "#dc2626",
  }[type];

  return (
    <div style={{
      borderLeft: `4px solid ${color}`,
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: 6,
      margin: '1rem 0'
    }} role="note" aria-label={title ?? type}>
      {title && <strong style={{ display: 'block', marginBottom: 4 }}>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}

