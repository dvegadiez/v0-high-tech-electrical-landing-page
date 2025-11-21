// components/ui/textarea.tsx
import * as React from "react"

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={
        "w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 " +
        className
      }
      {...props}
    />
  )
}
