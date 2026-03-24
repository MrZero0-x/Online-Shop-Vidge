// auth.js - модуль авторизации

class Auth {
    constructor() {
        this.SESSION_KEY = 'current_user';
        this.currentUser = this.getSession();
    }

    login(email, password) {
        const user = db.checkPassword(email, password);
        if (user) {
            this.setSession(user);
            return { success: true, message: 'Вход выполнен', user };
        }
        return { success: false, message: 'Неверный email или пароль' };
    }

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    setSession(user) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        this.currentUser = user;
    }

    getSession() {
        const session = localStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    getUser() {
        return this.currentUser;
    }

    updateAuthUI() {
        const authButtons = document.querySelectorAll('.auth-buttons');
        if (this.isAuthenticated()) {
            const user = this.getUser();
            authButtons.forEach(el => {
                el.innerHTML = `
                    <div class="user-menu">
                        <span class="user-name" onclick="toggleMenu(event)">${user.name} ▼</span>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="profile.html">👤 Личный кабинет</a>
                            ${this.isAdmin() ? '<a href="admin.html">⚙️ Админ-панель</a>' : ''}
                            <a href="#" onclick="logout(); return false;">🚪 Выйти</a>
                        </div>
                    </div>
                `;
            });
        } else {
            authButtons.forEach(el => {
                el.innerHTML = `
                    <a href="login.html" class="btn-login">Войти</a>
                    <a href="login.html?register=true" class="btn-register">Регистрация</a>
                `;
            });
        }
    }
}

const auth = new Auth();

// Функция для обновления UI
function updateAuthUI() {
    auth.updateAuthUI();
}