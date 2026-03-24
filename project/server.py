from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import threading
import time

app = Flask(__name__, static_folder='static')
CORS(app)  # Разрешаем запросы с других устройств

DATA_FILE = 'database.json'
lock = threading.Lock()  # Для безопасной записи

# ============= РАБОТА С ФАЙЛОМ БАЗЫ ДАННЫХ =============
def load_database():
    """Загрузка данных из файла"""
    if not os.path.exists(DATA_FILE):
        # Создаем базу данных по умолчанию
        default_db = {
            "products": [
                {
                    "id": "p1",
                    "name": "Черный Император",
                    "category": "male",
                    "price": 18500,
                    "oldPrice": 22000,
                    "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300",
                    "description": "Древесно-пряный аромат с нотами черного перца, кедра и кожи.",
                    "type": "Древесный",
                    "volume": "50 мл",
                    "quantity": 15,
                    "sold": 0,
                    "inStock": True
                },
                {
                    "id": "p2",
                    "name": "Королевская ночь",
                    "category": "female",
                    "price": 22000,
                    "oldPrice": 25000,
                    "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300",
                    "description": "Восточно-цветочный аромат с розой, жасмином и удам.",
                    "type": "Цветочный",
                    "volume": "50 мл",
                    "quantity": 8,
                    "sold": 0,
                    "inStock": True
                },
                {
                    "id": "p3",
                    "name": "Белый ворон",
                    "category": "unisex",
                    "price": 26000,
                    "image": "https://images.unsplash.com/photo-1615634260162-2032185b1de8?w=300",
                    "description": "Альдегидный аромат с ирисом, мускусом и дубовым мхом.",
                    "type": "Альдегидный",
                    "volume": "50 мл",
                    "quantity": 5,
                    "sold": 0,
                    "inStock": True
                },
                {
                    "id": "p4",
                    "name": "Стальной характер",
                    "category": "male",
                    "price": 21000,
                    "image": "https://images.unsplash.com/photo-1619994403073-2cd6a8f46b7b?w=300",
                    "description": "Холодный, уверенный аромат с бергамотом, ветивером и амброй.",
                    "type": "Цитрусовый",
                    "volume": "50 мл",
                    "quantity": 12,
                    "sold": 0,
                    "inStock": True
                },
                {
                    "id": "p5",
                    "name": "Алмазная королева",
                    "category": "female",
                    "price": 24500,
                    "image": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300",
                    "description": "Изысканный аромат с ирисом, ванилью и белым мускусом.",
                    "type": "Пудровый",
                    "volume": "50 мл",
                    "quantity": 7,
                    "sold": 0,
                    "inStock": True
                },
                {
                    "id": "p6",
                    "name": "Теневой совет",
                    "category": "unisex",
                    "price": 28000,
                    "image": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=300",
                    "description": "Мистический аромат с ладаном, табаком и удом.",
                    "type": "Дымный",
                    "volume": "50 мл",
                    "quantity": 3,
                    "sold": 0,
                    "inStock": True
                }
            ],
            "users": [
                {
                    "id": "admin1",
                    "name": "Администратор",
                    "email": "admin@vedgi.ru",
                    "password": "admin123",
                    "role": "admin",
                    "phone": "+7 (999) 123-45-67"
                },
                {
                    "id": "user1",
                    "name": "Иван Петров",
                    "email": "ivan@mail.ru",
                    "password": "user123",
                    "role": "user",
                    "phone": "+7 (999) 765-43-21"
                }
            ],
            "orders": [],
            "messages": [],
            "promocodes": [
                {
                    "id": "promo1",
                    "code": "WELCOME20",
                    "type": "percent",
                    "discount": 20,
                    "minSum": 5000,
                    "startDate": None,
                    "endDate": None,
                    "maxUses": 100,
                    "uses": 0
                }
            ],
            "weekly_purchases": {}
        }
        save_database(default_db)
        return default_db
    
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_database(data):
    """Сохранение данных в файл"""
    with lock:  # Блокируем для безопасности при одновременных записях
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

# ============= API ЭНДПОИНТЫ =============

@app.route('/api/data', methods=['GET'])
def get_data():
    """Получить все данные"""
    return jsonify(load_database())

@app.route('/api/data', methods=['POST'])
def update_data():
    """Обновить все данные"""
    data = request.json
    save_database(data)
    return jsonify({"success": True, "message": "Данные сохранены"})

@app.route('/api/products', methods=['GET'])
def get_products():
    """Получить товары"""
    db = load_database()
    return jsonify(db.get('products', []))

