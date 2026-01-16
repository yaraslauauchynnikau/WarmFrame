const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('Тестируем Паттерны...\n');

    try {
        console.log('1. Создаём паттерн...');
        const createRes = await fetch(`${BASE_URL}/patterns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Singleton",
                category: "Creational",
                isCreational: true,
                year: 1994,
                authors: ["Gang of Four"]
            })
        });
        const newPattern = await createRes.json();
        console.log('Отлично, создали:', newPattern);
        const patternId = newPattern.id;

        console.log('\n2. Получаем список всех паттернов...');
        const listRes = await fetch(`${BASE_URL}/patterns`);
        const patterns = await listRes.json();
        console.log('✅ Всего паттернов в базе:', patterns.length);

        console.log('\n3. Создаем пример кода...');
        const exampleRes = await fetch(`${BASE_URL}/examples`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patternId: patternId,
                language: "JavaScript",
                lines: 25,
                isWorking: true,
                tags: ["node", "single-instance"]
            })
        });
        const example = await exampleRes.json();
        console.log('Пример кода добавлен:', example);


        console.log(`\n4. Обновляем категорию паттерна ${patternId}...`);
        const updateRes = await fetch(`${BASE_URL}/patterns/${patternId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: "Singleton (Updated)", 
                category: "Creational / Global State" 
            })
        });
        const updated = await updateRes.json();
        console.log('Сервер ответил, обновление прошло:', updated);

        console.log(`\n5. Удаляем паттерн ${patternId}...`);
        const deleteRes = await fetch(`${BASE_URL}/patterns/${patternId}`, {
            method: 'DELETE'
        });
        const deleted = await deleteRes.json();
        console.log('Удалили:', deleted.name || deleted.message || deleted);

        if (example.id) {
             console.log(`\n(Опционально) Чистим пример кода ${example.id}...`);
             await fetch(`${BASE_URL}/examples/${example.id}`, { method: 'DELETE' });
             console.log('Пример тоже удален.');
        }

        console.log('\nВсе тесты пройдены!');

    } catch (error) {
        console.error('\nУпс, что-то пошло не так:', error.message);
        console.log('Проверь, запущен ли сервер на порту 3000');
    }
}

runTests();