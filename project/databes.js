// database.js - полная база данных Vedgi

class VedgiDB {
    constructor() {
        this.STORAGE_KEY = 'vedgi_database';
        this.USERS_KEY = 'vedgi_users'; // Отдельный ключ для пользователей
        this.init();
    }

    init() {
        // Инициализация основной базы
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultData = {
                products: [
                    {
                        id: 'p1',
                        name: 'Черный Император',
                        category: 'male',
                        price: 18500,
                        oldPrice: 22000,
                        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300',
                        description: 'Древесно-пряный аромат с нотами черного перца, кедра и кожи.',
                        type: 'Древесный',
                        volume: '50 мл',
                        quantity: 15,
                        sold: 0,
                        inStock: true
                    },
                    {
                        id: 'p2',
                        name: 'Королевская ночь',
                        category: 'female',
                        price: 22000,
                        oldPrice: 25000,
                        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300',
                        description: 'Восточно-цветочный аромат с розой, жасмином и удам.',
                        type: 'Цветочный',
                        volume: '50 мл',
                        quantity: 8,
                        sold: 0,
                        inStock: true
                    },
                    {
                        id: 'p3',
                        name: 'Белый ворон',
                        category: 'unisex',
                        price: 26000,
                        image: 'https://images.unsplash.com/photo-1615634260162-2032185b1de8?w=300',
                        description: 'Альдегидный аромат с ирисом, мускусом и дубовым мхом.',
                        type: 'Альдегидный',
                        volume: '50 мл',
                        quantity: 5,
                        sold: 0,
                        inStock: true
                    },
                    {
                        id: 'p4',
                        name: 'Стальной характер',
                        category: 'male',
                        price: 21000,
                        image: 'https://images.unsplash.com/photo-1619994403073-2cd6a8f46b7b?w=300',
                        description: 'Холодный, уверенный аромат с бергамотом, ветивером и амброй.',
                        type: 'Цитрусовый',
                        volume: '50 мл',
                        quantity: 12,
                        sold: 0,
                        inStock: true
                    },
                    {
                        id: 'p5',
                        name: 'Алмазная королева',
                        category: 'female',
                        price: 24500,
                        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300',
                        description: 'Изысканный аромат с ирисом, ванилью и белым мускусом.',
                        type: 'Пудровый',
                        volume: '50 мл',
                        quantity: 7,
                        sold: 0,
                        inStock: true
                    },
                    {
                        id: 'p6',
                        name: 'Теневой совет',
                        category: 'unisex',
                        price: 28000,
                        image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300',
                        description: 'Мистический аромат с ладаном, табаком и удом.',
                        type: 'Дымный',
                        volume: '50 мл',
                        quantity: 3,
                        sold: 0,
                        inStock: true
                    }
                ],
                orders: [],
                messages: [],
                promocodes: [
                    {
                        id: 'promo1',
                        code: 'WELCOME20',
                        type: 'percent',
                        discount: 20,
                        minSum: 5000,
                        startDate: null,
                        endDate: null,
                        maxUses: 100,
                        uses: 0
                    },
                    {
                        id: 'promo2',
                        code: 'VIP500',
                        type: 'fixed',
                        discount: 500,
                        minSum: 10000,
                        startDate: null,
                        endDate: null,
                        maxUses: 50,
                        uses: 0
                    }
                ],
                settings: {}
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
        }

        // Инициализация пользователей, если их нет
        if (!localStorage.getItem(this.USERS_KEY)) {
            const defaultUsers = [
                {
                    id: '1',
                    name: 'Администратор',
                    email: 'admin@vedgi.ru',
                    password: 'admin123',
                    role: 'admin',
                    phone: '+7 (999) 123-45-67',
                    registered: new Date().toLocaleString(),
                    cart: [],
                    orders: []
                },
                {
                    id: '2',
                    name: 'Иван Петров',
                    email: 'ivan@mail.ru',
                    password: 'user123',
                    role: 'user',
                    phone: '+7 (999) 765-43-21',
                    registered: new Date().toLocaleString(),
                    cart: [],
                    orders: []
                },
                {
                    id: '3',
                    name: 'Елена Соколова',
                    email: 'elena@mail.ru',
                    password: 'elena123',
                    role: 'user',
                    phone: '+7 (999) 555-66-77',
                    registered: new Date().toLocaleString(),
                    cart: [],
                    orders: []
                },
                {
                    id: '4',
                    name: 'Мария Менеджер',
                    email: 'maria@vedgi.ru',
                    password: 'manager123',
                    role: 'manager',
                    phone: '+7 (999) 111-22-33',
                    registered: new Date().toLocaleString(),
                    cart: [],
                    orders: []
                }
            ];
            localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
    }

    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    // ============= ПОЛЬЗОВАТЕЛИ =============
    
    // Получить всех пользователей (без паролей для админки)
    getAllUsers() {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        return users.map(user => {
            const { password, ...userWithoutPass } = user;
            return userWithoutPass;
        });
    }

    // Получить всех пользователей с паролями (только для внутреннего использования)
    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    }

