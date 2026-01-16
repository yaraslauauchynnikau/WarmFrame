const http = require('http');
const Router = require('./Router');

class App {
    constructor() {
        this.router = new Router();
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    get(path, handler) { this.router.add('GET', path, handler); }
    post(path, handler) { this.router.add('POST', path, handler); }
    put(path, handler) { this.router.add('PUT', path, handler); }
    patch(path, handler) { this.router.add('PATCH', path, handler); }
    delete(path, handler) { this.router.add('DELETE', path, handler); }

    listen(port, callback) {
        const server = http.createServer(async (req, res) => {
            res.send = (data) => {
                res.end(data);
            };

            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            };

            res.status = (code) => {
                res.statusCode = code;
                return res;
            };

            await new Promise((resolve) => {
                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', () => {
                    try {
                        req.body = body ? JSON.parse(body) : {};
                    } catch {
                        req.body = {};
                    }
                    resolve();
                });
            });

            const urlObj = new URL(req.url, `http://${req.headers.host}`);
            req.pathname = urlObj.pathname;
            req.query = Object.fromEntries(urlObj.searchParams);

            const match = this.router.find(req.method, req.pathname);

            if (match) {
                req.params = match.params;
                try {
                    for (const mw of this.middlewares) {
                        await mw(req, res);
                    }

                    await match.handler(req, res);
                } catch(e) {
                    console.error(e);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            } else {
                res.status(404).json({ error: `Route ${req.method} ${req.pathname} not found`});
            }
        });

        server.listen(port, callback);
    }
}

module.exports = App;