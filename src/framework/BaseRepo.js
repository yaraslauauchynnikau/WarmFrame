const fs = require('fs/promises');
const path = require('path');
const eventBus = require('./EventBus');
const EventFactory = require('./EventFactory');
const { ActionTypes } = require('./Constants');

class BaseRepo {
    constructor(moduleName, entityName) {
        this.moduleName = moduleName;
        this.entityName = entityName;

        this.dbPath = path.join(
            __dirname,
            '..', 'modules', moduleName, 'data', `${entityName}.json`
        );

        console.log(`[BaseRepo] Init ${entityName} at: ${this.dbPath}`);
    }

    async findAll() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            return data.trim() ? JSON.parse(data) : [];
        } catch (e) { 
            console.error(`[BaseRepo] READ ERROR for ${this.entityName}:`, e.message);
            return []; 
        }
    }

    async findById(id) {
        const data = await this.findAll();
        return data.find(e => String(e.id).trim() === String(id).trim());
    }

    async save(object) {
        const data = await this.findAll();
        const index = data.findIndex(item => String(item.id).trim() === String(object.id).trim());
        
        let action = ActionTypes.CREATE;
        let prev = null;

        if (index !== -1) {
            prev = JSON.parse(JSON.stringify(data[index]));
            data[index] = object;
            action = ActionTypes.UPDATE;
        } else {
            data.push(object);
        }

        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
        
        eventBus.dispatch(
            EventFactory.repoEvent({
                module: this.moduleName,
                entity: this.entityName,
                action,
                prev,
                next: object
            })
        );

        return object;
    }
    
    async delete(id) {
        const data = await this.findAll();
        const index = data.findIndex(e => String(e.id).trim() === String(id).trim());
        
        if (index === -1) return null;

        const [removed] = data.splice(index, 1);

        await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));

        eventBus.dispatch(
            EventFactory.repoEvent({
                module: this.moduleName,
                entity: this.entityName,
                action: ActionTypes.DELETE,
                prev: removed,
                next: null
            })
        );

        return removed;
    }
}

module.exports = BaseRepo;