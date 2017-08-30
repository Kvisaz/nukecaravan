/**
 *  Универсальный паттерн для подписки и оповещения
 *  1. помещаем данные в конструкторе
 *  2. подписываем наблюдателей через subscribe
 *  3. оповещаем всех наблюдателей через
 *      // subscriber должен иметь реализацию функции update(state: WorldState)
 *  4. функция отписки не реализована, т.к. тут не используется
 */
function Observable(data) {
    this.data = data;
    this.subscribers = [];
}

Observable.prototype.subscribe = function (subscriber) {
    this.subscribers.push(subscriber);
};

// обновление оповещает всех подписчиков, передавая им новое состояние
Observable.prototype.update = function () {
    var index;
    var len = this.subscribers.length;
    for (index = 0; index < len; index++) {
        this.subscribers[index].update(this.data);
    }
};