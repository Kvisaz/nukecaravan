/*
 *   Дата класс для хранения состояния мира игры
 * */
function WorldState(stats) {
    this.day = 0;                // текущий день, с десятичными долям
    this.crew = stats.crew;
    this.oxen = stats.oxen;
    this.food = stats.food;
    this.firepower = stats.firepower;
    this.cargo = stats.cargo; // todo implement сброс и награду
    this.money = stats.money;

    // ---- лог не инициализируется, просто сохраняется
    // содержит события в формате
    //  { day: "", message: "", goodness: "" }
    this.log = [];

    this.distance = 0; // сколько всего пройдено

    // координаты каравана
    this.caravan = { x: 0, y: 0};

    // пункт отправления и назначения
    this.from = {x: 0, y: 0};
    this.to = {x: 0, y: 0};

    this.gameover = false;  // game over
    this.stop = true;    // маркер для обозначения движения
    this.uiLock = false; // маркер для обозначения, что данный плагин перехватывает все действия пользователя, или не должен реагировать, если кто-то перехватил
}