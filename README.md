# Summa.Vision

Визуальные истории и инфографика (в духе Visual Capitalism). Данные → JSON → графики (Vega-Lite) → MDX страницы (Next.js).

## Быстрый старт
- Node.js 20 (`.nvmrc`): `nvm use`  
- Перейди в `web/` и запусти:
```bash
cd web
npm install
npm run dev
```

Структура
content/   # datasets и chart-спеки (JSON/MDX)
core/      # общий код: UI/утилиты/схемы
web/       # Next.js приложение (App Router)

Скрипты (рекомендуется добавить в package.json)

npm run lint — ESLint

npm run format — Prettier

npm test — Jest + RTL

Лицензия

MIT — см. LICENSE.
