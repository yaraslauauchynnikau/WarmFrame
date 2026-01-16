const AbstractFactory = require('./factory.a_factory');
const Product = require('./models/Product');
const Worker = require('./models/Worker');

class ConcreteFactory extends AbstractFactory {
    createProduct(data) {
        return new Product(data);
    }

    createWorker(data) {
        return new Worker(data);
    }

}

module.exports = new ConcreteFactory();