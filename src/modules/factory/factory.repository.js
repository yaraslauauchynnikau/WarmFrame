const BaseRepo = require('../../framework/BaseRepo');

class FactoryRepo extends BaseRepo {
    constructor(entity) {
        super('factory', entity);
    }
}