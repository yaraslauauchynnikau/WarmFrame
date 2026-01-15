const crypto = require('crypto')

class ObjectBase {
    constructor(data) {
        this.id = data.id ?? crypto.randomUUID();
        this.createdAt = data.createdAt ?? new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    update(partial) {
        Object.assign(this, partial);
        this.updateAt = new Date().toISOString();
    }
}

module.exports = ObjectBase;