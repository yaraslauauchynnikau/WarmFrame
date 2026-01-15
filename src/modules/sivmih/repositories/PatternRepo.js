const BaseRepo = require('../../../framework/BaseRepo');
const DesignPattern = require('../entities/DesignPattern');

class PatternRepo extends BaseRepo {
    constructor() {
        super('patterns.json', DesignPattern);
    }
}

module.exports = PatternRepo;
