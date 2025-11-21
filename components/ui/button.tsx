// components/ui/button.tsx
import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 " +
        className
      }
      {...props}
    />
  )
}
