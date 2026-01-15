const crypto = require('crypto')

class BaseEntity {
    constructor(data = {}) {
        this.id = data.id || crypto.randomUUID();
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();

        Object.assign(this, data);
    }

    toJSON() {
        return { ...this };
    }
}

module.exports = BaseEntity;