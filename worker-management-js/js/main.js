/**
 * Основной модуль приложения
 * @module main
 */

import WORKER from './js/Worker.js';
import WorkerList from './js/WorkerList.js';

class WorkerApp {
    constructor() {
        this.workerList = new WorkerList();
        this.init();
    }

    init() {
        // Загрузка сохраненных данных
        this.workerList.loadFromLocalStorage();
        
        // Инициализация обработчиков событий
        this.initEventListeners();
        
        // Отображение существующих работников
        this.displayWorkers();
    }

    initEventListeners() {
        // Форма добавления работника
        document.getElementById('addWorkerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWorker();
        });

        // Кнопка поиска по стажу
        document.getElementById('filterExperience').addEventListener('click', () => {
            this.filterByExperience();
        });

        // Кнопка сохранения
        document.getElementById('saveData').addEventListener('click', () => {
            this.saveData();
        });

        // Кнопка загрузки тестовых данных
        document.getElementById('loadTestData').addEventListener('click', () => {
            this.loadTestData();
        });

        // Кнопка сортировки
        document.getElementById('sortAsc').addEventListener('click', () => {
            this.sortWorkers(true);
        });

        document.getElementById('sortDesc').addEventListener('click', () => {
            this.sortWorkers(false);
        });
    }

    addWorker() {
        try {
            const fullName = document.getElementById('fullName').value;
            const position = document.getElementById('position').value;
            const salary = parseFloat(document.getElementById('salary').value);
            const startYear = parseInt(document.getElementById('startYear').value);

            // Создание нового работника
            const worker = new WORKER(fullName, position, salary, startYear);
            
            // Добавление в список
            this.workerList.addWorker(worker);
            
            // Очистка формы
            document.getElementById('addWorkerForm').reset();
            
            // Отображение обновленного списка
            this.displayWorkers();
            
            // Показ сообщения об успехе
            this.showMessage('Работник успешно добавлен!', 'success');
            
        } catch (error) {
            this.showMessage(`Ошибка: ${error.message}`, 'error');
        }
    }

    filterByExperience() {
        const minExperience = parseInt(document.getElementById('minExperience').value);
        
        if (isNaN(minExperience) || minExperience < 0) {
            this.showMessage('Введите корректное значение стажа', 'error');
            return;
        }

        const filteredWorkers = this.workerList.getWorkersWithExperience(minExperience);
        
        if (filteredWorkers.length === 0) {
            this.showMessage(`Работников со стажем более ${minExperience} лет не найдено`, 'warning');
        } else {
            this.displayFilteredWorkers(filteredWorkers, minExperience);
        }
    }

    displayWorkers() {
        const workers = this.workerList.getAllWorkers();
        const container = document.getElementById('workersList');
        
        container.innerHTML = '';
        
        if (workers.length === 0) {
            container.innerHTML = '<p class="empty-message">Работники не добавлены</p>';
            return;
        }

        workers.forEach(worker => {
            const workerElement = this.createWorkerElement(worker);
            container.appendChild(workerElement);
        });

        // Обновление статистики
        this.updateStats();
    }

    displayFilteredWorkers(workers, minExperience) {
        const container = document.getElementById('filteredResults');
        
        container.innerHTML = `
            <h3>Работники со стажем более ${minExperience} лет:</h3>
            <div class="workers-grid">
                ${workers.map(worker => `
                    <div class="worker-card">
                        <h4>${worker.fullName}</h4>
                        <p>Должность: ${worker.position}</p>
                        <p>Стаж: ${worker.calculateExperience()} лет</p>
                        <p>Зарплата: ${worker.salary.toLocaleString()} руб.</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createWorkerElement(worker) {
        const div = document.createElement('div');
        div.className = 'worker-item';
        div.innerHTML = `
            <div class="worker-info">
                <strong>${worker.fullName}</strong>
                <div>Должность: ${worker.position}</div>
                <div>Стаж: ${worker.calculateExperience()} лет</div>
                <div>Зарплата: ${worker.salary.toLocaleString()} руб.</div>
            </div>
            <button class="btn-delete" data-id="${worker.id}">Удалить</button>
        `;

        // Обработчик удаления
        div.querySelector('.btn-delete').addEventListener('click', (e) => {
            const id = parseFloat(e.target.dataset.id);
            if (this.workerList.removeWorker(id)) {
                this.displayWorkers();
                this.showMessage('Работник удален', 'success');
            }
        });

        return div;
    }

    updateStats() {
        const total = this.workerList.count;
        const avgSalary = this.workerList.getAverageSalary();
        
        document.getElementById('totalWorkers').textContent = total;
        document.getElementById('avgSalary').textContent = avgSalary.toFixed(2);
    }

    sortWorkers(ascending) {
        this.workerList.sortByExperience(ascending);
        this.displayWorkers();
        this.showMessage(`Сортировка по стажу ${ascending ? 'по возрастанию' : 'по убыванию'}`, 'info');
    }

    saveData() {
        this.workerList.saveToLocalStorage();
        this.showMessage('Данные сохранены в LocalStorage', 'success');
    }

    loadTestData() {
        const testWorkers = [
            new WORKER("Иванов И.И.", "Юрист-эксперт", 85000, 2018),
            new WORKER("Петров П.П.", "Старший исследователь", 120000, 2015),
            new WORKER("Сидорова С.С.", "Аналитик права", 95000, 2020),
            new WORKER("Кузнецов К.К.", "Руководитель проекта", 150000, 2012),
            new WORKER("Смирнова А.В.", "Младший исследователь", 65000, 2022)
        ];

        testWorkers.forEach(worker => this.workerList.addWorker(worker));
        this.displayWorkers();
        this.showMessage('Тестовые данные загружены', 'success');
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message message-${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new WorkerApp();
});