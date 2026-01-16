const ObjectBase = require("../../../framework/ObjectBase");

class DesignPattern extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.name = data.name || "";
        this.category = data.category || "";
        this.isCreational = data.isCreational || false;
        this.year = data.year || null;
        this.authors = data.authors || [];
    }
}

module.exports = DesignPattern;