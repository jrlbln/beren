"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { appTabs } from "@/lib/lessons";

export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigateWithReset = (href: string) => {
    if (href === "/cards" || href === "/table" || href === "/quiz") {
      window.dispatchEvent(new CustomEvent("beren:reset-browser", { detail: { href } }));
    }

    router.push(href);
  };

  return (
    <header className="sticky top-4 z-30 mx-auto w-full max-w-6xl px-3 sm:px-4 lg:px-5">
      <div className="relative flex items-center rounded-[1.75rem] border border-slate-200/70 bg-white/85 px-4 py-3 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-5">
        <div className="flex shrink-0 items-center gap-3 rounded-full px-2 py-1.5">
          <Image
            src="/BLN_LOGO_WHITE.svg"
            alt="ベレン logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
        </div>

        <nav className="pointer-events-none absolute inset-x-0 flex justify-center gap-2 px-3 sm:gap-3">
          {appTabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);

            if (tab.href === "/cards") {
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => navigateWithReset("/cards")}
                  className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
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

            if (tab.href === "/table") {
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => navigateWithReset("/table")}
                  className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
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
              <button
                key={tab.href}
                type="button"
                onClick={() => navigateWithReset("/quiz")}
                className={`pointer-events-auto rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-amber-100 hover:text-slate-950"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
