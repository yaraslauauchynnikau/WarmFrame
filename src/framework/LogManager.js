const fs = require('fs/promises');
const path = require('path');
const eventBus = require('./EventBus');
const { EventTypes } = require('./Constants');

const logPath = path.join(__dirname, '../../database/eventlog.json');

class LogManager {
    static #writeQueue = Promise.resolve();

    static init() {
        eventBus.on(EventTypes.REPO_ACTION, (ev) => LogManager.log(ev));
        eventBus.on(EventTypes.ERROR, (ev) => LogManager.log(ev));
    }

    static async log(event) {
        this.#writeQueue = this.#writeQueue.then(async () => {
            try {
                let logs = [];
                try {
                    const data = await fs.readFile(logPath, 'utf-8');
                    logs = data ? JSON.parse(data) : [];
                } catch (e) {
                    logs = [];
                }

                logs.push(event);

                await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');
            }
            catch (e) {
                console.error('CRITICAL LOG ERROR:', e);
            }
        });

        return this.#writeQueue;
    }
}

module.exports = LogManager;