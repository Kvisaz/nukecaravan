/**
 *  Core Plugin - базовые события
 *  - изменение дня
 *  - потребление пищи
 *  - перемещение к цели
 */

CorePlugin = {};

CorePlugin.init = function (world) {
    this.world = world;
    this.time = 0; // общее время с начала игры, в миллисекундах
    this.dayDelta = GameConstants.STEP_IN_MS / GameConstants.DAY_IN_MS; // сколько дней в одном шаге игру
    this.lastDay = -1;  // отслеживанием наступление нового дня
};

CorePlugin.update = function () {
    if (this.world.stop) return; // если стоим - никаких изменений
    this.time += GameConstants.STEP_IN_MS; // увеличение времени
    this.world.day = Math.ceil(this.time / GameConstants.DAY_IN_MS); // текущий день, целый

    // Движение каравана в зависимости от того, сколько дней прошло
    this.updateDistance(this.dayDelta, this.world);

    // события связанные с наступлением нового дня
    if (this.lastDay != this.world.day) {
        this.consumeFood(this.world);
        this.lastDay = this.world.day;
    }
};

// еда выдается один раз в день
CorePlugin.consumeFood = function (world) {
    world.food -= world.crew * Caravan.FOOD_PER_PERSON;
    if (world.food < 0) {
        world.food = 0;
    }
};

// обновить пройденный путь в зависимости от потраченного времени в днях
CorePlugin.updateDistance = function (dayDelta, world) {
    var maxWeight = getCaravanMaxWeight(world);
    var weight = getCaravanWeight(world);

    // при перевесе останавливаемся
    var speed = Caravan.FULL_SPEED * Math.max(0, 1 - weight/maxWeight);
    console.log("speed = "+ speed);

    // расстояние, которое может пройти караван при такой скорости
    var distanceDelta = speed * dayDelta;

    // вычисляем угол направления
    var dx = world.to.x - world.caravan.x;
    var dy = world.to.y - world.caravan.y;
    var angle = Math.atan2(dy, dx);

    // вычисляем угол направления
    world.caravan.x += Math.cos(angle) * distanceDelta;
    world.caravan.y += Math.sin(angle) * distanceDelta;

    if (dx != 0 && dy != 0) {  // если есть смещение - наращиваем дистанцию
        world.distance += distanceDelta;
    }
};