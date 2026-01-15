const EvenEmitter = require('events');

class EventBus extends EvenEmitter {
    constructor() {
        super();
        this.queue = [];
    }

    dispatch(event) {
        this.queue.push(event);
        this.emit(event.type, event);
    }

    flush() {
        const events = [...this.queue];
        this.queue.length = 0;
        return events;
    }
}

module.exports = new EventBus();