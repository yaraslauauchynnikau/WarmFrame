const ObjectBase = require("../../../framework/ObjectBase");

class Equipment extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.name = data.name || "";
        this.category = data.category || ""; // Cardio, Strength, etc.
        this.weightLimit = data.weightLimit || 0;
        this.isOperational = data.isOperational !== undefined ? data.isOperational : true;
        this.lastMaintenance = data.lastMaintenance || null;
    }
}

module.exports = Equipment;