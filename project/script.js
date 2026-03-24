// Добавьте эти функции в существующий script.js

// Функция для загрузки товаров в каталог
function loadProductsToCatalog() {
    const products = JSON.parse(localStorage.getItem('vedgi_products')) || [];
    const catalogGrid = document.getElementById('catalog-grid');
    
    if (!catalogGrid) return;
    
    catalogGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-type">${product.type || 'Элитный аромат'}</p>
            <p class="product-price">${product.price.toLocaleString()} ₽</p>
            <p class="product-notes">${product.notes ? product.notes.split('\n')[0] : ''}</p>
            <a href="product.html?id=${product.id}" class="btn btn-small">Подробнее</a>
        </div>
    `).join('');
}

// Функция для загрузки конкретного товара на страницу product.html
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;
    
    const products = JSON.parse(localStorage.getItem('vedgi_products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Заполняем страницу данными товара
    document.title = `Vedgi - ${product.name}`;
    
    const nameElement = document.querySelector('.product-name');
    if (nameElement) nameElement.textContent = product.name;
    
    const priceElement = document.querySelector('.product-price-lg');
    if (priceElement) priceElement.textContent = `${product.price.toLocaleString()} ₽`;
    
    const mainImg = document.getElementById('mainImage');
    if (mainImg) mainImg.src = product.image;
    
    const notesList = document.querySelector('.notes-list');
    if (notesList && product.notes) {
        const notes = product.notes.split('\n');
        notesList.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
    }
    
    const specsTable = document.querySelector('.specs-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr><td>Объем</td><td>${product.volume || '50 мл / 100 мл'}</td></tr>
            <tr><td>Пол</td><td>${getCategoryName(product.category)}</td></tr>
            <tr><td>Год создания</td><td>${product.year || '2024'}</td></tr>
            <tr><td>Тип аромата</td><td>${product.type || 'Элитный'}</td></tr>
        `;
    }
}

// Вызываем функции при загрузке страниц
if (window.location.pathname.includes('catalog.html')) {
    document.addEventListener('DOMContentLoaded', loadProductsToCatalog);
}

if (window.location.pathname.includes('product.html')) {
    document.addEventListener('DOMContentLoaded', loadProductDetails);
}
function initTheme() {
    const savedTheme = localStorage.getItem('vedgi_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('vedgi_theme', isDark ? 'dark' : 'light');
    });
}

// ============= ИНИЦИАЛИЗАЦИЯ =============
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkAuth();
});