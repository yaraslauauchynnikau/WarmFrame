const http = require('http');
const url = require('url');
const fs = require('fs').promises;

class App {
  constructor() {
    this.routes = {}; // { method: { path: [handlers] } }
    this.middlewares = []; //глобальные middleware
  }

  //добавление глобального middleware
  use(handler) {
    this.middlewares.push(handler);
  }

  //методы для регистрации маршрутов
  get(path, ...handlers)    { this._addRoute('GET', path, handlers); }
  post(path, ...handlers)   { this._addRoute('POST', path, handlers); }
  put(path, ...handlers)    { this._addRoute('PUT', path, handlers); }
  patch(path, ...handlers)  { this._addRoute('PATCH', path, handlers); }
  delete(path, ...handlers) { this._addRoute('DELETE', path, handlers); }

  _addRoute(method, path, handlers) {
    if (!this.routes[method]) this.routes[method] = {};
    this.routes[method][path] = handlers;
  }

  //запуск сервера
  listen(port, callback) {
    const server = http.createServer(this._handleRequest.bind(this));
    server.listen(port, callback || (() => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    }));
  }

  async _handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname.replace(/\/$/, '') || '/';

    req.query = parsedUrl.query || {};
    req.params = {};
    req.body = await this._parseBody(req);

    res.status = function(code) {//методы ответа
      this.statusCode = code;
      return this;
    };

    res.json = function(data) {
      if (this.writableEnded) return;
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    };

    res.send = function(data) {
      if (this.writableEnded) return;
      this.setHeader('Content-Type', 'text/plain');
      this.end(String(data));
    };

    const method = req.method;

    console.log(`[${method}] ${pathname}`); //отладка

    let handlers = null;

    //поиск маршрута (точное совпадение или с :id)
    if (this.routes[method]) {
      for (const routePath in this.routes[method]) {
        if (this._matchRoute(routePath, pathname, req.params)) {
          handlers = this.routes[method][routePath];
          console.log(`Маршрут найден: ${routePath}`); //отладка
          break;
        }
      }
    }

    if (!handlers) {
      console.log(`Маршрут НЕ найден для ${method} ${pathname}`);
      res.status(404);
      res.json({ error: 'Not Found' });
      return;
    }

    const chain = [...this.middlewares, ...handlers];//middleware + обработчики маршрута
    let index = 0;

    const next = async (err) => {
      if (err) {
        console.error('Ошибка в обработчике:', err);
        if (!res.writableEnded) {
          res.status(500);
          res.json({ error: err.message || 'Internal Server Error' });
        }
        return;
      }

      if (index >= chain.length) return;

      const handler = chain[index++];
      try {
        await handler(req, res, next);
      } catch (e) {
        next(e);
      }
    };

    await next();
  }

  _matchRoute(routePath, actualPath, params) {  //сравнение маршрута с реальным путём
    const routeParts = routePath.split('/').filter(Boolean);
    const actualParts = actualPath.split('/').filter(Boolean);

    if (routeParts.length !== actualParts.length) return false;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return false;
      }
    }
    return true;
  }

  //парсинг тела запроса
  async _parseBody(req) {
    if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return {};

    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const trimmed = body.trim();
          resolve(trimmed ? JSON.parse(trimmed) : {});
        } catch (e) {
          console.error('Ошибка парсинга JSON:', e.message, 'Тело:', body);
          reject(new Error('Invalid JSON format'));
        }
      });
      req.on('error', reject);
    });
  }
}

const app = new App();//приложение

//логирование всех запросов (пример middleware)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} — ${new Date().toISOString()}`);
  next();
});


app.get('/plays', async (req, res) => {
  const data = await fs.readFile('plays.json', 'utf8');
  res.json(JSON.parse(data));
});

app.get('/plays/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('plays.json', 'utf8');
    const plays = JSON.parse(data);
    const play = plays.find(p => p.id === req.params.id);
    if (!play) throw new Error('Пьеса не найдена');
    res.json(play);
  } catch (err) {
    next(err);
  }
});