    // Получить пользователя по ID
    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    }

    // Получить пользователя по email
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    // Проверка пароля при входе
    checkPassword(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...userWithoutPass } = user;
            return userWithoutPass;
        }
        return null;
    }

    // Сохранение нового пользователя при регистрации
    saveUser(userData) {
        const users = this.getUsers();
        
        // Проверяем, есть ли уже такой email
        const existing = users.find(u => u.email === userData.email);
        if (existing) {
            return { success: false, message: 'Email уже используется' };
        }
        
        // Создаем нового пользователя
        const newUser = {
            id: 'u' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone || '',
            role: 'user',
            registered: new Date().toLocaleString(),
            cart: [],
            orders: []
        };
        
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        
        const { password, ...userWithoutPass } = newUser;
        return { success: true, user: userWithoutPass };
    }

    // Обновить пользователя
    updateUser(userId, updatedData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return { success: true };
        }
        return { success: false, message: 'Пользователь не найден' };
    }

    // Удалить пользователя
    deleteUser(userId) {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== userId);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(filtered));
        return { success: true };
    }

    // ============= НОВЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С РОЛЯМИ =============

    // Получить пользователей по роли
    getUsersByRole(role) {
        const users = this.getUsers();
        return users.filter(u => u.role === role).map(u => {
            const { password, ...userWithoutPass } = u;
            return userWithoutPass;
        });
    }

    // Изменить роль пользователя
    changeUserRole(userId, newRole) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            // Проверяем, что роль допустима
            const validRoles = ['user', 'manager', 'admin'];
            if (!validRoles.includes(newRole)) {
                return { success: false, message: 'Недопустимая роль' };
            }
            
            // Нельзя изменить роль администратора
            if (users[index].role === 'admin' && newRole !== 'admin') {
                return { success: false, message: 'Нельзя изменить роль администратора' };
            }
            
            users[index].role = newRole;
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            
            const { password, ...userWithoutPass } = users[index];
            return { success: true, user: userWithoutPass };
        }
        return { success: false, message: 'Пользователь не найден' };
    }

    // Получить всех менеджеров
    getManagers() {
        return this.getUsersByRole('manager');
    }

    // Получить всех администраторов
    getAdmins() {
        return this.getUsersByRole('admin');
    }

    // Проверка прав для разных действий
    checkPermission(userId, action) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) return false;
        
        const permissions = {
            // Админ может всё
            'admin': {
                'manage_users': true,      // управление пользователями
                'manage_products': true,    // управление товарами
                'manage_orders': true,      // управление заказами
                'manage_messages': true,    // управление сообщениями
                'manage_promocodes': true,  // управление промокодами
                'view_reports': true,        // просмотр отчетов
                'change_role': true,         // изменение ролей
                'delete_users': true         // удаление пользователей
            },
            // Менеджер может управлять товарами и заказами
            'manager': {
                'manage_users': false,       // НЕ может управлять пользователями
                'manage_products': true,     // может управлять товарами
                'manage_orders': true,       // может управлять заказами
                'manage_messages': true,     // может отвечать на сообщения
                'manage_promocodes': false,  // НЕ может управлять промокодами
                'view_reports': true,        // может видеть отчеты
                'change_role': false,        // НЕ может изменять роли
                'delete_users': false        // НЕ может удалять пользователей
            },
            // Обычный пользователь
            'user': {
                'manage_users': false,
                'manage_products': false,
                'manage_orders': false,
                'manage_messages': false,
                'manage_promocodes': false,
                'view_reports': false,
                'change_role': false,
                'delete_users': false
            }
        };
        
        return permissions[user.role]?.[action] || false;
    }

    // Получить статистику по пользователям
    getUserStats() {
        const users = this.getUsers();
        return {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            managers: users.filter(u => u.role === 'manager').length,
            users: users.filter(u => u.role === 'user').length
        };
    }

    // ============= ТОВАРЫ =============
    getProducts() {
        return this.getData().products || [];
    }

    getProductById(id) {
        return this.getProducts().find(p => p.id === id);
    }

    addProduct(product) {
        const data = this.getData();
        product.id = 'p' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        if (product.quantity === undefined) product.quantity = 0;
        if (product.sold === undefined) product.sold = 0;
        product.inStock = product.quantity > 0;
        
        data.products.push(product);
        this.saveData(data);
        return product;
    }

    updateProduct(id, updatedProduct) {
        const data = this.getData();
        const index = data.products.findIndex(p => p.id === id);
        
        if (index !== -1) {
            // Сохраняем количество продаж
            if (updatedProduct.sold === undefined) {
                updatedProduct.sold = data.products[index].sold || 0;
            }
            updatedProduct.inStock = updatedProduct.quantity > 0;
            data.products[index] = { ...data.products[index], ...updatedProduct };
            this.saveData(data);
            return data.products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const data = this.getData();
        data.products = data.products.filter(p => p.id !== id);
        this.saveData(data);
    }

    updateProductQuantity(productId, quantity) {
        const data = this.getData();
        const productIndex = data.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            data.products[productIndex].quantity -= quantity;
            data.products[productIndex].sold += quantity;
            data.products[productIndex].inStock = data.products[productIndex].quantity > 0;
            this.saveData(data);
            return true;
        }
        return false;
    }

    getProductStats() {
        const products = this.getProducts();
        const total = products.length;
        const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
        const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
        const maleCount = products.filter(p => p.category === 'male').length;
        const femaleCount = products.filter(p => p.category === 'female').length;
        const unisexCount = products.filter(p => p.category === 'unisex').length;
        const totalSum = products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
        const avgPrice = total > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / total) : 0;

        return { 
            total, 
            totalQuantity,
            totalSold,
            maleCount, 
            femaleCount, 
            unisexCount, 
            totalSum, 
            avgPrice 
        };
    }

    // ============= КОРЗИНА =============
    getCart(userId) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        return user?.cart || [];
    }

    addToCart(userId, productId, quantity = 1) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        const product = this.getProductById(productId);
        
        if (userIndex === -1 || !product) return { success: false, message: 'Ошибка' };
        
        if (product.quantity < quantity) {
            return { success: false, message: 'Недостаточно товара на складе' };
        }

        const cart = users[userIndex].cart || [];
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        users[userIndex].cart = cart;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true };
    }

    updateCartItem(userId, productId, quantity) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return { success: false };

        const cart = users[userIndex].cart || [];
        const itemIndex = cart.findIndex(item => item.productId === productId);

        if (itemIndex !== -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
        }

        users[userIndex].cart = cart;
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true };
    }

    removeFromCart(userId, productId) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].cart = (users[userIndex].cart || []).filter(
            item => item.productId !== productId
        );

        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return true;
    }

    clearCart(userId) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) return false;

        users[userIndex].cart = [];
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return true;
    }

    // ============= ЗАКАЗЫ =============
    getOrders() {
        return this.getData().orders || [];
    }

    getUserOrders(userId) {
        return this.getOrders().filter(o => o.userId === userId);
    }

    createOrder(userId, paymentMethod, address) {
        const data = this.getData();
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        const user = users[userIndex];
        
        if (userIndex === -1 || !user.cart || user.cart.length === 0) {
            return { success: false, message: 'Корзина пуста' };
        }
    
        // Проверка наличия товаров
        for (const item of user.cart) {
            const product = data.products.find(p => p.id === item.productId);
            if (!product || product.quantity < item.quantity) {
                return { 
                    success: false, 
                    message: `Недостаточно товара "${item.name}" на складе` 
                };
            }
        }
    
        const total = user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-8),
            userId: userId,
            customerName: user.name,
            date: new Date().toLocaleString(),
            items: [...user.cart],
            total: total,
            status: 'new',
            paymentMethod: paymentMethod,
            address: address
        };
    
        data.orders.push(order);
    
        // СПИСАНИЕ ТОВАРОВ СО СКЛАДА
        for (const item of user.cart) {
            const product = data.products.find(p => p.id === item.productId);
            if (product) {
                product.quantity -= item.quantity;
                product.sold = (product.sold || 0) + item.quantity;
                product.inStock = product.quantity > 0;
            }
        }
    
        // Добавление заказа пользователю
        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.push(order.id);
    
        // Очистка корзины
        users[userIndex].cart = [];
    
        this.saveData(data);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        
        return { 
            success: true, 
            order: order,
            message: 'Заказ успешно оформлен'
        };
    }

    updateOrderStatus(orderId, newStatus) {
        const data = this.getData();
        const index = data.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            data.orders[index].status = newStatus;
            this.saveData(data);
        }
    }

    getOrdersStats() {
        const orders = this.getOrders();
        return {
            total: orders.length,
            new: orders.filter(o => o.status === 'new').length,
            processing: orders.filter(o => o.status === 'processing').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
            revenue: orders.reduce((sum, o) => sum + o.total, 0)
        };
    }

    // ============= СООБЩЕНИЯ =============
    getMessages() {
        return this.getData().messages || [];
    }

    getMessageById(id) {
        return this.getMessages().find(m => m.id === id);
    }

    addMessage(message) {
        const data = this.getData();
        message.id = 'msg' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        message.date = new Date().toLocaleString();
        message.status = 'new';
        message.answer = null;
        
        data.messages.push(message);
        this.saveData(data);
        return message;
    }

    updateMessage(id, updatedMessage) {
        const data = this.getData();
        const index = data.messages.findIndex(m => m.id === id);
        if (index !== -1) {
            data.messages[index] = { ...data.messages[index], ...updatedMessage };
            this.saveData(data);
            return data.messages[index];
        }
        return null;
    }

    deleteMessage(id) {
        const data = this.getData();
        data.messages = data.messages.filter(m => m.id !== id);
        this.saveData(data);
    }

    getMessageStats() {
        const messages = this.getMessages();
        return {
            total: messages.length,
            new: messages.filter(m => m.status === 'new').length,
            answered: messages.filter(m => m.status === 'answered').length
        };
    }

    // ============= ПРОМОКОДЫ =============
    getPromocodes() {
        return this.getData().promocodes || [];
    }

    getPromocodeById(id) {
        return this.getPromocodes().find(p => p.id === id);
    }

    addPromocode(promocode) {
        const data = this.getData();
        promocode.id = 'promo' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        promocode.uses = 0;
        data.promocodes.push(promocode);
        this.saveData(data);
        return promocode;
    }

    updatePromocode(id, updatedPromocode) {
        const data = this.getData();
        const index = data.promocodes.findIndex(p => p.id === id);
        if (index !== -1) {
            data.promocodes[index] = { ...data.promocodes[index], ...updatedPromocode };
            this.saveData(data);
            return data.promocodes[index];
        }
        return null;
    }

    deletePromocode(id) {
        const data = this.getData();
        data.promocodes = data.promocodes.filter(p => p.id !== id);
        this.saveData(data);
    }

    getPromocodeStats() {
        const promocodes = this.getPromocodes();
        const active = promocodes.filter(p => {
            const now = new Date();
            const start = p.startDate ? new Date(p.startDate) : null;
            const end = p.endDate ? new Date(p.endDate) : null;
            return (!start || start <= now) && (!end || end >= now) && (p.uses < p.maxUses);
        }).length;

        return {
            total: promocodes.length,
            active: active
        };
    }

    // ============= ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =============
    generateId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// Создаем глобальный экземпляр
const db = new VedgiDB();

// Делаем db доступным глобально
window.db = db;