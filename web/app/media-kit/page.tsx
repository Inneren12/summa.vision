export const metadata = { title: "Media Kit — summa.vision", description: "Brand assets and contacts" };

export default function MediaKitPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Media Kit</h1>
      <p className="opacity-80">
        Логотипы, палитры и примеры материалов для упоминаний. Для партнёрств и рекламы — пишите на email.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">Logo (dark)</div>
        <div className="card">Logo (light)</div>
        <div className="card">Palette</div>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Contacts</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: <a className="underline" href="mailto:hello@summa.vision">hello@summa.vision</a></li>
          <li>X / Twitter: <a className="underline" href="https://x.com/summavision" target="_blank">/summavision</a></li>
          <li>GitHub: <a className="underline" href="https://github.com/summa-vision" target="_blank">summa-vision</a></li>
        </ul>
      </div>
    </div>
  );
}
