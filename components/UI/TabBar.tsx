"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/cards", label: "Cards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/table", label: "Table" },
];

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-4 z-30 mx-auto w-full max-w-384 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 rounded-[1.75rem] border border-slate-200/70 bg-white/85 px-4 py-3 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <Link
          href="/cards"
          className="flex items-center gap-3 rounded-full px-2 py-1.5 transition hover:bg-slate-950/5"
          aria-label="ベレン home"
        >
          <Image
            src="/BLN_LOGO_WHITE.svg"
            alt="ベレン logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            if (tab.href === "/cards") {
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => router.push(`/cards?reset=${Date.now()}`)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-amber-100 hover:text-slate-950"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-amber-100 hover:text-slate-950"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
