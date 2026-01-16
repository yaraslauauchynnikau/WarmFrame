const BaseRepo = require('../../framework/BaseRepo');

class ExampleRepo extends BaseRepo {
    constructor() {
        super('patterns', 'examples');
    }
}

class PatternRepo extends BaseRepo {
    constructor() {
        super('patterns', 'patterns');
    }
}

module.exports = {
    exampleRepo: new ExampleRepo(),
    patternRepo: new PatternRepo()
};