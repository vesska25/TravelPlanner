# Как применить редизайн Coastal

## ШАГ 0 — застраховаться (если ещё не сделал)
В папке проекта:
    git add -A
    git commit -m "working state before Coastal redesign"

## ШАГ 1 — скопировать файлы
Распакуй этот архив и скопируй содержимое папки `code-export/`
в свою папку `frontend/`, заменяя файлы. Перезапишутся:

  src/index.css
  src/lib/trip.js            (НОВЫЙ файл — создастся папка src/lib)
  src/Navbar.jsx
  src/components/CountrySelect.jsx
  src/pages/*.jsx            (все 6 страниц)

НЕ трогаются твои: api.js, App.jsx, ProtectedRoute.jsx, main.jsx
(они включены в архив идентичными — можно не копировать).

## ШАГ 2 — обновить index.html (ВРУЧНУЮ, не перезаписывать целиком!)
Открой свой frontend/index.html и добавь внутрь <head> эти строки
(шрифты + иконки Phosphor). Ничего своего не удаляй:

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" />
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />

## ШАГ 3 — запустить
    npm run dev

Новых npm-пакетов НЕ нужно (react-select и country-list уже стоят).
Иконки и флаги грузятся с CDN — нужен интернет.

## ШАГ 4 — проверить
- Логин/регистрация — светлые двухпанельные экраны
- Список поездок — карточки с флагами, фильтры по статусу
- Детали поездки — баннер с флагом, иконки категорий у мест
- Формы — светлый стиль, выбор страны через combobox
- Создание/редактирование/удаление поездок и мест работает

## Откат, если что-то не так
    git restore .
    git clean -fd
(вернёт к закоммиченному состоянию)
