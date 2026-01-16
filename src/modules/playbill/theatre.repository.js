const BaseRepo = require('../../framework/BaseRepo');

class PlayRepo extends BaseRepo {
    constructor() {
        super('theatre', 'plays');
    }
}

class ActorRepo extends BaseRepo {
    constructor() {
        super('theatre', 'actors');
    }
}

module.exports = {
    playRepo: new PlayRepo(),
    actorRepo: new ActorRepo()
};