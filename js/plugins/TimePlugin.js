/**
 *  Time Plugin - генерирует события, связанные со временем
 *  - game используется для случаев паузы
 *  - world передается как аргумент
 */

function TimePlugin() {
    this.time = 0; // общее время с начала игры, в миллисекундах
    this.dayDelta = GameConstants.STEP_IN_MS / GameConstants.DAY_IN_MS; // сколько дней в одном шаге игру
    this.lastDay = -1;  // отслеживанием наступление нового дня
}


TimePlugin.prototype.update = function (world) {
    if (world.stop) return; // если стоим - никаких изменений
    this.time += GameConstants.STEP_IN_MS; // увеличение времени
    world.day = Math.ceil(this.time / GameConstants.DAY_IN_MS); // текущий день, целый

    // Движение каравана в зависимости от того, сколько дней прошло
    this.updateDistance(this.dayDelta, world);

    // события связанные с наступлением нового дня
    if(this.lastDay!=world.day){
        this.consumeFood(world);
        this.lastDay = world.day;
    }

    // todo вынести в обновление расстояния
    // приветствие нулевого дня
    if (world.day === 0) {
        addLogMessage(world, Goodness.positive, R.strings.START_MESSAGE);
    }
};

// еда выдается один раз в день
TimePlugin.prototype.consumeFood = function (world) {
    world.food -= world.crew * Caravan.FOOD_PER_PERSON;
    if (world.food < 0) {
        world.food = 0;
    }
};

// обновить пройденный путь в зависимости от потраченного времени в днях
TimePlugin.prototype.updateDistance = function (dayDelta, world) {

    // todo сделать проверку на условие достижения
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
    var distanceDelta = speed * dayDelta;
    var moveVector = getCaravanDirection(world);
    world.x += moveVector.kx * distanceDelta;
    world.y += moveVector.ky * distanceDelta;
};