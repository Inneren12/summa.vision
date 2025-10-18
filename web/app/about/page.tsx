export const metadata = {
  title: "About — summa.vision",
  description: "What is summa.vision",
};

export default function AboutPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-semibold mt-6 mb-4">About</h1>
      <p className="my-3 leading-7 opacity-90">
        <strong>summa.vision</strong> — это компактные, наглядные чарты по
        экономике, рынкам, технологиям и энергии. Мы стартуем как статический
        сайт без CMS и серверов, чтобы быстро проверить идеи и дизайн, а затем
        постепенно добавим поиск, CMS и автоматизацию.
      </p>
      <h3 className="text-2xl font-semibold mt-6 mb-3">Принципы</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li>Две темы (светлая/тёмная), быстрый рендер графиков.</li>
        <li>Чёткие источники данных под каждым чартом.</li>
        <li>Минимум текста, максимум структуры.</li>
      </ul>
      <p className="my-3 leading-7 opacity-90">
        Если есть обратная связь или идеи партнёрства — пишите нам:
        <strong> hello@summa.vision</strong>.
      </p>
    </div>
  );
}
