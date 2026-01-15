class Router {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: []
        };
    }

    add(method, path, handler) {
        const paramNames = [];
        const regexPath = path.replace(/:([^\/]+)/g, (match, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });

        this.routes[method].push({
            path,
            regex: new RegExp(`^${regexPath}$`),
            paramNames,
            handler
        });
    }

    find(method, path) {
        const methodRoutes = this.routes[method] || [];
        for (const route of methodRoutes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                return { handler: route.handler, params };
            }
        }
        return null;
    }
}

module.exports = Router;