@app.route('/api/products', methods=['POST'])
def add_product():
    """Добавить товар"""
    db = load_database()
    product = request.json
    product['id'] = f"p{int(time.time() * 1000)}"
    
    if 'products' not in db:
        db['products'] = []
    
    db['products'].append(product)
    save_database(db)
    return jsonify({"success": True, "product": product})

@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Обновить товар"""
    db = load_database()
    updated_product = request.json
    
    for i, p in enumerate(db.get('products', [])):
        if p['id'] == product_id:
            db['products'][i] = {**p, **updated_product}
            break
    
    save_database(db)
    return jsonify({"success": True})

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Удалить товар"""
    db = load_database()
    db['products'] = [p for p in db.get('products', []) if p['id'] != product_id]
    save_database(db)
    return jsonify({"success": True})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Получить заказы"""
    db = load_database()
    return jsonify(db.get('orders', []))

@app.route('/api/orders', methods=['POST'])
def add_order():
    """Добавить заказ"""
    db = load_database()
    order = request.json
    
    if 'orders' not in db:
        db['orders'] = []
    
    # Генерируем ID заказа
    order['id'] = f"ORD-{str(int(time.time()))[-8:]}"
    order['date'] = datetime.now().strftime("%d.%m.%Y %H:%M")
    
    db['orders'].append(order)
    
    # Обновляем количество товаров на складе
    for item in order['items']:
        for product in db.get('products', []):
            if product['id'] == item['productId']:
                product['quantity'] -= item['quantity']
                product['sold'] = product.get('sold', 0) + item['quantity']
                product['inStock'] = product['quantity'] > 0
                break
    
    save_database(db)
    return jsonify({"success": True, "order": order})

@app.route('/api/orders/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Обновить статус заказа"""
    db = load_database()
    data = request.json
    
    for order in db.get('orders', []):
        if order['id'] == order_id:
            order['status'] = data['status']
            break
    
    save_database(db)
    return jsonify({"success": True})

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Получить сообщения"""
    db = load_database()
    return jsonify(db.get('messages', []))

@app.route('/api/messages', methods=['POST'])
def add_message():
    """Добавить сообщение"""
    db = load_database()
    message = request.json
    
    if 'messages' not in db:
        db['messages'] = []
    
    message['id'] = f"msg{int(time.time() * 1000)}"
    message['date'] = datetime.now().strftime("%d.%m.%Y %H:%M")
    message['status'] = 'new'
    
    db['messages'].append(message)
    save_database(db)
    return jsonify({"success": True, "message": message})

@app.route('/api/messages/<message_id>', methods=['PUT'])
def update_message(message_id):
    """Обновить сообщение (ответить)"""
    db = load_database()
    updated_message = request.json
    
    for i, m in enumerate(db.get('messages', [])):
        if m['id'] == message_id:
            db['messages'][i] = {**m, **updated_message}
            break
    
    save_database(db)
    return jsonify({"success": True})

@app.route('/api/login', methods=['POST'])
def login():
    """Авторизация пользователя"""
    db = load_database()
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    for user in db.get('users', []):
        if user['email'] == email and user['password'] == password:
            user_copy = user.copy()
            del user_copy['password']  # Не отправляем пароль
            return jsonify({"success": True, "user": user_copy})
    
    return jsonify({"success": False, "message": "Неверный email или пароль"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    """Регистрация пользователя"""
    db = load_database()
    user_data = request.json
    
    # Проверяем, есть ли уже такой email
    for user in db.get('users', []):
        if user['email'] == user_data['email']:
            return jsonify({"success": False, "message": "Email уже используется"}), 400
    
    # Создаем нового пользователя
    new_user = {
        'id': f"u{int(time.time() * 1000)}",
        'name': user_data['name'],
        'email': user_data['email'],
        'password': user_data['password'],
        'phone': user_data.get('phone', ''),
        'role': 'user'
    }
    
    if 'users' not in db:
        db['users'] = []
    
    db['users'].append(new_user)
    save_database(db)
    
    user_copy = new_user.copy()
    del user_copy['password']
    
    return jsonify({"success": True, "user": user_copy})

# ============= СТАТИЧЕСКИЕ ФАЙЛЫ =============
@app.route('/')
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# ============= ЗАПУСК СЕРВЕРА =============
if __name__ == '__main__':
    # Создаем папку static если её нет
    if not os.path.exists('static'):
        os.makedirs('static')
    
    # Запускаем сервер на всех интерфейсах
    app.run(host='0.0.0.0', port=5000, debug=True)
