const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = 3000;

// Вспомогательные функции
async function loadJSON(filename) {
  try {
    const data = await fs.readFile(path.join(__dirname, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return { [filename.replace('.json', '')]: [] };
  }
}

async function saveJSON(filename, data) {
  try {
    await fs.writeFile(
      path.join(__dirname, filename),
      JSON.stringify(data, null, 2)
    );
    return true;
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
    return false;
  }
}

// Генератор случайных данных
function generateRandomData(type) {
  const firstNames = ['Александр', 'Дмитрий', 'Максим', 'Артём', 'Иван', 'Кирилл', 'Михаил', 'Никита', 'Матвей', 'Андрей', 'Мария', 'Анна', 'Екатерина', 'Ольга', 'Елена', 'Наталья', 'Татьяна', 'Ирина', 'Светлана', 'Юлия'];
  const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Попов', 'Васильев', 'Смирнов', 'Новиков', 'Фёдоров', 'Морозов'];
  const specializations = ['кардио', 'силовые', 'йога', 'пилатес', 'стрейчинг', 'кроссфит', 'бокс', 'плавание', 'аэробика', 'танцы'];
  const goals = ['похудеть', 'набрать массу', 'улучшить выносливость', 'увеличить силу', 'подготовка к соревнованиям', 'реабилитация', 'общее здоровье', 'снять стресс'];
  
  if (type === 'trainer') {
    const trainerSpecs = [...new Set(Array.from({length: Math.floor(Math.random() * 3) + 1}, () => 
      specializations[Math.floor(Math.random() * specializations.length)]
    ))];
    
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      age: Math.floor(Math.random() * 25) + 25,
      specialization: trainerSpecs,
      isActive: Math.random() > 0.3,
      hireDate: new Date(Date.now() - Math.random() * 365 * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      experienceYears: Math.floor(Math.random() * 15) + 1,
      clientsCount: Math.floor(Math.random() * 50)
    };
  } else if (type === 'client') {
    const clientGoals = [...new Set(Array.from({length: Math.floor(Math.random() * 3) + 1}, () => 
      goals[Math.floor(Math.random() * goals.length)]
    ))];
    
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      age: Math.floor(Math.random() * 40) + 18,
      subscriptionActive: Math.random() > 0.4,
      registrationDate: new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: clientGoals,
      weight: Math.floor(Math.random() * 60) + 50,
      height: Math.floor(Math.random() * 40) + 150,
      trainerId: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null
    };
  }
}

// Парсер тела запроса
async function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });
    
    req.on('error', reject);
  });
}

// Обработчик ошибок
function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ 
    error: true, 
    message: message,
    timestamp: new Date().toISOString()
  }));
}

