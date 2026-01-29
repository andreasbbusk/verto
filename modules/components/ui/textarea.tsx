import * as React from "react"

import { cn } from "@/modules/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      rows={4}
      className={cn(
        "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-xl border border-border bg-transparent px-4 py-2 text-sm transition-all duration-300 outline-none box-border disabled:cursor-not-allowed disabled:opacity-40",
        "focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-offset-background",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
