// components/ui/card.tsx
import * as React from "react"

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={
        "rounded-xl border border-slate-200 bg-white shadow-sm " + className
      }
      {...props}
    />
  )
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={"p-6 " + className} {...props} />
}
