# 1in8b-mobile — мобильная адаптация

> Оболочка-адаптер поверх оригинала **1in8b.life** (172 страны, данные ООН/ВБ/ВОЗ). Механика и статистика не переписывались — только мобильные патчи.

**Демо:** `index.html` → встраивает оригинал `https://1in8b.life/ru/` в адаптивный фрейм. Если X-Frame/CSP блокирует встройку — кнопка «Открыть оригинал» + офлайн-заглушка остаётся.

## Почему это адаптация, а не «с нуля»

В репо изначально был только `README.md` — кода игры не было. Источник правды — публичная игра 1in8b.life (бета v0.8.77, авторы — независимый проект, данные UN WPP 2024, WHO, WDI и др.).

Наш репо **не содержит форка логики**, только:

- `index.html` — мобильный shell с `iframe` на оригинал
- `css/adapter.css` — оверрайды: вьюпорт, safe-area, тачи, типографика
- `js/adapter.js` — детект загрузки, haptics, PWA install, попытка инжекта viewport в same-origin
- `manifest.json` / `sw.js` — только для оболочки (оригинал не кэшируем из-за CORS)
- `js/local-adaptation/` — сохранённая копия данных 172 стран как фолбэк для офлайна, помечена как *адаптация данных оригинала*

## Что патчит адаптер

### Вьюпорт и safe-area
- `viewport-fit=cover` + `env(safe-area-inset-*)` для выреза и жестовой полосы
- `100dvh/100svh` вместо `100vh`, `interactive-widget=resizes-content`
- `overscroll-behavior: contain` — нет pull-to-refresh на игровом поле

### Тачи
- `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent`
- Кнопки ≥48px, `min-height` для всех контролов
- `navigator.vibrate` на клики (с фолбэком на iOS)
- Ландшафт-заглушка: просит портрет

### PWA/офлайн
- `display: standalone`, `orientation: portrait-primary`, `theme-color` под тему
- `sw.js` кэширует только shell; при оффлайне показывает фолбэк-карточку с линком

### Доступность
- Оригинальный контент не трогаем
- Фокус-стили, 16px в input (без зума iOS), `rel=noopener` на внешних ссылках

## Файлы
```
index.html            — shell + iframe на 1in8b.life/ru
css/adapter.css       — мобильные оверрайды (патчи)
js/adapter.js         — логика shell, детект X-Frame, install prompt
js/local-adaptation/  — фолбэк-данные (172 страны) на случай блока/оффлайна
manifest.json / sw.js — PWA только для оболочки
```

## Локальный запуск
```bash
python3 -m http.server 8000
# открой http://localhost:8000 на телефоне
```

Для GitHub Pages: Settings → Pages → Branch `arena/…` → `/ (root)`.

## Attribution
Оригинал: https://1in8b.life — данные UN, World Bank, WHO, UNESCO и др. (лицензии CC BY 3.0 IGO / CC BY 4.0, см. оригинал). Адаптация — только мобильные правки, без изменения баланса/механики.
