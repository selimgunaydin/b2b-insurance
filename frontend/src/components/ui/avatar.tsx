"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarContext = React.createContext<{
  hasImageError: boolean;
  setHasImageError: (error: boolean) => void;
}>({
  hasImageError: false,
  setHasImageError: () => {},
});

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [hasImageError, setHasImageError] = React.useState(true);

  return (
    <AvatarContext.Provider value={{ hasImageError, setHasImageError }}>
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => {
  const { setHasImageError } = React.useContext(AvatarContext);

  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoad={() => setHasImageError(false)}
      onError={() => setHasImageError(true)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { hasImageError } = React.useContext(AvatarContext);
  // If we have an image sibling (checked via context indirectly or just assumed usage), 
  // and that image hasn't errored, we might want to hide fallback?
  // Radix behavior: Fallback is shown 'when the image is loading or has failed'. 
  // Here simple implementation: Show fallback if image error is true OR if no image is present (logic depends on children).
  // But since we can't easily detect siblings, we will rely on CSS or conditional rendering.
  // Actually, standard HTML `img` behavior: if src is broken, it stays. `AvatarImage` handles hiding itself? NO, I made it just trigger error.

  // Better approach: AvatarImage hides itself on error. AvatarFallback is always there underneath? 
  // Or AvatarImage is z-index higher?
  
  // Let's rely on the context: if hasImageError is false/loading, we might show image.
  // Actually, to keep it extremely simple without complex loading state handling:
  // Render fallback ONLY if hasImageError is true.
  // Wait, if image is loading, we also want fallback usually.
  
  // Let's inverse: Assume image is loading/error until onLoad fires? 
  // Too complex for now.
  
  // Lets go with: Fallback is visible if hasImageError is true.
  // AND: AvatarImage should probably be hidden if error?
  
  // Refined Logic (Radix-like):
  // AvatarImage renders `img`. On error -> `hasImageError = true`.
  // AvatarFallback renders `span`. Visible if `hasImageError` is true.

  // BUT: what about initial load? Image takes time. Fallback should be visible? 
  // Or usually we show a skeleton. 
  
  // Let's stick to: AvatarFallback is generated with a z-index lower than image? 
  // Or just render fallback if children don't include an image that successfully loaded.
  
  // Let's just render the fallback. If the image loads on top (absolute position or just order), fine.
  // But shadcn usually puts fallback as sibling.
  
  // Let's make AvatarImage absolute and cover the fallback? 
  // No, `relative flex ...`.
  
  // Simple hack: AvatarFallback is always rendered. AvatarImage is rendered. 
  // If AvatarImage loads successfully, it covers fallback? 
  // If I give AvatarImage `bg-white` (or transparent) it might show fallback behind.
  
  // Let's try:
  // Show fallback if hasImageError is true.
  // On mount, hasImageError is false. Image tries to load. If error, hasImageError=true -> Fallback shows.
  // If successful, Image shows.
  // Issue: What if Image is not present at all? "hasImageError" stays false. Fallback hidden?
  // We need "hasImage" state.
  
  // Let's just fix the usage: If no src provided to AvatarImage, it likely triggers onError or we check props.
  
  // Simpler approach for this specific project:
  // Always render children.
  // AvatarImage: `display: none` if error.
  // AvatarFallback: `display: none` if NO error (and image present)?
  
  // Let's simplify: 
  // AvatarImage sets `hasError`.
  // AvatarFallback only renders if `hasError` is true (or image not present logic... hard).
  
  // Revised approach:
  // AvatarImage calls `setHasImageError(true)` on error.
  // AvatarFallback is visible ONLY if `hasImageError` is true.
  // Limitation: If image is just missing (no AvatarImage component), fallback won't show because hasImageError is false.
  
  // Correction: initialize `hasImageError` to true!
  // Then `AvatarImage` sets it to false `onLoad`.
  // If `onError`, sets it to true.
  
  // Let's try init to true. 
  // If <Avatar> <AvatarFallback>CN</AvatarFallback> </Avatar> -> Fallback shows (correct).
  // If <Avatar> <AvatarImage src="Valid" /> <AvatarFallback>CN</AvatarFallback> </Avatar> 
  // -> Init true. Fallback shows. Image loads -> set false -> Fallback hides. Image shows. 
  // Perfect.
  
  if (!hasImageError) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
