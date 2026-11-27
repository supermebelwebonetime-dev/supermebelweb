# SuperMebelWeb

Сайт мебели на заказ в Шымкенте. React + TypeScript + Vite, русский и казахский (`/` и `/kk`), Supabase (аккаунты, заявки, каталог), Netlify Functions.

## Запуск локально

```bash
npm install
cp .env.example .env   # заполните VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

## Переменные окружения

В браузер попадают только переменные с префиксом `VITE_` — в них нельзя хранить секреты.

| Переменная | Где | Назначение |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | сайт | адрес проекта Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | сайт | публичный ключ (publishable / anon) |
| `VITE_WHATSAPP_PHONE` | сайт | запасной номер; основной хранится в `site_settings` |
| `SUPABASE_URL` | функции | адрес проекта Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | функции | секретный ключ, только на Netlify |
| `INQUIRY_SALT` | функции | длинная случайная строка для хеширования IP |
| `SITE_URL` | функции | адрес сайта, например `https://name.netlify.app` |
| `GEMINI_API_KEY` | функции | ключ Gemini (для ИИ-чата) |

## Публикация на Netlify

- Build command: `npm run build`, publish directory: `dist`.
- Добавьте переменные из таблицы в Site configuration → Environment variables.
- После сборки скрипт `scripts/seo.mjs` создаёт `sitemap.xml` и `robots.txt` для адреса сайта.

## Supabase Auth

В Authentication → URL Configuration укажите Site URL и добавьте в Redirect URLs адреса сайта: `/login`, `/reset`, `/account` (и версии с `/kk`).

## Что готово

Главная, каталог и страницы направлений, о компании, контакты, политика, страница благодарности, 404, регистрация и вход, восстановление пароля, личный кабинет, сохранение заявок через `/api/inquiry` с ограничением частоты.

Ещё не сделано: админ-панель, ИИ-чат, чат с администратором, 3D-просмотр.
