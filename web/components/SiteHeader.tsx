import Image from "next/image";
import Link from "next/link";

import SectionNav from "./SectionNav";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="site-logo" aria-label="summa.vision — home">
            <Image
              src="/logo-light.png"
              width={180}
              height={36}
              alt="Summa.Vision"
              className="logo-light"
              priority
            />
            <Image
              src="/logo-dark.png"
              width={180}
              height={36}
              alt=""
              aria-hidden="true"
              className="logo-dark"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm opacity-90">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/media-kit">Media Kit</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <div className="container pb-3">
        <SectionNav />
      </div>
    </header>
  );
}
