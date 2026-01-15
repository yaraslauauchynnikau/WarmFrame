const BaseEnum = require('./BaseEnum');

const ActionTypes = new BaseEnum({
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
});

const EventTypes = new BaseEnum({
    REPO_ACTION: 'REPO_ACTION',
    ERROR: 'ERROR'
});

module.exports = { ActionTypes, EventTypes };