app.post('/plays', async (req, res) => {
  let body = req.body;

  //если тело пустое тогдп генерируем случайные данные
  if (Object.keys(body).length === 0) {
    body = {
      title: `Спектакль №${Math.floor(Math.random() * 1000)}`,
      duration: Math.floor(Math.random() * 180) + 60,
      isClassic: Math.random() > 0.5,
      premiereDate: new Date(Date.now() - Math.random() * 31536000000).toISOString().split('T')[0],
      genres: ['драма', 'комедия', 'трагедия'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  body.id = 'play' + Date.now();

  const data = await fs.readFile('plays.json', 'utf8');
  const plays = JSON.parse(data);
  plays.push(body);
  await fs.writeFile('plays.json', JSON.stringify(plays, null, 2));

  res.status(201).json(body);
});

app.put('/plays/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('plays.json', 'utf8');
    let plays = JSON.parse(data);
    const index = plays.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new Error('Пьеса не найдена');

    plays[index] = { id: req.params.id, ...req.body };
    await fs.writeFile('plays.json', JSON.stringify(plays, null, 2));
    res.json(plays[index]);
  } catch (err) {
    next(err);
  }
});

app.patch('/plays/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('plays.json', 'utf8');
    let plays = JSON.parse(data);
    const index = plays.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new Error('Пьеса не найдена');

    Object.assign(plays[index], req.body);

    //если передали  duration то каждый раз +10
    if ('duration' in req.body) {
      plays[index].duration = (plays[index].duration || 0) + 10;
    }

    await fs.writeFile('plays.json', JSON.stringify(plays, null, 2));
    res.json(plays[index]);
  } catch (err) {
    next(err);
  }
});

app.delete('/plays/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('plays.json', 'utf8');
    let plays = JSON.parse(data);
    const index = plays.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new Error('Пьеса не найдена');

    plays.splice(index, 1);
    await fs.writeFile('plays.json', JSON.stringify(plays, null, 2));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


app.get('/performances', async (req, res) => {
  const data = await fs.readFile('performances.json', 'utf8');
  res.json(JSON.parse(data));
});

app.get('/performances/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('performances.json', 'utf8');
    const items = JSON.parse(data);
    const item = items.find(i => i.id === req.params.id);
    if (!item) throw new Error('Представление не найдено');
    res.json(item);
  } catch (err) {
    next(err);
  }
});

app.post('/performances', async (req, res) => {
  let body = req.body;

  if (Object.keys(body).length === 0) {
    body = {
      playId: 'play' + Math.floor(Math.random() * 10 + 1),
      date: new Date(Date.now() + Math.random() * 2592000000).toISOString().slice(0, 16),
      seatsAvailable: Math.floor(Math.random() * 200) + 50,
      isSoldOut: Math.random() > 0.7,
      actors: ['Актёр A', 'Актёр B', 'Актёр C'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  body.id = 'perf' + Date.now();

  const data = await fs.readFile('performances.json', 'utf8');
  const items = JSON.parse(data);
  items.push(body);
  await fs.writeFile('performances.json', JSON.stringify(items, null, 2));

  res.status(201).json(body);
});

app.put('/performances/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('performances.json', 'utf8');
    let items = JSON.parse(data);
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) throw new Error('Представление не найдено');

    items[index] = { id: req.params.id, ...req.body };
    await fs.writeFile('performances.json', JSON.stringify(items, null, 2));
    res.json(items[index]);
  } catch (err) {
    next(err);
  }
});

app.patch('/performances/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('performances.json', 'utf8');
    let items = JSON.parse(data);
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) throw new Error('Представление не найдено');

    Object.assign(items[index], req.body);

    //если передали seatsAvailable то  каждый раз -1 место
    if ('seatsAvailable' in req.body) {
      items[index].seatsAvailable = Math.max(0, (items[index].seatsAvailable || 0) - 1);
    }

    await fs.writeFile('performances.json', JSON.stringify(items, null, 2));
    res.json(items[index]);
  } catch (err) {
    next(err);
  }
});

app.delete('/performances/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile('performances.json', 'utf8');
    let items = JSON.parse(data);
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) throw new Error('Представление не найдено');

    items.splice(index, 1);
    await fs.writeFile('performances.json', JSON.stringify(items, null, 2));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//приветственная страничка
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.writeHead(200);//явно указываем статус
  res.write(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Театральная афиша</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2c3e50; }
        ul { padding-left: 20px; }
        a { color: #2980b9; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Театральная афиша (даже с оформлением каким никаким)</h1>
      <p>Доступные маршруты:</p>
      <ul>
        <li><a href="/plays">Все пьесы (/plays)</a></li>
        <li><a href="/performances">Все представления (/performances)</a></li>
        <li>Пример: <a href="/plays/play1">Гамлет (/plays/play1)</a></li>
      </ul>
    </body>
    </html>
  `);
  res.end();//явно завершаем ответ
});

app.listen(3000);