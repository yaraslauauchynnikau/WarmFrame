const ObjectBase = require("../../../framework/ObjectBase");

class CodeExample extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.patternId = data.patternId || "";
        this.language = data.language || "";
        this.lines = data.lines || 0;
        this.isWorking = data.isWorking || true;
        this.tags = data.tags || [];
    }
}

module.exports = CodeExample;