"use client";

import { parseHighlighted } from "@/lib/parseHighlighted";

interface ParsedHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  highlight?: "gradient" | "gold" | "white";
}

export function ParsedHeading({ text, as: Tag = "h2", className = "", highlight = "gradient" }: ParsedHeadingProps) {
  return <Tag className={className}>{parseHighlighted(text, highlight)}</Tag>;
}
