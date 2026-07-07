import React from "react";

export function parseHighlighted(text: string, type: "gradient" | "gold" | "white" = "gradient"): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      if (type === "gradient") {
        return <span key={i} className="text-accent-blue">{part}</span>;
      }
      if (type === "white") {
        return <span key={i} className="text-accent-blue">{part}</span>;
      }
      return <span key={i} className="text-accent-gold">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}
