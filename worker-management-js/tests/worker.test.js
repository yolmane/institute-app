/**
 * Тесты для класса WORKER
 */

import WORKER from '../js/Worker.js';
import WorkerList from '../js/WorkerList.js';

// Тесты для класса WORKER
describe('Класс WORKER', () => {
    let worker;

    beforeEach(() => {
        worker = new WORKER('Иванов И.И.', 'Юрист', 85000, 2018);
    });

    test('Создание экземпляра класса', () => {
        expect(worker).toBeInstanceOf(WORKER);
        expect(worker.fullName).toBe('Иванов И.И.');
        expect(worker.position).toBe('Юрист');
        expect(worker.salary).toBe(85000);
        expect(worker.startYear).toBe(2018);
    });

    test('Расчет стажа работы', () => {
        const currentYear = new Date().getFullYear();
        const expectedExperience = currentYear - 2018;
        expect(worker.calculateExperience()).toBe(expectedExperience);
    });

    test('Проверка стажа больше указанного значения', () => {
        expect(worker.hasExperienceMoreThan(2)).toBe(true);
        expect(worker.hasExperienceMoreThan(10)).toBe(false);
    });

    test('Обновление данных работника', () => {
        worker.update({
            fullName: 'Петров П.П.',
            salary: 95000
        });
        expect(worker.fullName).toBe('Петров П.П.');
        expect(worker.salary).toBe(95000);
    });

    test('Валидация данных', () => {
        expect(() => {
            worker.salary = -100;
        }).toThrow();
        
        expect(() => {
            worker.fullName = '';
        }).toThrow();
    });
});

// Тесты для класса WorkerList
describe('Класс WorkerList', () => {
    let workerList;
    let worker1, worker2, worker3;

    beforeEach(() => {
        workerList = new WorkerList();
        worker1 = new WORKER('Иванов И.И.', 'Юрист', 85000, 2018);
        worker2 = new WORKER('Петров П.П.', 'Аналитик', 95000, 2015);
        worker3 = new WORKER('Сидорова С.С.', 'Исследователь', 75000, 2020);
        
        workerList.addWorker(worker1);
        workerList.addWorker(worker2);
        workerList.addWorker(worker3);
    });

    test('Добавление и удаление работников', () => {
        expect(workerList.count).toBe(3);
        
        workerList.removeWorker(worker1.id);
        expect(workerList.count).toBe(2);
    });

    test('Поиск работников по стажу', () => {
        const experienced = workerList.getWorkersWithExperience(5);
        expect(experienced.length).toBe(1);
        expect(experienced[0].fullName).toBe('Петров П.П.');
    });

    test('Сортировка по стажу', () => {
        workerList.sortByExperience(true);
        const workers = workerList.getAllWorkers();
        expect(workers[0].fullName).toBe('Сидорова С.С.');
        expect(workers[2].fullName).toBe('Петров П.П.');
    });

    test('Сохранение и загрузка из LocalStorage', () => {
        workerList.saveToLocalStorage();
        
        const newList = new WorkerList();
        newList.loadFromLocalStorage();
        
        expect(newList.count).toBe(3);
    });
});