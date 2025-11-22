// components/ui/button.tsx
import * as React from "react"

type Size = "sm" | "md" | "lg"
type Variant = "default" | "outline" | "ghost"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size
  variant?: Variant
}

export function Button({ className = "", size = "md", variant = "default", ...props }: ButtonProps) {
  const sizeClasses =
    size === "sm" ? "px-3 py-1 text-sm" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"

  const variantClasses =
    variant === "outline"
      ? "bg-transparent border"
      : variant === "ghost"
      ? "bg-transparent"
      : "bg-yellow-400 text-slate-900"

  return (
    <button
      className={
        `inline-flex items-center justify-center rounded-md ${sizeClasses} font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses} ${className}`
      }
      {...props}
    />
  )
}
