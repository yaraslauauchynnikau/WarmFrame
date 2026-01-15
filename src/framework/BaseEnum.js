class BaseEnum {
    constructor(enumObject) {
        for (const key in enumObject) {
            this[key] = enumObject[key];
        }

        Object.freeze(this);
    }

    exists(value) {
        return Object.values(this).includes(value);
    }

    values() {
        return Object.values(this);
    }
}


module.exports = BaseEnum;