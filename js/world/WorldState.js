/*
 *   Дата класс для хранения состояния мира игры
 * */

function WorldState(stats) {
    this.day = stats.day;
    this.distance = stats.distance;
    this.crew = stats.crew;
    this.food = stats.food;
    this.oxen = stats.oxen;
    this.money = stats.money;
    this.firepower = stats.firepower;

    // ---- лог не инициализируется, просто сохраняется
    // содержит события в формате
    //  { day: "", message: "", goodness: "" }
    this.log = [];

    // пункт отправления
    this.from = { x: 0 };

    // пункт назначения
    this.to = { x: 1000 };

    this.dead = false;  // состояние смерти
    this.paused = false;    // если true - караван не идет, возможно, переживает какое-то событие

    // обновляемые поля, вычисляются WorldUpdater при обновлении мира
    this.capacity = 0;
    this.weight = 0;
}