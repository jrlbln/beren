export default function QuizPage() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Quiz
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        Practice mode is ready for the next phase
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
        The tab is in place so the navigation matches the product structure.
        Quiz flow, scoring, and session state can slot in here without changing the shell.
      </p>
    </section>
  );
}
