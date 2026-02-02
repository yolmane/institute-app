/**
 * Класс для управления списком работников
 * @module WorkerList
 */

import WORKER from './Worker.js';

class WorkerList {
    constructor() {
        this._workers = [];
    }

    /**
     * Добавляет работника
     * @param {WORKER} worker
     */
    addWorker(worker) {
        if (worker instanceof WORKER) {
            this._workers.push(worker);
        } else {
            throw new Error("Можно добавлять только объекты класса WORKER");
        }
    }

    /**
     * Удаляет работника по ID
     * @param {number} id
     */
    removeWorker(id) {
        const index = this._workers.findIndex(w => w.id === id);
        if (index !== -1) {
            this._workers.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Находит работника по ID
     * @param {number} id
     * @returns {WORKER|null}
     */
    getWorker(id) {
        return this._workers.find(w => w.id === id) || null;
    }

    /**
     * Получает всех работников с опытом больше указанного
     * @param {number} minExperience
     * @returns {WORKER[]}
     */
    getWorkersWithExperience(minExperience) {
        return this._workers.filter(worker => 
            worker.hasExperienceMoreThan(minExperience)
        );
    }

    /**
     * Получает всех работников
     * @returns {WORKER[]}
     */
    getAllWorkers() {
        return [...this._workers];
    }

    /**
     * Количество работников
     * @returns {number}
     */
    get count() {
        return this._workers.length;
    }

    /**
     * Сохраняет список в LocalStorage
     */
    saveToLocalStorage() {
        const data = this._workers.map(worker => worker.toObject());
        localStorage.setItem('workers', JSON.stringify(data));
    }

    /**
     * Загружает список из LocalStorage
     */
    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workers') || '[]');
        this._workers = data.map(item => 
            new WORKER(item.fullName, item.position, item.salary, item.startYear)
        );
    }

    /**
     * Сортирует работников по стажу
     * @param {boolean} ascending - По возрастанию
     */
    sortByExperience(ascending = true) {
        this._workers.sort((a, b) => {
            const expA = a.calculateExperience();
            const expB = b.calculateExperience();
            return ascending ? expA - expB : expB - expA;
        });
    }

    /**
     * Вычисляет среднюю зарплату
     * @returns {number}
     */
    getAverageSalary() {
        if (this._workers.length === 0) return 0;
        const total = this._workers.reduce((sum, worker) => sum + worker.salary, 0);
        return total / this._workers.length;
    }
}

export default WorkerList;