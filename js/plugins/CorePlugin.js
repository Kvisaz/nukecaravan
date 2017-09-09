/**
 *  Core Plugin - базовые события
 *  - изменение дня
 *  - потребление пищи
 *  - перемещение к цели
 */

function CorePlugin() {
    this.time = 0; // общее время с начала игры, в миллисекундах
    this.dayDelta = GameConstants.STEP_IN_MS / GameConstants.DAY_IN_MS; // сколько дней в одном шаге игру
    this.lastDay = -1;  // отслеживанием наступление нового дня
}

CorePlugin.prototype.update = function (world) {
    if (world.stop) return; // если стоим - никаких изменений
    this.time += GameConstants.STEP_IN_MS; // увеличение времени
    world.day = Math.ceil(this.time / GameConstants.DAY_IN_MS); // текущий день, целый

    // Движение каравана в зависимости от того, сколько дней прошло
    this.updateDistance(this.dayDelta, world);

    // события связанные с наступлением нового дня
    if (this.lastDay != world.day) {
        this.consumeFood(world);
        this.lastDay = world.day;
    }
};

// еда выдается один раз в день
CorePlugin.prototype.consumeFood = function (world) {
    world.food -= world.crew * Caravan.FOOD_PER_PERSON;
    if (world.food < 0) {
        world.food = 0;
    }
};

// обновить пройденный путь в зависимости от потраченного времени в днях
CorePlugin.prototype.updateDistance = function (dayDelta, world) {
    // перегруз (когда становится больше нуля - не можем идти)
    var maxWeight = getCaravanMaxWeight(world);
    var weight = getCaravanWeight(world);
    var overweight = weight - maxWeight;

    if (overweight > 0) {
        addLogMessage(world, Goodness.negative, "Караван перегружен и не может двигаться");
        world.stop = true;
        return;
    }
    // пока перевес отрицательный, мы можем двигаться (и чем больше отрицательный перевес - тем больше скорость)
    var speed = Caravan.SLOW_SPEED - overweight / maxWeight * Caravan.FULL_SPEED;
    var distanceDelta = speed * dayDelta; // расстояние, которое должен пройти караван

    var dx = world.to.x - world.caravan.x;
    var dy = world.to.y - world.caravan.y;
    var angle = Math.atan2(dy, dx);

    world.caravan.x += Math.cos(angle) * distanceDelta;
    world.caravan.y -= Math.sin(angle) * distanceDelta;

    var signX = getSign(dx); // знак смещения, 1, 0 или -1
    var signY = getSign(dy); // знак смещения, 1, 0 или -1

    if (dx != 0 && dy != 0) {  // если есть смещение - наращиваем дистанцию
        world.distance += distanceDelta;
    }
};