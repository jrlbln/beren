import { LearnBootstrap } from "@/components/Learn/LearnBootstrap";
import { LearnDeck } from "@/components/Learn/LearnDeck";
import { getBaseRows } from "@/lib/kana";
import { notFound } from "next/navigation";

type LearnRowPageProps = {
  params: Promise<{ row: string }>;
};

export function generateStaticParams() {
  return getBaseRows().map((row) => ({ row: row.id }));
}

export default async function LearnRowPage({ params }: LearnRowPageProps) {
  const { row } = await params;
  const baseRows = getBaseRows();
  const currentRow = baseRows.find((entry) => entry.id === row);

  if (!currentRow || currentRow.characters.length === 0) {
    notFound();
  }

  return (
    <section className="flex h-full w-full flex-col overflow-hidden">
      <LearnBootstrap seedCharacters={currentRow.characters} />
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <LearnDeck rows={[currentRow]} />
      </div>
    </section>
  );
}
