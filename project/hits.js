// hits.js - логика для хитов продаж

// Глобальная функция для загрузки товаров
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('vedgi_products')) || [];
    
    // Если товаров меньше 12, дополняем демо-товарами
    if (products.length < 12) {
        return ensure12Products(products);
    }
    
    return products;
}

// Функция для гарантии 12 товаров
function ensure12Products(existingProducts) {
    const demoProducts = [
        { id: 'demo1', name: 'Черный алмаз', category: 'male', price: 15000, image: 'images/perfume-1.jpg', type: 'Древесный', rating: 4.8, reviews: 156 },
        { id: 'demo2', name: 'Император', category: 'male', price: 18500, image: 'images/perfume-2.jpg', type: 'Пряный', rating: 4.9, reviews: 203 },
        { id: 'demo3', name: 'Королевская ночь', category: 'female', price: 22000, image: 'images/perfume-3.jpg', type: 'Восточный', rating: 4.7, reviews: 178 },
        { id: 'demo4', name: 'Императрица', category: 'female', price: 21000, image: 'images/perfume-4.jpg', type: 'Цветочный', rating: 4.6, reviews: 145 },
        { id: 'demo5', name: 'Теневой совет', category: 'unisex', price: 25000, image: 'images/perfume-5.jpg', type: 'Кожаный', rating: 4.9, reviews: 98 },
        { id: 'demo6', name: 'Белый ворон', category: 'unisex', price: 23500, image: 'images/perfume-6.jpg', type: 'Альдегидный', rating: 4.5, reviews: 67 },
        { id: 'demo7', name: 'Золотой дракон', category: 'male', price: 28000, image: 'images/perfume-7.jpg', type: 'Древесный', rating: 5.0, reviews: 45 },
        { id: 'demo8', name: 'Красная императрица', category: 'female', price: 26500, image: 'images/perfume-8.jpg', type: 'Цветочный', rating: 4.8, reviews: 89 },
        { id: 'demo9', name: 'Серебряный лев', category: 'male', price: 19500, image: 'images/perfume-9.jpg', type: 'Пряный', rating: 4.6, reviews: 112 },
        { id: 'demo10', name: 'Черная орхидея', category: 'female', price: 24000, image: 'images/perfume-10.jpg', type: 'Цветочный', rating: 4.7, reviews: 134 },
        { id: 'demo11', name: 'Сапфир', category: 'unisex', price: 27500, image: 'images/perfume-11.jpg', type: 'Морской', rating: 4.4, reviews: 56 },
        { id: 'demo12', name: 'Рубин', category: 'unisex', price: 29000, image: 'images/perfume-12.jpg', type: 'Пряный', rating: 4.9, reviews: 78 }
    ];

    // Объединяем существующие товары с демо, чтобы получилось 12
    let allProducts = [...existingProducts];
    
    // Добавляем демо-товары, если нужно
    for (let i = 0; i < demoProducts.length; i++) {
        if (allProducts.length >= 12) break;
        
        // Проверяем, нет ли уже такого товара
        const exists = allProducts.some(p => p.name === demoProducts[i].name);
        if (!exists) {
            allProducts.push(demoProducts[i]);
        }
    }

    return allProducts;
}

// Загрузка хитов продаж
function loadHits() {
    const products = loadProducts();
    const hitsGrid = document.getElementById('hitsGrid');
    
    if (!hitsGrid) return;
    
    // Берем первые 12 товаров
    const hits = products.slice(0, 12);
    
    hitsGrid.innerHTML = hits.map(product => createHitCard(product)).join('');
    
    // Обновляем статистику
    updateStats(products);
    updateTabCounts();
}

