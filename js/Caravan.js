var Caravan = Caravan || {};

Caravan.Caravan = {};

Caravan.Caravan.init = function (stats) {
    this.day = stats.day;
    this.distance = stats.distance;
    this.crew = stats.crew;
    this.food = stats.food;
    this.oxen = stats.oxen;
    this.money = stats.money;
    this.firepower = stats.firepower;
};


//update weight and capacity
Caravan.Caravan.updateWeight = function () {
    var droppedFood = 0;
    var droppedGuns = 0;

    //how much can the caravan carry
    this.capacity = this.oxen * Caravan.WEIGHT_PER_OX + this.crew * Caravan.WEIGHT_PER_PERSON;

    //how much weight do we currently have
    this.weight = this.food * Caravan.FOOD_WEIGHT + this.firepower * Caravan.FIREPOWER_WEIGHT;

    // Я сбрасываю сначала еду, так как еду можно пополнить с оружием в руках - eSTet
    while (this.food && this.capacity <= this.weight) {
        this.food--;
        this.weight -= Caravan.FOOD_WEIGHT;
        droppedFood++;
    }

    if (droppedFood) {
        this.ui.notify(R.strings.DROPPED_FOOD.withArg(droppedFood));
    }

    // Я сбрасываю сначала еду, так как еду можно пополнить с оружием в руках - eSTet

    //drop things behind if it's too much weight
    //assume guns get dropped before food
    while (this.firepower && this.capacity <= this.weight) {
        this.firepower--;
        this.weight -= Caravan.FIREPOWER_WEIGHT;
        droppedGuns++;
    }

    if (droppedGuns) {
        this.ui.notify(R.strings.DROPPED_GUNS.withArg(droppedGuns));
    }

};


//update covered distance
Caravan.Caravan.updateDistance = function () {
    //the closer to capacity, the slower
    var diff = this.capacity - this.weight;
    var speed = Caravan.SLOW_SPEED + diff / this.capacity * Caravan.FULL_SPEED;
    this.distance += speed;
};

//food consumption
Caravan.Caravan.consumeFood = function () {
    this.food -= this.crew * Caravan.FOOD_PER_PERSON;

    if (this.food < 0) {
        this.food = 0;
    }
};


Caravan.Caravan.updateDay = function () {
    this.day += Caravan.DAY_PER_STEP;
    this.consumeFood(); //update food

    // можно двигаться дальше только если есть еда
    // в данной версии наступает смерть
    if (this.food > 0) {
        this.updateWeight();  //update weight
        this.updateDistance();  //update progress
    }

};


// ---------------------------------------

Caravan.Caravan.buy = function (product) {
    this.money -= product.price;
    this[product.item] += +product.qty;
    this.updateWeight();
};