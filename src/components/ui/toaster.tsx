
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useRef } from "react"

export function Toaster() {
  const { toasts } = useToast()
  // Use ref to track if we've shown the projects loaded toast
  const loadedToastShownRef = useRef(false)
  
  useEffect(() => {
    // Reset the flag when the component mounts
    loadedToastShownRef.current = false
    
    return () => {
      // Clean up on unmount
      loadedToastShownRef.current = false
    }
  }, [])
  
  // Filter out duplicate "Projects loaded" toasts
  const filteredToasts = toasts.filter(toast => {
    // Check if this toast is a "Projects loaded" notification
    const isProjectLoadedToast = 
      toast.title === "Projects loaded" || 
      (typeof toast.description === 'string' && toast.description.includes("Projects loaded"));
    
    // If it's a project loaded toast and we've already shown one, filter it out
    if (isProjectLoadedToast && loadedToastShownRef.current) {
      return false;
    }
    
    // If it's a project loaded toast and we haven't shown one yet, mark it as shown
    if (isProjectLoadedToast && !loadedToastShownRef.current) {
      loadedToastShownRef.current = true;
    }
    
    // Keep all other toasts
    return true;
  });

  return (
    <ToastProvider>
      {filteredToasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
