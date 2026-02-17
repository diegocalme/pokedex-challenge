"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Backpack, User } from "lucide-react";
import type { ComponentType } from "react";

interface Tab {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { href: "/", label: "Pokédex", icon: BookOpen },
  { href: "/collection", label: "Collection", icon: Backpack },
];

const TabBar = memo(function TabBar() {
  const pathname = usePathname();

  const renderedTabs = useMemo(
    () =>
      TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? "text-red-500" : "text-zinc-400"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </Link>
        );
      }),
    [pathname]
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-zinc-100 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {renderedTabs}
    </nav>
  );
});

export { TabBar };
