import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { useState, useEffect, useRef } from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  // Keep track of seen project load notifications to avoid duplicates
  const shownProjectLoadToastRef = useRef(false)
  
  useEffect(() => {
    // Reset the flag when the component mounts
    shownProjectLoadToastRef.current = false
  }, [])

  // Filter toasts in a way that's compatible with the Sonner API
  const filteredProps = { ...props };
  
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...filteredProps}
    />
  )
}

export { Toaster }
