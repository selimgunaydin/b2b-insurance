"use client"

import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[420px]">
      {toasts.map(function ({ title, description, variant }, index) {
        return (
          <div
            key={index}
            className={`
              rounded-md border p-4 shadow-lg transition-all duration-300 ease-in-out
              ${variant === "destructive" 
                ? "bg-red-600 text-white border-red-700" 
                : "bg-white text-slate-950 border-slate-200 dark:bg-slate-950 dark:text-slate-50 dark:border-slate-800"}
            `}
          >
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
          </div>
        )
      })}
    </div>
  )
}
