export const metadata = {
  title: "About — summa.vision",
  description: "What is summa.vision",
};

export default function AboutPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>About</h1>
      <p>
        <strong>summa.vision</strong> — это компактные, наглядные чарты по экономике, рынкам,
        технологиям и энергии. Мы стартуем как статический сайт без CMS и серверов, чтобы быстро
        проверить идеи и дизайн, а затем постепенно добавим поиск, CMS и автоматизацию.
      </p>
      <h3>Принципы</h3>
      <ul>
        <li>Две темы (светлая/тёмная), быстрый рендер графиков.</li>
        <li>Чёткие источники данных под каждым чартом.</li>
        <li>Минимум текста, максимум структуры.</li>
      </ul>
      <p>
        {"Если есть обратная связь или идеи партнёрства — пишите нам: "}
        <strong>hello@summa.vision</strong>.
      </p>
    </article>
  );
}
