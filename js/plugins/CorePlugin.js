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
    this.lastDay = -1;  // отслеживаем наступление нового дня
    this.speedDelta = Caravan.FULL_SPEED - Caravan.SLOW_SPEED; // разница между полной и минимальной скоростью
};

CorePlugin.update = function () {
    if (this.world.stop) return; // если стоим - никаких изменений
    this.time += GameConstants.STEP_IN_MS; // увеличение времени
    this.world.day = Math.ceil(this.time / GameConstants.DAY_IN_MS); // текущий день, целый

    // Движение каравана в зависимости от того, сколько дней прошло
    this.updateDistance(this.dayDelta, this.world);

    // события связанные с наступлением нового дня
    if (this.lastDay < this.world.day) {
        this.consumeFood(this.world);
        this.lastDay = this.world.day;
    }
};

// еда выдается один раз в день
CorePlugin.consumeFood = function (world) {
    var needFood = world.crew * Caravan.FOOD_PER_PERSON;
    var eated = Math.min(needFood, world.food); // съесть можем не больше того, что имеем
    world.food -= eated; // съедаем запасы еды

    if (world.food == 0) {
        // автопоедание быков при минимальных запасах еды - временный фикс
        if (world.oxen > 0) {
            world.food += Caravan.MEAT_PER_OX;
            world.oxen--;
            addLogMessage(world, Goodness.negative, "Кончились запасы еды. 1 брамин забит на мясо.")
        }
    }
};

// обновить пройденный путь в зависимости от потраченного времени в днях
CorePlugin.updateDistance = function (dayDelta, world) {
    var maxWeight = getCaravanMaxWeight(world);
    var weight = getCaravanWeight(world);

    // при перевесе - Caravan.SLOW_SPEED
    // при 0 весе - Caravan.FULL_SPEED
    var speed = Caravan.SLOW_SPEED + (this.speedDelta) * Math.max(0, 1 - weight / maxWeight);

    // расстояние, которое может пройти караван при такой скорости
    var distanceDelta = speed * dayDelta;

    // вычисляем расстояние до цели
    var dx = world.to.x - world.caravan.x;
    var dy = world.to.y - world.caravan.y;

    // если мы находимся около цели - останавливаемся
    if (areNearPoints(world.caravan, world.to, Caravan.TOUCH_DISTANCE)) {
        world.stop = true;
        return;
    }

    // до цели еще далеко - рассчитываем угол перемещения
    // и получаем смещение по координатам
    var angle = Math.atan2(dy, dx);
    world.caravan.x += Math.cos(angle) * distanceDelta;
    world.caravan.y += Math.sin(angle) * distanceDelta;
    world.distance += distanceDelta;
};

Game.addPlugin(CorePlugin);