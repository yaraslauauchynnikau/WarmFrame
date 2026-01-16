const { spawn } = require('child_process')

const server = spawn('node', ['main.js'], { stdio: 'inherit' });

console.log('Запускаем эту херню');

setTimeout(() => {
    console.log('Пробегаем тесты');
    const client = spawn('node', ['client.js'], { stdio: 'inherit' });

    client.on('close', (code) => {
        console.log(`\nТесты завершены с кодом ${code}. Вырубаем`)
        server.kill();
        process.exit(code);
    });
}, 1500);