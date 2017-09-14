/*
 *   Дата класс для хранения состояния мира игры
 * */
function WorldState(stats) {
    this.day = 0;                // текущий день, с десятичными долям
    this.crew = stats.crew;
    this.oxen = stats.oxen;
    this.food = stats.food;
    this.firepower = stats.firepower;
    this.cargo = stats.cargo;
    this.money = stats.money;

    // лог событий, содержит день, описание и характеристику
    //  { day: 1, message: "Хорошо покушали", goodness: Goodness.positive}
    this.log = [];

    // координаты каравана, пункта отправления и назначения
    this.caravan = { x: 0, y: 0};
    this.from = {x: 0, y: 0};
    this.to = {x: 0, y: 0};

    this.distance = 0; // сколько всего пройдено

    this.gameover = false;  // gameover
    this.stop = true;    // маркер для обозначения того, что караван стоит
    this.uiLock = false; // маркер для блокировки интерфейса
}