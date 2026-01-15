const BaseEnum = require('../../framework/BaseEnum');

const WorkerStatus = new BaseEnum({
    WORKING: 'WORKING',
    ON_VACATION: 'ON_VACATION',
    FIRED: 'FIRED'
});

const ProductType = new BaseEnum({
    COMPONENT: 'COMPONENT',
    FINAL_PRODUCT: 'FINAL_PRODUCT'
});

module.exports = { WorkerStatus, ProductType };