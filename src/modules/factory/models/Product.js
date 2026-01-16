const ObjectBase = require('../../../framework/ObjectBase');

class Product extends ObjectBase {
    constructor(data) {
        super(data);
        this.name = data.name;
        this.price = data.price;
        this.isAvailable = data.isAvailable;
        this.tags = data.tags ?? [];
    }
}

module.exports = Product;