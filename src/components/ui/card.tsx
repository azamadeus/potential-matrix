import * as React from "react";
import { cn } from "@/lib/utils";

/** Карта колоды: кремовая, с чёрной обводкой и жёсткой тенью. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[22px] border-2 border-ink bg-paper text-ink shadow-hard", className)}
      {...props}
    />
  );
}
