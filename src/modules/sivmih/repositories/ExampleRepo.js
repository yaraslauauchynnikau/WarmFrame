const BaseRepo = require('../../../framework/BaseRepo');
const CodeExample = require('../entities/CodeExample');

class ExampleRepo extends BaseRepo {
    constructor() {
        super('examples.json', CodeExample);
    }
}

module.exports = ExampleRepo;