// Создание карточки товара
function createHitCard(product) {
    const rating = product.rating || (Math.random() * 2 + 3).toFixed(1);
    const reviews = product.reviews || Math.floor(Math.random() * 200 + 20);
    
    return `
        <div class="hit-card" data-category="${product.category}">
            <div class="hit-badge">ХИТ</div>
            <img src="${product.image}" alt="${product.name}" class="hit-image" onerror="this.src='https://via.placeholder.com/300x300?text=${product.name}'">
            <div class="hit-info">
                <div class="hit-category">${getCategoryName(product.category)}</div>
                <h3 class="hit-title">${product.name}</h3>
                <div class="hit-rating">
                    <span class="stars">${getStars(rating)}</span>
                    <span class="reviews-count">(${reviews} отзывов)</span>
                </div>
                <div class="hit-price">${product.price.toLocaleString()} ₽</div>
                <div class="hit-actions">
                    <button class="btn-hit" onclick="showDetails('${product.id}')">Подробнее</button>
                    <button class="btn-hit btn-hit-primary" onclick="buyNow('${product.id}')">Купить</button>
                </div>
            </div>
        </div>
    `;
}

// Обновление статистики
function updateStats(products) {
    const statsGrid = document.getElementById('statsGrid');
    
    if (!statsGrid) return;
    
    const totalProducts = products.length;
    const maleCount = products.filter(p => p.category === 'male').length;
    const femaleCount = products.filter(p => p.category === 'female').length;
    const unisexCount = products.filter(p => p.category === 'unisex').length;
    const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length);

    statsGrid.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${totalProducts}</div>
            <div class="stat-label">Всего ароматов</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${maleCount}</div>
            <div class="stat-label">Мужских</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${femaleCount}</div>
            <div class="stat-label">Женских</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${avgPrice.toLocaleString()} ₽</div>
            <div class="stat-label">Средняя цена</div>
        </div>
    `;
}

// Звезды рейтинга
function getStars(rating) {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const halfStar = numRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Фильтрация хитов
function filterHits(category) {
    // Обновляем активную вкладку
    const tabs = document.querySelectorAll('.hit-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Фильтруем карточки
    const cards = document.querySelectorAll('.hit-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Обновление счетчиков на вкладках
function updateTabCounts() {
    const cards = document.querySelectorAll('.hit-card');
    const tabs = document.querySelectorAll('.hit-tab');
    
    if (!cards.length || !tabs.length) return;
    
    const maleCount = Array.from(cards).filter(c => c.dataset.category === 'male').length;
    const femaleCount = Array.from(cards).filter(c => c.dataset.category === 'female').length;
    const unisexCount = Array.from(cards).filter(c => c.dataset.category === 'unisex').length;
    
    tabs[0].textContent = `Все хиты (${cards.length})`;
    tabs[1].textContent = `Мужские (${maleCount})`;
    tabs[2].textContent = `Женские (${femaleCount})`;
    tabs[3].textContent = `Унисекс (${unisexCount})`;
}

// Функции действий
function showDetails(id) {
    localStorage.setItem('current_product_id', id);
    window.location.href = 'product.html';
}

function buyNow(id) {
    alert('Товар добавлен в корзину! Перейдите к оформлению.');
    localStorage.setItem('cart_item', id);
}

function getCategoryName(category) {
    const categories = {
        'male': 'Мужской аромат',
        'female': 'Женский аромат',
        'unisex': 'Унисекс'
    };
    return categories[category] || category;
}

// Слушаем изменения в localStorage (синхронизация с админкой)
window.addEventListener('storage', function(e) {
    if (e.key === 'vedgi_products') {
        loadHits();
    }
});

// Загружаем все при старте
document.addEventListener('DOMContentLoaded', () => {
    loadHits();
    
    // Проверяем изменения каждые 2 секунды (для синхронизации)
    setInterval(() => {
        const currentProducts = JSON.parse(localStorage.getItem('vedgi_products')) || [];
        const currentHits = document.querySelectorAll('.hit-card').length;
        
        // Если количество товаров изменилось, обновляем
        if (currentProducts.length !== currentHits && currentProducts.length > 0) {
            loadHits();
        }
    }, 2000);
});

// Делаем функции глобальными
window.filterHits = filterHits;
window.showDetails = showDetails;
window.buyNow = buyNow;