const { ActionTypes, EventTypes } = require('./Constants');

class EventFactory {
    static repoEvent({ module, entity, action, prev, next}) {
        return {
            type: EventTypes.REPO_ACTION,
            timestamp: new Date().toISOString(),
            payload: {
                module,
                entity,
                action,
                prev,
                next
            }
        };
    }

    static errorEvent(error) {
        return {
            type: EventTypes.ERROR,
            timestamp: new Date().toISOString(),
            payload: {
                message: error.message,
                stack: error.stack
            }
        };
    }
}

module.exports = EventFactory;