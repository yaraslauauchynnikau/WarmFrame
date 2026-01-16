const App = require('./src/framework/App');
const LogManager = require('./src/framework/LogManager');
const factoryRoutes = require('./src/modules/factory/factory.router');
const patternRoutes = require('./src/modules/sivmih/patterns.router');
const PORT = 3000;

LogManager.init();

const app = new App();

factoryRoutes(app);
patternRoutes(app);

app.use(async (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Test routes:`);
    console.log(`GET http://localhost:${PORT}/products`);
    console.log(`POST http://localhost:${PORT}/workers`);
});