const fs = require('fs/promises');
const path = require('path');
const eventBus = require('./EventBus');
const EventFactory = require('./EventFactory');
const { ActionTypes } = require('./Constants');

class BaseRepo {
    constructor(moduleName, objectName) {
        this.moduleName = moduleName;
        this.objectName = objectName;

        this.dbPath = path.join(
            __dirname,
            `../modules/${moduleName}/data/${entityName}.json`
        );
    }

    async findAll() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (e) { return []; }
    }

    async findById(id) {
        const data = await this.findAll();
        return data.find(e => e.id === id);
    }

    async save(object) {
        const data = await this.findAll();
        const index = data.findIndex(item => item.id === object.id);
        
        let action = ActionTypes.CREATE;
        let prev = null;

        if (index !== -1) {
            prev = data[index];
            data[index] = object;
            action = ActionTypes.UPDATE;
        } else {
            data.push(entity);
        }

        await fs.writeFile(
            this.dbPath, 
            JSON.stringify(data, null, 2)
        );
        
        eventBus.dispatch(
            EventFactory.repoEvent({
                module: this.moduleName,
                entity: this.entityName,
                action,
                prev,
                next: entity
            })
        )

        return entity;
    }
    
    async delete(id) {
        const data = await this.findAll();
        const index = data.findIndex(e => e.id === id);
        if (index === -1) return null;

        const [removed] = data.splice(index, 1);

        await fs.writeFile(
            this.dbPath,
            JSON.stringify(data, null, 2)
        );

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