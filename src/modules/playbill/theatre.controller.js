const { playRepo, actorRepo } = require('./theatre.repository');
const Play = require('./models/Play');
const Actor = require('./models/Actor');

class TheatreController {
    
    // Plays
    async getPlays(req, res) {
        const plays = await playRepo.findAll();
        res.status(200).json(plays);
    }

    async getPlayById(req, res) {
        const play = await playRepo.findById(req.params.id);
        if (!play) return res.status(404).json({ error: 'Play not found' });
        res.status(200).json(play);
    }

    async createPlay(req, res) {
        try {
            const newPlay = new Play(req.body);
            const saved = await playRepo.save(newPlay);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updatePlay(req, res) {
        const id = req.params.id;
        console.log(`[TheatreController] UPDATE Play Request for ID: "${id}"`);

        const existing = await playRepo.findById(id);
    
        if (!existing) {
            console.error(`[TheatreController] Play with ID "${id}" NOT FOUND.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await playRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchPlay(req, res) {
        return this.updatePlay(req, res);
    }

    async deletePlay(req, res) {
        const id = req.params.id;
        console.log(`[TheatreController] DELETE Play Request for ID: "${id}"`);

        const deleted = await playRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }

    // Actors
    async getActors(req, res) {
        const actors = await actorRepo.findAll();
        res.status(200).json(actors);
    }

    async getActorById(req, res) {
        const actor = await actorRepo.findById(req.params.id);
        if (!actor) return res.status(404).json({ error: 'Actor not found' });
        res.status(200).json(actor);
    }

    async createActor(req, res) {
        try {
            const newActor = new Actor(req.body);
            const saved = await actorRepo.save(newActor);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updateActor(req, res) {
        const id = req.params.id;
        console.log(`[TheatreController] UPDATE Actor Request for ID: "${id}"`);

        const existing = await actorRepo.findById(id);
    
        if (!existing) {
            console.error(`[TheatreController] Actor with ID "${id}" NOT FOUND.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await actorRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchActor(req, res) {
        return this.updateActor(req, res);
    }

    async deleteActor(req, res) {
        const id = req.params.id;
        console.log(`[TheatreController] DELETE Actor Request for ID: "${id}"`);

        const deleted = await actorRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }
}

module.exports = new TheatreController();