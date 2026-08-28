# Hypothesis Stress Test — landing site

Интерактивный лендинг open-source фреймворка [Hypothesis Stress Test](https://github.com/SergeyNash/hypothesis-stress-test).

Сайт показывает метод через анимированный конвейер: сырая продуктовая гипотеза проходит через роли, внутренние данные, бизнес-контекст, рынок и синтез. На выходе команда получает уточнённую формулировку, решение и план следующей проверки.

**Live:** https://hypothesis-stress-test.nashquick.chatgpt.site

## Что внутри

- интерактивный конвейер из пяти этапов;
- автоматический прогон с возможностью открыть любой этап вручную;
- динамические сигналы, лог анализа и мини-диаграмма;
- наглядное сравнение «было → стало»;
- адаптивная версия для мобильных устройств.

## Локальный запуск

Требуется Node.js 22.13 или новее.

Версия для Sites:

```bash
npm ci
npm run dev
```

Production build для Sites:

```bash
npm run build
```

## Деплой на Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSergeyNash%2Fhypothesis-stress-test-site)

Импортируйте репозиторий `SergeyNash/hypothesis-stress-test-site` в Vercel и нажмите **Deploy**. Файл `vercel.json` уже выбирает Next.js, устанавливает зависимости через `npm ci` и запускает отдельную Vercel-сборку:

```bash
npm run build:vercel
```

Локально Vercel-версию можно запустить командами `npm run dev:vercel` и `npm run start:vercel`. Обычные команды `npm run dev` и `npm run build` сохранены для текущего деплоя в Sites.

## Структура

- `app/page.tsx` — контент и логика интерактивного конвейера;
- `app/globals.css` — визуальная система и анимации;
- `app/layout.tsx` — метаданные страницы;
- `vercel.json` — конфигурация деплоя на Vercel;
- `.openai/hosting.json` — связь с опубликованным проектом Sites.

## Автор

Сергей Синяков — product leader и автор Hypothesis Stress Test.
