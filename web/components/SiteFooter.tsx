export default function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container py-6 text-sm opacity-80 flex items-center justify-between">
        <div>© {new Date().getFullYear()} summa.vision</div>
        <div className="flex gap-3">
          <a className="underline" href="mailto:hello@summa.vision">
            Email
          </a>
          <a className="underline" href="https://x.com/summavision" target="_blank">
            X
          </a>
          <a className="underline" href="https://github.com/summa-vision" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
