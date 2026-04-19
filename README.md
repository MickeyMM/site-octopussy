# Octosystem.io

Лендинг AI-экосистемы продаж на высокий чек. Эстетика — **Dark Premium / Surveillance AI OS**: сайт-приборная панель, а не лендинг коуча.

## Запуск

Это статический сайт без сборки. Открой `index.html` через локальный сервер (CSS использует `@import` и ES-modules в JS, так что `file://` не сработает).

```bash
# Вариант 1 — Python
python -m http.server 8000

# Вариант 2 — Node
npx serve .

# Вариант 3 — VS Code
# Расширение "Live Server" → правый клик на index.html → Open with Live Server
```

Затем открой http://localhost:8000

## Структура

```
SiteOctopussy/
├── index.html                    # Разметка всех 6 блоков
├── assets/
│   ├── fonts/                    # Локальные шрифты (сейчас подгружаются из Google Fonts)
│   ├── icons/                    # SVG-иконки
│   ├── images/
│   │   └── octopus.svg           # Standalone-версия осьминога
│   └── videos/                   # VSL и прочие видео
├── css/
│   ├── main.css                  # Entry point (только @import)
│   ├── variables.css             # Design tokens — цвета, шрифты, размеры
│   ├── reset.css                 # CSS reset
│   ├── typography.css            # Шрифты, иерархия текста
│   ├── base.css                  # Body, grain, ambient glow, section__head
│   ├── animations.css            # @keyframes
│   ├── components/
│   │   ├── system-bar.css        # Верхняя OS-панель
│   │   ├── buttons.css           # .btn, .btn--primary, .btn--ghost
│   │   ├── cards.css             # Glass-карточки (diag-card, intel-card)
│   │   ├── octopus.css           # Осьминог + VSL-плеер
│   │   ├── floating-cta.css      # Плавающая кнопка
│   │   └── decorative.css        # Уголки рамок, разделители
│   └── sections/
│       ├── hero.css
│       ├── diagnosis.css
│       ├── capture.css
│       ├── intelligence.css
│       ├── authority.css
│       ├── final-cta.css
│       └── footer.css
└── js/
    ├── main.js                   # Entry — импортирует все модули
    └── modules/
        ├── octopus-interactions.js   # Глаза следят за мышью
        ├── scroll-effects.js         # Parallax осьминога + орбов
        ├── floating-cta.js           # Показ/скрытие плавающей кнопки
        ├── reveal.js                 # Reveal секций при скролле
        └── counters.js               # Анимация счётчиков
```

## Дизайн-система

**Цвета** (variables.css):
- Фон: `#0A0A0B` → `#101012` (глубокий антрацит)
- Акцент: градиент `#E8B4A0` → `#D4A574` → `#8C5F3A` (розовое золото → бронза)
- Текст: `#F5F0E8` (тёплый off-white)

**Шрифты:**
- `Unbounded` — display / заголовки (геометричный, премиум)
- `Space Grotesk` — UI / подзаголовки
- `JetBrains Mono` — data / моно-вставки («код-вайб»)

**Эффекты:**
- Glassmorphism: `backdrop-filter: blur(22px)` + золотая обводка 1px
- Grain: SVG fractalNoise overlay с `mix-blend-mode: overlay`
- Glow: многослойные box-shadow вокруг акцентов
- Анимации осьминога: breathe (CSS) + parallax + mouse-follow (JS)

## Блоки

1. **Hero** — VSL-видео в «золотой» рамке + осьминог за ним, CTA, счётчики метрик
2. **Diagnosis** — 2 карточки с диагнозом проблемы
3. **Octo Capture** — 3 фичи-строки
4. **Octo Intelligence** — 3 карточки модулей AI (центральная выделена)
5. **Authority** — про команду Octo Group, статистика
6. **Final CTA** — финальная конверсия

Плавающая кнопка CTA появляется после скролла hero и прячется на финальной CTA-секции.
