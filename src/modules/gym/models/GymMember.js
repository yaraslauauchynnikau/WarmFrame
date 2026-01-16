const ObjectBase = require("../../../framework/ObjectBase");

class GymMember extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.fullName = data.fullName || "";
        this.age = data.age || 0;
        this.membershipType = data.membershipType || "Standard"; // Standard, Gold, Platinum
        this.joinDate = data.joinDate || new Date().toISOString();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
    }
}

module.exports = GymMember;