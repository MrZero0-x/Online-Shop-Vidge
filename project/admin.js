// admin.js

// Загрузка статистики
function loadStats() {
    const stats = db.getStats();
    const container = document.getElementById('statsContainer');
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalProducts}</div>
            <div class="stat-label">Всего товаров</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.maleCount}</div>
            <div class="stat-label">Мужские</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.femaleCount}</div>
            <div class="stat-label">Женские</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.unisexCount}</div>
            <div class="stat-label">Унисекс</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.avgPrice.toLocaleString()} ₽</div>
            <div class="stat-label">Средняя цена</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalValue.toLocaleString()} ₽</div>
            <div class="stat-label">Общая стоимость</div>
        </div>
    `;
}

// Загрузка товаров в таблицу
function loadProducts() {
    const products = db.getAllProducts();
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Нет товаров. Добавьте первый товар!</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.image || 'https://via.placeholder.com/50'}" 
                     alt="${product.name}" 
                     class="product-thumb"
                     onerror="this.src='https://via.placeholder.com/50'">
            </td>
            <td>${product.name}</td>
            <td>${db.getCategoryName(product.category)}</td>
            <td>${product.price.toLocaleString()} ₽</td>
            <td>${'⭐'.repeat(Math.floor(product.rating || 0))} ${product.rating || 'Нет'}</td>
            <td>${product.inStock ? '✅ В наличии' : '❌ Нет'}</td>
            <td class="action-btns">
                <button class="btn-edit" onclick="editProduct('${product.id}')">✏️</button>
                <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Показать форму добавления
function showAddProductForm() {
    document.getElementById('formTitle').textContent = 'Добавление товара';
    document.getElementById('productId').value = '';
    document.getElementById('productEditForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('productForm').style.display = 'block';
}

// Показать форму редактирования
function editProduct(id) {
    const product = db.getProductById(id);
    if (!product) return;

    document.getElementById('formTitle').textContent = 'Редактирование товара';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productType').value = product.type || '';
    document.getElementById('productVolume').value = product.volume || '';
    document.getElementById('productRating').value = product.rating || '';
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productInStock').checked = product.inStock !== false;

    if (product.image) {
        document.getElementById('imagePreview').innerHTML = 
            `<img src="${product.image}" style="max-width: 100px; max-height: 100px;">`;
    }

    document.getElementById('productForm').style.display = 'block';
}

// Скрыть форму
function hideForm() {
    document.getElementById('productForm').style.display = 'none';
}

// Сохранить товар
function saveProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        type: document.getElementById('productType').value,
        volume: document.getElementById('productVolume').value,
        rating: parseFloat(document.getElementById('productRating').value) || 0,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        inStock: document.getElementById('productInStock').checked
    };

    if (productId) {
        db.updateProduct(productId, productData);
        alert('Товар обновлен!');
    } else {
        db.addProduct(productData);
        alert('Товар добавлен!');
    }

    hideForm();
    loadProducts();
    loadStats();
}

// Удалить товар
function deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить товар?')) {
        db.deleteProduct(id);
        loadProducts();
        loadStats();
        alert('Товар удален!');
    }
}

// Загрузка изображения
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        document.getElementById('productImage').value = imageData;
        document.getElementById('imagePreview').innerHTML = 
            `<img src="${imageData}" style="max-width: 100px; max-height: 100px;">`;
    };
    reader.readAsDataURL(file);
}

// Экспорт базы данных
function exportDatabase() {
    db.downloadBackup();
}

// Импорт базы данных
function importDatabase(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        if (db.importFromJson(e.target.result)) {
            alert('База данных импортирована!');
            loadProducts();
            loadStats();
        } else {
            alert('Ошибка импорта. Проверьте формат файла.');
        }
    };
    reader.readAsText(file);
    
    // Очищаем input
    input.value = '';
}

// Переключение темы
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadStats();
});

// Обновление при изменении базы данных
window.addEventListener('database-updated', function() {
    loadProducts();
    loadStats();
});