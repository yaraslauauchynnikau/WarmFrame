const BaseRepo = require('../../framework/BaseRepo');

class ExampleRepo extends BaseRepo {
    constructor() {
        super('sivmih', 'examples');
    }
}

class PatternRepo extends BaseRepo {
    constructor() {
        super('sivmih', 'patterns');
    }
}

module.exports = {
    exampleRepo: new ExampleRepo(),
    patternRepo: new PatternRepo()
};