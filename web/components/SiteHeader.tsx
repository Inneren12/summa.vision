
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SectionNav from "./SectionNav";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-semibold">summa.vision</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm opacity-90">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/media-kit">Media Kit</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <div className="container pb-3"><SectionNav /></div>
    </header>
  );
}
