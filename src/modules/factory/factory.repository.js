const BaseRepo = require('../../framework/BaseRepo');

class ProductRepo extends BaseRepo {
    constructor() {
        super('factory', 'products');
    }
}

class WorkerRepo extends BaseRepo {
    constructor() {
        super('factory', 'workers');
    }
}

module.exports = {
    productRepo: new ProductRepo(),
    workerRepo: new WorkerRepo()
};