L910-Framework Лабораторная по Node.js фреймворку Сущности данных:

1. Пьесы (plays.json): id (string), title (string), duration (number), isClassic (boolean), premiereDate (string как Date), genres (array).
2. Представления (performances.json): id (string), playId (string), date (string как Date), seatsAvailable (number), isSoldOut (boolean), actors (array).

Роутинг: 
Plays

- GET /plays (все пьесы)
- GET /plays/:id (пьеса по id)
- POST /plays (создать новую пьесу)
- PUT /plays/:id (полная замена объекта)
- PATCH /plays/:id (частичное обновление)
- DELETE /plays/:id (удаление пьесы)

Performances

- GET /performances (все представления)
- GET /performances/:id (представление по id)
- POST /performances (создать новое)
- PUT /performances/:id (полная замена)
- PATCH /performances/:id (частичное обновление)
- DELETE /performances/:id (удаление)

ТАКЖЕ
- GET / -приветственная страница с описанием маршрутов
Особенности реализации

- Роутинг на основе простого класса App с методами .get(), .post() и т.д.
- Поддержка параметров :id
- Парсинг тела запроса через Streams
- Глобальный middleware (логирование запросов)
- Обработка ошибок (try/catch, 404, 500)
- Неидемпотентный PATCH
- Данные хранятся и изменяются в JSON-файлах
