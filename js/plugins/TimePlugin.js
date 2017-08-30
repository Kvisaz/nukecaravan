/**
 *  Time Plugin - генерирует события, связанные со временем
 *  - game используется для случаев паузы
 *  - world передается как аргумент
 */

function TimePlugin(game) {
    this.game = game;
}

TimePlugin.prototype.run = function (world) {
    // приветствие нулевого дня
    if(world.day===0){
        addLogMessage(world, Goodness.positive,R.strings.START_MESSAGE);
    }
    world.day += Caravan.DAY_PER_STEP;

    // производим изменение параметров, связанных со временем
    this.consumeFood(world);
    // можно двигаться дальше только если есть еда
    // в данной версии наступает смерть
    if (world.food > 0) {
        // this.updateWeight(world);  //update weight
        this.updateDistance(world);  //update progress
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
TimePlugin.prototype.updateDistance = function (world) {
    // перегруз (когда становится больше нуля - не можем идти)
    var overweight = world.weight - world.capacity;

    if(overweight>0){
        addLogMessage(world, Goodness.negative, "Караван перегружен и не может двигаться");
        world.paused = true; // никаких событий не происходит, мы стоим на месте
        return;
    }

    // пока перевес отрицательный, мы можем двигаться (и чем больше отрицательный перевес - тем больше скорость)
    var speed = Caravan.SLOW_SPEED - overweight/world.capacity * Caravan.FULL_SPEED;
    world.distance += speed;
};