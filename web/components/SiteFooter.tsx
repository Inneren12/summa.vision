
export default function SiteFooter() {
  return (
    <footer className="border-t mt-10">
      <div className="container py-6 text-sm opacity-80 flex items-center justify-between">
        <div>© {new Date().getFullYear()} summa.vision — static demo.</div>
        <div className="flex gap-3">
          <a href="https://summa.vision">summa.vision</a>
        </div>
      </div>
    </footer>
  );
}
