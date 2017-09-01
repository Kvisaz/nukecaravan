/**
 *  Time Plugin - генерирует события, связанные со временем
 *  - game используется для случаев паузы
 *  - world передается как аргумент
 */

function TimePlugin() {}


TimePlugin.prototype.update = function (world) {
    if (world.stop) return; // если стоим - никаких изменений

    // todo вынести в обновление расстояния
    // приветствие нулевого дня
    if(world.day===0){
        addLogMessage(world, Goodness.positive,R.strings.START_MESSAGE);
    }

    // вынести в основной цикл игры???
    var delta = 20; // миллисекунд прошло
    var days = delta / Caravan.DAY_IN_MS; // дней прошло
    world.day += Caravan.DAY_PER_STEP * days;

    // производим изменение параметров, связанных со временем
    this.consumeFood(world);
    // можно двигаться дальше только если есть еда
    // в данной версии наступает смерть
    if (world.food > 0) {
        // this.updateWeight(world);  //update weight
        this.updateDistance(delta, world);  //update progress
    }
};

// ---------------------------------------------------------------
TimePlugin.prototype.consumeFood = function (world) {
    world.food -= world.crew * Caravan.FOOD_PER_PERSON;
    if (world.food < 0) {
        world.food = 0;
    }
};

// ------------------------------------------------------------------------
TimePlugin.prototype.updateDistance = function (delta, world) {

    // todo сделать проверку на условие достижения

    // перегруз (когда становится больше нуля - не можем идти)
    var maxWeight = getCaravanMaxWeight(world);
    var weight = getCaravanWeight(world);
    var overweight = weight - maxWeight;

    if(overweight>0){
        addLogMessage(world, Goodness.negative, "Караван перегружен и не может двигаться");
        world.stop = true;
        return;
    }

    // пока перевес отрицательный, мы можем двигаться (и чем больше отрицательный перевес - тем больше скорость)
    var speed = Caravan.SLOW_SPEED - overweight/maxWeight * Caravan.FULL_SPEED;
    var distanceDelta = speed*delta/Caravan.DAY_IN_MS;

    var moveVector = getCaravanDirection(world);
    world.x += moveVector.kx * distanceDelta;
    world.y += moveVector.ky * distanceDelta;
};