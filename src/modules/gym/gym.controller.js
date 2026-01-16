const { memberRepo, equipmentRepo } = require('./gym.repository');
const GymMember = require('./models/GymMember');
const Equipment = require('./models/Equipment');

class GymController {
    
    // Gym Members
    async getMembers(req, res) {
        const members = await memberRepo.findAll();
        res.status(200).json(members);
    }

    async getMemberById(req, res) {
        const member = await memberRepo.findById(req.params.id);
        if (!member) return res.status(404).json({ error: 'Member not found' });
        res.status(200).json(member);
    }

    async createMember(req, res) {
        try {
            const newMember = new GymMember(req.body);
            const saved = await memberRepo.save(newMember);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updateMember(req, res) {
        const id = req.params.id;
        console.log(`[GymController] UPDATE Member Request for ID: "${id}"`);

        const existing = await memberRepo.findById(id);
    
        if (!existing) {
            console.error(`[GymController] Member with ID "${id}" NOT FOUND.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await memberRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchMember(req, res) {
        return this.updateMember(req, res);
    }

    async deleteMember(req, res) {
        const id = req.params.id;
        console.log(`[GymController] DELETE Member Request for ID: "${id}"`);

        const deleted = await memberRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }

    // Equipment
    async getEquipment(req, res) {
        const items = await equipmentRepo.findAll();
        res.status(200).json(items);
    }

    async getEquipmentById(req, res) {
        const item = await equipmentRepo.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Equipment not found' });
        res.status(200).json(item);
    }

    async createEquipment(req, res) {
        try {
            const newItem = new Equipment(req.body);
            const saved = await equipmentRepo.save(newItem);
            res.status(201).json(saved);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }

    async updateEquipment(req, res) {
        const id = req.params.id;
        console.log(`[GymController] UPDATE Equipment Request for ID: "${id}"`);

        const existing = await equipmentRepo.findById(id);
    
        if (!existing) {
            console.error(`[GymController] Equipment with ID "${id}" NOT FOUND.`);
            return res.status(404).json({ error: 'Not found' });
        }

        const updatedData = { 
            ...existing, 
            ...req.body, 
            id: existing.id 
        };

        const result = await equipmentRepo.save(updatedData);
        res.status(200).json(result);
    }

    async patchEquipment(req, res) {
        return this.updateEquipment(req, res);
    }

    async deleteEquipment(req, res) {
        const id = req.params.id;
        console.log(`[GymController] DELETE Equipment Request for ID: "${id}"`);

        const deleted = await equipmentRepo.delete(id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(deleted);
    }
}

module.exports = new GymController();