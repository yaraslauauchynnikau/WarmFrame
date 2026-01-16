const ObjectBase = require('../../../framework/ObjectBase');

class Worker extends ObjectBase {
    constructor(data) {
        super(data);
        this.name = data.name;
        this.role = data.role;
        this.salary = data.salary;
    }
}

module.exports = Worker;