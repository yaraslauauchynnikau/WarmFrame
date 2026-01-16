const ObjectBase = require("../../../framework/ObjectBase");

class Play extends ObjectBase {
    constructor(data = {}) {
        super(data);
        this.title = data.title || "";
        this.author = data.author || "";
        this.genre = data.genre || "Drama";
        this.durationMinutes = data.durationMinutes || 90;
        this.premiereYear = data.premiereYear || new Date().getFullYear();
    }
}

module.exports = Play;