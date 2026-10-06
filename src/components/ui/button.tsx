import * as React from "react";
import { Link, type LinkProps } from "react-router-dom";
import { buttonClass, type ButtonSize, type ButtonVariant } from "./button-variants";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

/** Ссылка внутри сайта, оформленная как кнопка. */
export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkProps & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
