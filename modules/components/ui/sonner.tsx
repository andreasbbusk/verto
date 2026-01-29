"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="group"
      toastOptions={{
        classNames: {
          toast:
            "bg-card text-foreground border-2 border-foreground rounded-2xl shadow-[4px_4px_0px_0px_#111111] font-body text-sm leading-snug",
          title: "font-sans font-semibold",
          description: "text-muted-foreground",
          actionButton:
            "border-2 border-foreground rounded-full bg-card text-foreground font-semibold hover:bg-primary hover:text-primary-foreground",
          closeButton:
            "border-2 border-foreground rounded-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
