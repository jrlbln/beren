"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/learn", label: "Learn" },
  { href: "/quiz", label: "Quiz" },
  { href: "/sheet", label: "Sheet" },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-slate-950"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
