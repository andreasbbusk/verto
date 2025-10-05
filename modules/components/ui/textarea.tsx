import * as React from "react"

import { cn } from "@/modules/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-40",
        "focus:border-foreground/50 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
