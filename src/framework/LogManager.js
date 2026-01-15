const fs = require('fs/promises');
const path = require('path');
const eventBus = require('./EventBus');
const { EventTypes } = require('./Constants');

const logPath = path.join(__dirname, '../../database/eventlog.json');

class LogManager {
    static init() {
        eventBus.on(EventTypes.REPO_ACTION, LogManager.log);
        eventBus.on(EventTypes.ERROR, LogManager.log);
    }

    static async log(event) {
        try {
            const data = await fs.readFile(logPath, 'utf-8')
                .catch(() => '[]');
            
            const logs = JSON.parse(data);
            logs.push(event);
            await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
        }
        catch (e) {
            console.error('LOG ERROR', e);
        }
    }
}

module.exports = LogManager;