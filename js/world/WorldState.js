/*
 *   Дата класс для хранения состояния мира игры
 * */
function WorldState(stats) {
    this.day = 0;           // текущий день, с десятичными долям
    this.crew = stats.crew; // количество людей
    this.oxen = stats.oxen; // количество быков
    this.food = stats.food; // запасы еды
    this.firepower = stats.firepower; // единиц оружия
    this.cargo = stats.cargo;   // товаров для торговли
    this.money = stats.money;   //деньги

    // лог событий, содержит день, описание и характеристику
    //  { day: 1, message: "Хорошо покушали", goodness: Goodness.positive}
    this.log = [];

    // координаты каравана, пункта отправления и назначения
    this.caravan = { x: 0, y: 0};
    this.from = {x: 0, y: 0};
    this.to = {x: 0, y: 0};

    this.distance = 0; // сколько всего пройдено

    this.gameover = false;  // gameover
    this.stop = false;    // маркер для обозначения того, что караван стоит
    this.uiLock = false; // маркер для блокировки интерфейса
}