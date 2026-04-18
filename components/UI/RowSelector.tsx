"use client";

import Link from "next/link";

type RowSelectorProps = {
  rows: Array<{
    id: string;
    label: string;
  }>;
  activeRow?: string;
};

export function RowSelector({ rows, activeRow }: RowSelectorProps) {
  return (
    <div className="mx-auto grid max-w-xl grid-cols-2 gap-3">
      {rows.map((row) => {
        const isActive = row.id === activeRow;

        return (
          <Link
            key={row.id}
            href={`/cards/${row.id}`}
            className={`rounded-2xl px-3 py-2.5 text-center text-sm font-semibold tracking-[0.18em] transition ${
              isActive
                ? "bg-slate-950 text-white shadow-sm"
                : "bg-white text-slate-600 shadow-sm hover:bg-amber-100 hover:text-slate-950"
            }`}
          >
            {row.label}
          </Link>
        );
      })}
    </div>
  );
}
