// components/ui/input.tsx
import * as React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={
        "w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 " +
        className
      }
      {...props}
    />
  )
}
