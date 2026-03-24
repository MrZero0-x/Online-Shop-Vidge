// server-sync.js
const API_URL = 'https://ваш-сайт.com/data.json'; // Замените на ваш URL

class ServerDatabase {
    constructor() {
        this.cache = {
            products: [],
            users: [],
            orders: [],
            messages: [],
            promocodes: []
        };
        this.init();
    }

    async init() {
        await this.loadFromServer();
        // Запускаем синхронизацию каждые 30 секунд
        setInterval(() => this.syncWithServer(), 30000);
    }

    async loadFromServer() {
        try {
            // Загружаем данные с сервера
            const response = await fetch(API_URL + '?t=' + Date.now());
            const data = await response.json();
            
            this.cache = data;
            
            // Обновляем localStorage
            localStorage.setItem('vedgi_products', JSON.stringify(data.products || []));
            localStorage.setItem('vedgi_users', JSON.stringify(data.users || []));
            localStorage.setItem('vedgi_orders', JSON.stringify(data.orders || []));
            localStorage.setItem('vedgi_messages', JSON.stringify(data.messages || []));
            
            console.log('✅ Данные загружены с сервера');
        } catch (error) {
            console.error('❌ Ошибка загрузки с сервера:', error);
            // Загружаем из localStorage если сервер недоступен
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        this.cache.products = JSON.parse(localStorage.getItem('vedgi_products')) || [];
        this.cache.users = JSON.parse(localStorage.getItem('vedgi_users')) || [];
        this.cache.orders = JSON.parse(localStorage.getItem('vedgi_orders')) || [];
        this.cache.messages = JSON.parse(localStorage.getItem('vedgi_messages')) || [];
    }

    async saveToServer() {
        try {
            // Отправляем данные на сервер
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cache)
            });
            
            if (response.ok) {
                console.log('✅ Данные сохранены на сервер');
            }
        } catch (error) {
            console.error('❌ Ошибка сохранения на сервер:', error);
        }
    }

    async syncWithServer() {
        try {
            // Проверяем обновления на сервере
            const response = await fetch(API_URL + '?t=' + Date.now());
            const serverData = await response.json();
            
            // Сравниваем с локальными данными
            if (JSON.stringify(this.cache) !== JSON.stringify(serverData)) {
                console.log('🔄 Обнаружены изменения, синхронизируем...');
                this.cache = serverData;
                this.updateLocalStorage();
                
                // Оповещаем страницу об изменениях
                window.dispatchEvent(new CustomEvent('server-data-updated'));
            }
        } catch (error) {
            console.error('❌ Ошибка синхронизации:', error);
        }
    }

    updateLocalStorage() {
        localStorage.setItem('vedgi_products', JSON.stringify(this.cache.products));
        localStorage.setItem('vedgi_users', JSON.stringify(this.cache.users));
        localStorage.setItem('vedgi_orders', JSON.stringify(this.cache.orders));
        localStorage.setItem('vedgi_messages', JSON.stringify(this.cache.messages));
    }

    // ============= МЕТОДЫ ДЛЯ РАБОТЫ С ДАННЫМИ =============
    getProducts() {
        return this.cache.products;
    }

    async addProduct(product) {
        product.id = 'p' + Date.now();
        this.cache.products.push(product);
        this.updateLocalStorage();
        await this.saveToServer();
        return product;
    }

    async updateProduct(id, updatedProduct) {
        const index = this.cache.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.cache.products[index] = { ...this.cache.products[index], ...updatedProduct };
            this.updateLocalStorage();
            await this.saveToServer();
        }
    }

    async deleteProduct(id) {
        this.cache.products = this.cache.products.filter(p => p.id !== id);
        this.updateLocalStorage();
        await this.saveToServer();
    }

    getOrders() {
        return this.cache.orders;
    }

    async addOrder(order) {
        order.id = 'ORD-' + Date.now().toString().slice(-8);
        this.cache.orders.push(order);
        this.updateLocalStorage();
        await this.saveToServer();
        return order;
    }

    async updateOrderStatus(orderId, status) {
        const order = this.cache.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.updateLocalStorage();
            await this.saveToServer();
        }
    }

    getUsers() {
        return this.cache.users;
    }

    checkPassword(email, password) {
        const user = this.cache.users.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...userWithoutPass } = user;
            return userWithoutPass;
        }
        return null;
    }

    getMessages() {
        return this.cache.messages;
    }

    async addMessage(message) {
        message.id = 'msg' + Date.now();
        message.date = new Date().toLocaleString();
        message.status = 'new';
        this.cache.messages.push(message);
        this.updateLocalStorage();
        await this.saveToServer();
        return message;
    }

    async updateMessage(id, updatedMessage) {
        const index = this.cache.messages.findIndex(m => m.id === id);
        if (index !== -1) {
            this.cache.messages[index] = { ...this.cache.messages[index], ...updatedMessage };
            this.updateLocalStorage();
            await this.saveToServer();
        }
    }
}

// Создаем глобальный экземпляр
window.serverDB = new ServerDatabase();

// Для совместимости со старым кодом
const db = {
    getProducts: () => serverDB.getProducts(),
    getOrders: () => serverDB.getOrders(),
    getUsers: () => serverDB.getUsers(),
    getMessages: () => serverDB.getMessages(),
    checkPassword: (email, password) => serverDB.checkPassword(email, password),
    addProduct: (product) => serverDB.addProduct(product),
    updateProduct: (id, product) => serverDB.updateProduct(id, product),
    deleteProduct: (id) => serverDB.deleteProduct(id),
    addOrder: (order) => serverDB.addOrder(order),
    updateOrderStatus: (id, status) => serverDB.updateOrderStatus(id, status),
    addMessage: (message) => serverDB.addMessage(message),
    updateMessage: (id, message) => serverDB.updateMessage(id, message)
};

window.db = db;