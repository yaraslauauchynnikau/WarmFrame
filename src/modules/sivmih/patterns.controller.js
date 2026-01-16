const { patternRepo, exampleRepo } = require('./patterns.repository');
const CodeExample = require('../sivmih/models/CodeExample');
const DesignPattern = require('../sivmih/models/DesignPattern');


class PatternsController {
    
    //patterns
    async getPatterns(req, res) {
        const patterns = await patternRepo.findAll();
        res.status(200).json(patterns);
    }

    async getPatternById(req, res) {
        const pattern = await patternRepo.findById(req.params.id);
        if (!pattern) return res.status(404).json({ error: 'Pattern not found' });
        res.status(200).json(pattern);
    }

    async createPattern(req, res) {
        try {
            const newPattern = new DesignPattern(req.body);
            const saved = await patternRepo.save(newPattern);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updatePattern(req, res) {
        const id = req.params.id;
        console.log(`[Controller] UPDATE Pattern Request for ID: "${id}"`);

        const existing = await patternRepo.findById(id);
    
        if (!existing) {
            console.error(`[Controller] Pattern with ID "${id}" NOT FOUND in DB.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await patternRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchPattern(req, res) {
        return this.updatePattern(req, res);
    }

    async deletePattern(req, res) {
        const id = req.params.id;
        console.log(`[Controller] DELETE Pattern Request for ID: "${id}"`);

        const deleted = await patternRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }

    //examples
    async getExamples(req, res) {
        const examples = await exampleRepo.findAll();
        res.status(200).json(examples);
    }

    async getExampleById(req, res) {
        const example = await exampleRepo.findById(req.params.id);
        if (!example) return res.status(404).json({ error: 'Example not found' });
        res.status(200).json(example);
    }

    async createExamples(req, res) {
        try {
            const newExample = new CodeExample(req.body);
            const saved = await exampleRepo.save(newExample);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updateExamples(req, res) {
        const id = req.params.id;
        console.log(`[Controller] UPDATE Example Request for ID: "${id}"`);

        const existing = await exampleRepo.findById(id);
    
        if (!existing) {
            console.error(`[Controller] Example with ID "${id}" NOT FOUND in DB.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await exampleRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchExamples(req, res) {
        return this.updateExamples(req, res);
    }

    async deleteExamples(req, res) {
        const id = req.params.id;
        console.log(`[Controller] DELETE Example Request for ID: "${id}"`);

        const deleted = await exampleRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }
}

module.exports = new PatternsController();