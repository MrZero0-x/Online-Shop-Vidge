// shop-logic.js

const WEEKLY_LIMIT = 100; // Максимум штук в неделю на пользователя

// Функция для получения количества купленных единиц товара за неделю
function getWeeklyPurchasedCount(userId, productId) {
    if (!userId) return 0;
    const weeklyKey = `weekly_purchases_${userId}`;
    const purchases = JSON.parse(localStorage.getItem(weeklyKey)) || [];
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    return purchases
        .filter(p => p.productId === productId && p.timestamp > oneWeekAgo)
        .reduce((sum, p) => sum + p.quantity, 0);
}

// Функция для записи факта покупки (будет вызываться при оформлении заказа)
function recordWeeklyPurchase(userId, productId, quantity) {
    if (!userId) return;
    const weeklyKey = `weekly_purchases_${userId}`;
    const purchases = JSON.parse(localStorage.getItem(weeklyKey)) || [];
    
    purchases.push({
        productId: productId,
        quantity: quantity,
        timestamp: Date.now()
    });
    
    localStorage.setItem(weeklyKey, JSON.stringify(purchases));
}