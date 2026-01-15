class AbstractFactory {
    createProduct(data) {
        throw new Error('createProduct() must be implemented');
    }

    createWorker(data) {
        throw new Error('createWorker(): Rabota ne volk, v les ne ubejit');
    }
}

module.exports = AbstractFactory;