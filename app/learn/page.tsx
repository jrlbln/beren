export default function LearnPage() {
  return (
    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/85 p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
        Phase 2
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Learn tab is reserved for the flip-card phase
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
        Phase 1 keeps this route in place so the tab navigation is complete,
        while the interactive learning deck will be implemented in the next
        phase.
      </p>
    </section>
  );
}
