const controller = require('./factory.controller');

module.exports = (app) => {
    // Products Routes
    app.get('/products', controller.getProducts);
    app.get('/products/:id', controller.getProductById);
    app.post('/products', controller.createProduct);
    app.put('/products/:id', controller.updateProduct);
    app.delete('/products/:id', controller.deleteProduct);

    // Workers Routes
    app.get('/workers', controller.getWorkers);
    app.post('/workers', controller.createWorker);
};