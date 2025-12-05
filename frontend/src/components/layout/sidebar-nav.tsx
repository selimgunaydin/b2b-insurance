"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  variant?: "default" | "ghost";
  items?: {
    title: string;
    href: string;
    icon?: LucideIcon;
  }[];
  label?: string; // For badges like unread count
}

interface NavProps {
  isCollapsed: boolean;
  links: {
    groupLabel?: string;
    items: NavItem[];
  }[];
  onLinkClick?: () => void;
}

export function SidebarNav({ isCollapsed, links, onLinkClick }: NavProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-1 py-2">
              {!isCollapsed && group.groupLabel && (
                <div className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
                  {group.groupLabel}
                </div>
              )}
              {group.items.map((link, index) =>
                link.items ? (
                  <SidebarCollapsible
                    key={index}
                    link={link}
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                    onLinkClick={onLinkClick}
                  />
                ) : (
                  <SidebarLink
                    key={index}
                    link={link}
                    isCollapsed={isCollapsed}
                    pathname={pathname}
                    onLinkClick={onLinkClick}
                  />
                )
              )}
            </div>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}

function SidebarLink({
  link,
  isCollapsed,
  pathname,
  onLinkClick,
}: {
  link: NavItem;
  isCollapsed: boolean;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const isActive = link.href === pathname;

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={link.href!}
            onClick={onLinkClick}
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground",
              isActive && "bg-muted text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className="sr-only">{link.title}</span>
            {link.label && (
               <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {link.title}
          {link.label && (
            <span className="ml-auto text-muted-foreground">
              {link.label}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={link.href!}
      onClick={onLinkClick}
      className={cn(
        "group flex h-9 items-center justify-between rounded-md px-3 text-sm font-medium hover:bg-muted/50 transition-colors",
        isActive && "bg-muted text-foreground font-semibold"
      )}
    >
      <div className="flex items-center gap-3">
        <link.icon className="h-4 w-4" />
        {link.title}
      </div>
      {link.label && (
        <span className={cn(
          "ml-auto text-xs rounded-full px-1.5 py-0.5",
           "bg-red-600 text-white font-bold"
        )}>
          {link.label}
        </span>
      )}
    </Link>
  );
}

function SidebarCollapsible({
  link,
  isCollapsed,
  pathname,
  onLinkClick,
}: {
  link: NavItem;
  isCollapsed: boolean;
  pathname: string;
  onLinkClick?: () => void;
}) {
  const isOpen = link.items?.some((item) => item.href === pathname);
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
    }
  }, [isOpen]);

  if (isCollapsed) {
    // Determine if any child is active to highlight the parent icon
    const isChildActive = link.items?.some(item => item.href === pathname);
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground cursor-pointer",
              isChildActive && "bg-muted text-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            <span className="sr-only">{link.title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex flex-col gap-1 p-2">
            <p className="font-semibold text-xs mb-1 px-2">{link.title}</p>
            {link.items?.map((subItem, idx) => (
                <Link 
                    key={idx} 
                    href={subItem.href}
                    onClick={onLinkClick}
                    className={cn(
                        "text-sm px-2 py-1 rounded hover:bg-accent",
                        pathname === subItem.href && "bg-accent"
                    )}
                >
                    {subItem.title}
                </Link>
            ))}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group w-full justify-between h-9 px-3 hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <link.icon className="h-4 w-4" />
            {link.title}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-9 pr-2 py-1 space-y-1">
        {link.items?.map((subItem, index) => (
          <Link
            key={index}
            href={subItem.href}
            onClick={onLinkClick}
            className={cn(
              "block py-1.5 px-2 text-sm rounded-md transition-colors hover:bg-muted/50",
              subItem.href === pathname && "bg-muted text-foreground font-medium"
            )}
          >
             <div className="flex items-center gap-2">
                 {/* Only show icon if subitem has one, otherwise maybe a dot? */}
                 {subItem.icon && <subItem.icon className="h-3 w-3" />}
                 {subItem.title}
             </div>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
