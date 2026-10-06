import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "press bg-ink text-paper border-2 border-ink shadow-[3px_3px_0_var(--paper)]",
  secondary: "press bg-paper text-ink border-2 border-ink shadow-hard-sm",
  ghost: "text-ink underline decoration-2 underline-offset-4 hover:decoration-4",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

/** Классы кнопки: общие для <button> и ссылок, оформленных как кнопка. */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold cursor-pointer",
    "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink",
    "disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}
