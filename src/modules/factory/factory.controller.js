const { productRepo, workerRepo } = require('./factory.repository');
const ConcreteFactory = require('./factory.factory');

class FactoryController {
    async getProducts(req, res) {
        const products = await productRepo.findAll();
        res.status(200).json(products);
    }

    async getProductById(req, res) {
        const product = await productRepo.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    }

    async createProduct(req, res) {
        try {
            const newProduct = ConcreteFactory.createProduct(req.body);
            const saved = await productRepo.save(newProduct);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updateProduct(req, res) {
        const existing = await productRepo.findById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Not found' });

        const updated = { ...existing, ...req.body, id: existing.id };
        await productRepo.save(updated);
        res.status(200).json(updated);
    }

    async deleteProduct(req, res) {
        const deleted = await productRepo.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }

    async getWorkers(req, res) {
        const workers = await workerRepo.findAll();
        res.status(200).json(workers);
    }
    
    async createWorker(req, res) {
        try {
            const newWorker = ConcreteFactory.createWorker(req.body);
            const saved = await workerRepo.save(newWorker);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    
}

module.exports = new FactoryController();