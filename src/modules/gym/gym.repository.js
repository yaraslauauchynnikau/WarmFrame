const BaseRepo = require('../../framework/BaseRepo');

class GymMemberRepo extends BaseRepo {
    constructor() {
        super('gym', 'members');
    }
}

class EquipmentRepo extends BaseRepo {
    constructor() {
        super('gym', 'equipment');
    }
}

module.exports = {
    memberRepo: new GymMemberRepo(),
    equipmentRepo: new EquipmentRepo()
};