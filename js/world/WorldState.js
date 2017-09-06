/*
 *   Дата класс для хранения состояния мира игры
 * */
function WorldState(stats) {
    this.day = 0;                // текущий день, с десятичными долям
    this.crew = stats.crew;
    this.oxen = stats.oxen;
    this.food = stats.food;
    this.firepower = stats.firepower;
    this.goods = stats.goods; // todo implement сброс и награду
    this.money = stats.money;

    // ---- лог не инициализируется, просто сохраняется
    // содержит события в формате
    //  { day: "", message: "", goodness: "" }
    this.log = [];

    // координаты каравана
    this.x = 0;

    // пункт отправления и назначения
    this.from = { x: 0, y: 0 };
    this.to = { x: 1000, y: 0 };

    this.gameover = false;  // gameover
    this.stop = false;    // если true - караван не идет, возможно, переживает какое-то событие

    // флаг для обновления UI
    this.isChanged = false;
}