import * as React from "react"

import { cn } from "@/modules/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border border-border bg-transparent px-3 py-1 text-sm transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus:border-foreground/50 focus:ring-1 focus:ring-ring focus:ring-offset-0 focus:ring-offset-background",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
