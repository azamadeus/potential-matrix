import * as React from "react";
import { cn } from "@/lib/utils";
import type { Zone } from "@/lib/types";

const tones: Record<Zone | "neutral" | "ink", string> = {
  neutral: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  green: "bg-zone-green text-paper",
  yellow: "bg-zone-yellow text-ink",
  red: "bg-zone-red text-paper",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof tones;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
