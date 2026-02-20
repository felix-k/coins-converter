# Coins Converter

Форма расчёта обмена валют (RUB ↔ USDT), построенная на React + TypeScript. Двусторонний пересчёт через единый API-эндпоинт.

## Задача

Реализовать форму из двух симметричных input-компонентов с прогрессбаром, выполняющую пересчёт в обе стороны через один POST-запрос к API. Проект решает следующие подзадачи:

- **Респонсивная вёрстка** — колонка при 0–1000px, строка при 1000–1400px, с отступами от 1400px+
- **Валидация ввода** — ограничения min/max/step, автокоррекция до ближайшего допустимого значения (Decimal-арифметика через `decimal.js`)
- **Начальные условия** — левый input: min=10 000, max=70 000 000, step=100; правый: step=0.01, min/max/value вычисляются из `price` API
- **Прогрессбар** — кнопки 25%/50%/75%/100%, шкала отображает точное положение value между min и max
- **Rate limiting** — API блокирует при >1 req/s, реализован debounce
- **Автотесты** — тесты на корректность ввода, нормализацию, работу прогрессбара

## Стек

| Категория        | Технологии               |
| ---------------- | ------------------------ |
| Фреймворк        | React 19, TypeScript 5.9 |
| Сборка           | Vite 7                   |
| UI               | Material-UI 7, Emotion   |
| Числа            | decimal.js               |
| Валидация        | Zod 4                    |
| Тесты            | Vitest, Testing Library  |
| Менеджер пакетов | pnpm                     |

## Архитектура

Структура проекта следует принципам Feature-Sliced Design:

```
src/
├── app/            # Провайдеры, тема, точка входа приложения
├── shared/         # Переиспользуемые компоненты и утилиты
│   ├── lib/        # ErrorBoundary
│   └── ui/         # ThemeButton
└── widgets/        # Самостоятельные блоки UI
    ├── AppBar/
    └── Converter/  # Основной виджет конвертера
        └── CurrencyInput/  # Input-компонент с прогрессбаром
```

## API

```
POST /b2api/change/user/pair/calc
Header: serial = a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa

Request:  { pairId: 133, inAmount: number | null, outAmount: number | null }
Response: { inAmount, outAmount, isStraight, price: [string, string] }
```

В dev-режиме Vite проксирует `/b2api` → `https://awx.pro`.

## Запуск

```bash
pnpm install
pnpm dev        # Dev-сервер
pnpm test       # Тесты
pnpm build      # Продакшен-сборка
pnpm preview    # Превью сборки
pnpm lint       # ESLint
pnpm types      # Проверка типов
```