// Обработчик успешного ответа
function sendSuccess(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Создание HTTP сервера
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Главная страница
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <head>
          <title>Gym Management API</title>
        </head>
        <body>
          <h1>🏋️‍♂️ Gym Management API</h1>
          <p>Доступные эндпоинты:</p>
          <ul>
            <li><a href="/api/trainers">GET /api/trainers</a> - все тренеры</li>
            <li><a href="/api/clients">GET /api/clients</a> - все клиенты</li>
          </ul>
        </body>
      </html>
    `);
    return;
  }

  try {
    // ========== TRAINERS ROUTES ==========
    
    // GET /api/trainers - все тренеры
    if (pathname === '/api/trainers' && req.method === 'GET') {
      const data = await loadJSON('trainers.json');
      let trainers = data.trainers || data;
      
      // Фильтрация
      if (query.active === 'true') trainers = trainers.filter(t => t.isActive === true);
      if (query.active === 'false') trainers = trainers.filter(t => t.isActive === false);
      if (query.specialization) {
        trainers = trainers.filter(t => 
          Array.isArray(t.specialization) && 
          t.specialization.includes(query.specialization)
        );
      }
      if (query.minExperience) {
        trainers = trainers.filter(t => t.experienceYears >= parseInt(query.minExperience));
      }
      
      sendSuccess(res, trainers);
      return;
    }
    
    // GET /api/trainers/:id - тренер по ID
    if (pathname.startsWith('/api/trainers/') && req.method === 'GET') {
      const id = parseInt(pathname.split('/')[3]);
      const data = await loadJSON('trainers.json');
      const trainers = data.trainers || data;
      
      const trainer = trainers.find(t => t.id === id);
      if (!trainer) return sendError(res, 404, `Trainer with id ${id} not found`);
      
      sendSuccess(res, trainer);
      return;
    }
    
    // POST /api/trainers - создать тренера
    if (pathname === '/api/trainers' && req.method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('trainers.json');
        const trainers = data.trainers || data;
        
        let newTrainer;
        
        if (Object.keys(body).length === 0) {
          // Генерация случайных данных
          newTrainer = generateRandomData('trainer');
        } else {
          // Использование данных из тела
          newTrainer = {
            id: body.id || Date.now(),
            name: body.name || 'Новый тренер',
            age: body.age || 30,
            specialization: Array.isArray(body.specialization) ? body.specialization : ['общая подготовка'],
            isActive: body.isActive !== undefined ? body.isActive : true,
            hireDate: body.hireDate || new Date().toISOString().split('T')[0],
            experienceYears: body.experienceYears || 1,
            clientsCount: body.clientsCount || 0
          };
        }
        
        trainers.push(newTrainer);
        const saved = await saveJSON('trainers.json', { trainers: trainers });
        if (!saved) return sendError(res, 500, 'Failed to save trainer');
        
        sendSuccess(res, newTrainer, 201);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // PUT /api/trainers/:id - заменить тренера
    if (pathname.startsWith('/api/trainers/') && req.method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('trainers.json');
        const trainers = data.trainers || data;
        
        const index = trainers.findIndex(t => t.id === id);
        if (index === -1) return sendError(res, 404, `Trainer with id ${id} not found`);
        
        if (Object.keys(body).length === 0) {
          // Генерация случайных данных
          trainers[index] = generateRandomData('trainer');
          trainers[index].id = id; // Сохраняем оригинальный ID
        } else {
          // Полная замена
          trainers[index] = {
            id: id,
            name: body.name || trainers[index].name,
            age: body.age || trainers[index].age,
            specialization: Array.isArray(body.specialization) ? body.specialization : trainers[index].specialization,
            isActive: body.isActive !== undefined ? body.isActive : trainers[index].isActive,
            hireDate: body.hireDate || trainers[index].hireDate,
            experienceYears: body.experienceYears || trainers[index].experienceYears,
            clientsCount: body.clientsCount || trainers[index].clientsCount
          };
        }
        
        const saved = await saveJSON('trainers.json', { trainers: trainers });
        if (!saved) return sendError(res, 500, 'Failed to update trainer');
        
        sendSuccess(res, trainers[index]);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // PATCH /api/trainers/:id - частично обновить тренера
    if (pathname.startsWith('/api/trainers/') && req.method === 'PATCH') {
      const id = parseInt(pathname.split('/')[3]);
      
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('trainers.json');
        const trainers = data.trainers || data;
        
        const index = trainers.findIndex(t => t.id === id);
        if (index === -1) return sendError(res, 404, `Trainer with id ${id} not found`);
        
        // Частичное обновление
        const updatedTrainer = {
          ...trainers[index],
          ...body,
          id: id // ID не меняем
        };
        
        // Обработка специализаций
        if (body.specialization && Array.isArray(body.specialization)) {
          updatedTrainer.specialization = [...new Set([...trainers[index].specialization, ...body.specialization])];
        }
        
        trainers[index] = updatedTrainer;
        const saved = await saveJSON('trainers.json', { trainers: trainers });
        if (!saved) return sendError(res, 500, 'Failed to update trainer');
        
        // Неидемпотентная часть: добавляем служебные поля
        const responseData = {
          ...updatedTrainer,
          updatedAt: new Date().toISOString(),
          updateCount: (trainers[index].updateCount || 0) + 1,
          lastModifiedBy: 'system'
        };
        
        sendSuccess(res, responseData);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // DELETE /api/trainers/:id - удалить тренера
    if (pathname.startsWith('/api/trainers/') && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3]);
      
      const data = await loadJSON('trainers.json');
      const trainers = data.trainers || data;
      
      const initialLength = trainers.length;
      const filteredTrainers = trainers.filter(t => t.id !== id);
      
      if (filteredTrainers.length === initialLength) {
        return sendError(res, 404, `Trainer with id ${id} not found`);
      }
      
      const saved = await saveJSON('trainers.json', { trainers: filteredTrainers });
      if (!saved) return sendError(res, 500, 'Failed to delete trainer');
      
      sendSuccess(res, { 
        success: true, 
        message: `Trainer with id ${id} deleted successfully`,
        deletedAt: new Date().toISOString(),
        remainingTrainers: filteredTrainers.length
      });
      return;
    }
    
    // ========== CLIENTS ROUTES ==========
    
    // GET /api/clients - все клиенты
    if (pathname === '/api/clients' && req.method === 'GET') {
      const data = await loadJSON('clients.json');
      let clients = data.clients || data;
      
      // Фильтрация
      if (query.active === 'true') clients = clients.filter(c => c.subscriptionActive === true);
      if (query.active === 'false') clients = clients.filter(c => c.subscriptionActive === false);
      if (query.trainerId) clients = clients.filter(c => c.trainerId == query.trainerId);
      if (query.goal) {
        clients = clients.filter(c => 
          Array.isArray(c.goals) && 
          c.goals.includes(query.goal)
        );
      }
      if (query.minAge) clients = clients.filter(c => c.age >= parseInt(query.minAge));
      if (query.maxAge) clients = clients.filter(c => c.age <= parseInt(query.maxAge));
      if (query.minWeight) clients = clients.filter(c => c.weight >= parseFloat(query.minWeight));
      if (query.maxWeight) clients = clients.filter(c => c.weight <= parseFloat(query.maxWeight));
      
      sendSuccess(res, clients);
      return;
    }
    
    // GET /api/clients/:id - клиент по ID
    if (pathname.startsWith('/api/clients/') && req.method === 'GET') {
      const id = parseInt(pathname.split('/')[3]);
      const data = await loadJSON('clients.json');
      const clients = data.clients || data;
      
      const client = clients.find(c => c.id === id);
      if (!client) return sendError(res, 404, `Client with id ${id} not found`);
      
      sendSuccess(res, client);
      return;
    }
    
    // POST /api/clients - создать клиента
    if (pathname === '/api/clients' && req.method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('clients.json');
        const clients = data.clients || data;
        
        let newClient;
        
        if (Object.keys(body).length === 0) {
          // Генерация случайных данных
          newClient = generateRandomData('client');
        } else {
          // Использование данных из тела
          newClient = {
            id: body.id || Date.now(),
            name: body.name || 'Новый клиент',
            age: body.age || 25,
            subscriptionActive: body.subscriptionActive !== undefined ? body.subscriptionActive : true,
            registrationDate: body.registrationDate || new Date().toISOString().split('T')[0],
            goals: Array.isArray(body.goals) ? body.goals : ['улучшить здоровье'],
            weight: body.weight || 70,
            height: body.height || 175,
            trainerId: body.trainerId || null
          };
        }
        
        clients.push(newClient);
        const saved = await saveJSON('clients.json', { clients: clients });
        if (!saved) return sendError(res, 500, 'Failed to save client');
        
        sendSuccess(res, newClient, 201);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // PUT /api/clients/:id - заменить клиента
    if (pathname.startsWith('/api/clients/') && req.method === 'PUT') {
      const id = parseInt(pathname.split('/')[3]);
      
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('clients.json');
        const clients = data.clients || data;
        
        const index = clients.findIndex(c => c.id === id);
        if (index === -1) return sendError(res, 404, `Client with id ${id} not found`);
        
        if (Object.keys(body).length === 0) {
          // Генерация случайных данных
          clients[index] = generateRandomData('client');
          clients[index].id = id;
        } else {
          // Полная замена
          clients[index] = {
            id: id,
            name: body.name || clients[index].name,
            age: body.age || clients[index].age,
            subscriptionActive: body.subscriptionActive !== undefined ? body.subscriptionActive : clients[index].subscriptionActive,
            registrationDate: body.registrationDate || clients[index].registrationDate,
            goals: Array.isArray(body.goals) ? body.goals : clients[index].goals,
            weight: body.weight || clients[index].weight,
            height: body.height || clients[index].height,
            trainerId: body.trainerId !== undefined ? body.trainerId : clients[index].trainerId
          };
        }
        
        const saved = await saveJSON('clients.json', { clients: clients });
        if (!saved) return sendError(res, 500, 'Failed to update client');
        
        sendSuccess(res, clients[index]);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // PATCH /api/clients/:id - частично обновить клиента
    if (pathname.startsWith('/api/clients/') && req.method === 'PATCH') {
      const id = parseInt(pathname.split('/')[3]);
      
      try {
        const body = await parseRequestBody(req);
        const data = await loadJSON('clients.json');
        const clients = data.clients || data;
        
        const index = clients.findIndex(c => c.id === id);
        if (index === -1) return sendError(res, 404, `Client with id ${id} not found`);
        
        // Частичное обновление
        const updatedClient = {
          ...clients[index],
          ...body,
          id: id
        };
        
        // Обработка целей
        if (body.goals && Array.isArray(body.goals)) {
          updatedClient.goals = [...new Set([...clients[index].goals, ...body.goals])];
        }
        
        clients[index] = updatedClient;
        const saved = await saveJSON('clients.json', { clients: clients });
        if (!saved) return sendError(res, 500, 'Failed to update client');
        
        // Неидемпотентная часть
        const responseData = {
          ...updatedClient,
          updatedAt: new Date().toISOString(),
          lastVisit: new Date().toISOString().split('T')[0],
          visitsCount: (clients[index].visitsCount || 0) + 1,
          bmi: ((updatedClient.weight / ((updatedClient.height || 170) / 100) ** 2)).toFixed(2)
        };
        
        sendSuccess(res, responseData);
      } catch (error) {
        sendError(res, 400, error.message);
      }
      return;
    }
    
    // DELETE /api/clients/:id - удалить клиента
    if (pathname.startsWith('/api/clients/') && req.method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3]);
      
      const data = await loadJSON('clients.json');
      const clients = data.clients || data;
      
      const initialLength = clients.length;
      const filteredClients = clients.filter(c => c.id !== id);
      
      if (filteredClients.length === initialLength) {
        return sendError(res, 404, `Client with id ${id} not found`);
      }
      
      const saved = await saveJSON('clients.json', { clients: filteredClients });
      if (!saved) return sendError(res, 500, 'Failed to delete client');
      
      sendSuccess(res, { 
        success: true, 
        message: `Client with id ${id} deleted successfully`,
        deletedAt: new Date().toISOString(),
        remainingClients: filteredClients.length
      });
      return;
    }
    
    // Если маршрут не найден
    sendError(res, 404, 'Route not found. Available routes: /api/trainers, /api/clients');
    
  } catch (error) {
    console.error('Server error:', error);
    sendError(res, 500, 'Internal server error: ' + error.message);
  }
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});