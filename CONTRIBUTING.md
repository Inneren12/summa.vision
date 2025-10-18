# Вклад в Summa.Vision

1) Форк → ветка от `main` (`feat/...`/`fix/...`).  
2) `npm run lint && npm test` перед PR.  
3) Открой PR по шаблону. Один PR — одна логическая задача.

## Код-стайл
- TypeScript strict, ESLint без предупреждений.
- Prettier форматирует код (не правим вручную).
- Импорты сортируются авто (simple-import-sort).

## Тесты
- Jest + React Testing Library.
- Для графиков — юнит-тесты сборщика spec; E2E позже (Playwright).
