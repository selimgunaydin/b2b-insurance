"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

const CollapsibleContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled?: boolean
}>({
  open: false,
  onOpenChange: () => {},
})

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: openProp,
      defaultOpen,
      onOpenChange,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [openState, setOpenState] = React.useState(defaultOpen ?? false)
    
    const open = openProp ?? openState
    
    const handleOpenChange = React.useCallback(
      (value: boolean) => {
        if (disabled) return
        setOpenState(value)
        onOpenChange?.(value)
      },
      [disabled, onOpenChange]
    )

    return (
      <CollapsibleContext.Provider
        value={{
          open,
          onOpenChange: handleOpenChange,
          disabled,
        }}
      >
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn(className)}
          {...props}
        >
            {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, children, asChild = false, onClick, ...props }, ref) => {
  const { open, onOpenChange, disabled } = React.useContext(CollapsibleContext)
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e)
        onOpenChange(!open)
      }}
      {...props}
    >
      {children}
    </Comp>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext)

  if (!open) return null

  return (
    <div
      ref={ref}
      data-state={open ? "open" : "closed"}
      className={cn("overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
