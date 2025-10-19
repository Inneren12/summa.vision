export const metadata = {
  title: "About — summa.vision",
  description: "What is summa.vision",
};

const principles = [
  "Две темы (светлая/тёмная), быстрый рендер графиков.",
  "Чёткие источники данных под каждым чартом.",
  "Минимум текста, максимум структуры.",
];

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold mt-6 mb-4">About</h1>
      <p className="my-3 leading-7 opacity-90">
        <strong>summa.vision</strong> — это компактные, наглядные чарты по экономике, рынкам,
        технологиям и энергии.
      </p>
      <p className="my-3 leading-7 opacity-90">
        Мы стартуем как статический сайт без CMS и серверов, чтобы быстро проверить идеи и дизайн, а
        затем постепенно добавим поиск, CMS и автоматизацию.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-3">Принципы</h3>
      <ul className="list-disc space-y-2 pl-6">
        {principles.map((principle) => (
          <li key={principle}>{principle}</li>
        ))}
      </ul>
      <p className="my-3 leading-7 opacity-90">
        Если есть обратная связь или идеи партнёрства — пишите нам:
        <strong className="ml-1">hello@summa.vision</strong>.
      </p>
    </div>
  );
}
