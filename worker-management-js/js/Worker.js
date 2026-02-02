/**
 * Класс WORKER для управления данными работников
 * @module Worker
 */

class WORKER {
    /**
     * Конструктор класса WORKER
     * @param {string} fullName - Фамилия и инициалы
     * @param {string} position - Должность
     * @param {number} salary - Зарплата
     * @param {number} startYear - Год начала работы
     */
    constructor(fullName = "", position = "", salary = 0, startYear = new Date().getFullYear()) {
        this._fullName = fullName;
        this._position = position;
        this._salary = salary;
        this._startYear = startYear;
        this._id = Date.now() + Math.random();
    }

    // Геттеры
    get fullName() { return this._fullName; }
    get position() { return this._position; }
    get salary() { return this._salary; }
    get startYear() { return this._startYear; }
    get id() { return this._id; }

    // Сеттеры с валидацией
    set fullName(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            this._fullName = value.trim();
        } else {
            throw new Error("ФИО должно быть непустой строкой");
        }
    }

    set position(value) {
        if (typeof value === 'string' && value.trim().length > 0) {
            this._position = value.trim();
        } else {
            throw new Error("Должность должна быть непустой строкой");
        }
    }

    set salary(value) {
        const num = Number(value);
        if (!isNaN(num) && num >= 0) {
            this._salary = num;
        } else {
            throw new Error("Зарплата должна быть положительным числом");
        }
    }

    set startYear(value) {
        const year = Number(value);
        const currentYear = new Date().getFullYear();
        if (!isNaN(year) && year >= 1900 && year <= currentYear) {
            this._startYear = year;
        } else {
            throw new Error(`Год должен быть между 1900 и ${currentYear}`);
        }
    }

    /**
     * Рассчитывает стаж работы
     * @returns {number} Стаж в годах
     */
    calculateExperience() {
        const currentYear = new Date().getFullYear();
        return currentYear - this._startYear;
    }

    /**
     * Проверяет, превышает ли стаж заданное значение
     * @param {number} years - Минимальный стаж
     * @returns {boolean}
     */
    hasExperienceMoreThan(years) {
        return this.calculateExperience() > years;
    }

    /**
     * Отображает информацию о работнике
     * @returns {string} Форматированная строка
     */
    displayInfo() {
        return `${this._fullName}, ${this._position}, Стаж: ${this.calculateExperience()} лет, Зарплата: ${this._salary.toLocaleString()} руб.`;
    }

    /**
     * Обновляет данные работника
     * @param {Object} data - Новые данные
     */
    update(data) {
        if (data.fullName !== undefined) this.fullName = data.fullName;
        if (data.position !== undefined) this.position = data.position;
        if (data.salary !== undefined) this.salary = data.salary;
        if (data.startYear !== undefined) this.startYear = data.startYear;
    }

    /**
     * Создает копию объекта
     * @returns {WORKER} Новый экземпляр
     */
    clone() {
        return new WORKER(this._fullName, this._position, this._salary, this._startYear);
    }

    /**
     * Преобразует в объект
     * @returns {Object}
     */
    toObject() {
        return {
            id: this._id,
            fullName: this._fullName,
            position: this._position,
            salary: this._salary,
            startYear: this._startYear,
            experience: this.calculateExperience()
        };
    }
}

export default WORKER;