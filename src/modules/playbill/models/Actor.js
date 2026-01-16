const ObjectBase = require("../../../framework/ObjectBase");

class Actor extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.name = data.name || "";
        this.playId = data.playId || ""; // Links actor to a play
        this.roleName = data.roleName || "";
        this.isLead = data.isLead || false;
        this.experienceYears = data.experienceYears || 0;
    }
}

module.exports = Actor;