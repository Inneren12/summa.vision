
import { repo } from "../lib/content-snapshot";

export default async function SectionNav() {
  const sections = await repo.listSections();
  return (
    <nav className="flex gap-3 flex-wrap">
      {sections.map(s => (
        <a key={s.slug} href={`/sections/${s.slug}`} className="text-sm opacity-80 hover:opacity-100 underline">
          {s.title}
        </a>
      ))}
    </nav>
  );
}
