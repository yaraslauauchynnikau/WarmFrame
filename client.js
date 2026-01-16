const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('Тестики...\n');

    try {
        // Создать продукт
        console.log('1. Создаём...');
        const createRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Baikal i9",
                price: 500,
                isAvailable: true
            })
        });
        const newProduct = await createRes.json();
        console.log('Заебись, создали:', newProduct);
        const productId = newProduct.id;

        // Получить продукт
        console.log('\n2. Получаем список всех продуктов...');
        const listRes = await fetch(`${BASE_URL}/products`);
        const products = await listRes.json();
        console.log('✅ Всего в базе:', products.length);

        // Создать работягу
        console.log('\n3. Создаем работягу...');
        const workerRes = await fetch(`${BASE_URL}/workers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Джотаро",
                role: "Рыбо-глушитель",
                salary: 150000
            })
        });
        const worker = await workerRes.json();
        console.log('Да-да, создали:', worker);

        // Пут пут
        console.log(`\n4. Обновляем цену продукта ${productId}...`);
        const updateRes = await fetch(`${BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: 600, isAvailable: false })
        });
        const updated = await updateRes.json();
        console.log('Алло, сервер? Да, да, обновление:', updated);

        // Делите
        console.log(`\n5. Час ночи, ебаный рот... ${productId}...`);
        const deleteRes = await fetch(`${BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        const deleted = await deleteRes.json();
        console.log('Удалили:', deleted.name);

        console.log('\nВсе тесты пройдены!');

    } catch (error) {
        console.error('\nПроебались, я даже искать не буду, если это выскочит:', error.message);
        console.log('Ну и да, может, сервак не запущен');
    }
}

runTests();