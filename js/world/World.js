/*
 *   Класс для обработки состояния мира игры
 *   и оповещения подписчиков на изменения мира
 *
 *   В stats используется упрощенный плоский формат (временно)
 *
 * */
function World(stats) {
    this.state = new WorldState(stats);
    this.subscribers = [];
}

/*
 *   Паттерн Обсервер
 *    - чтобы при установке новых значений state
 *       оповещать подписчиков (ui)
 *
 * */
// subscriber должен иметь реализацию функции update(state: WorldState)
World.prototype.subcribe = function (subscriber) {
    this.subscribers.push(subscriber);
};

World.prototype.unsubscribe = function (subscriber) {
    var index = this.subscribers.indexOf(subscriber);
    if (index > -1) {
        this.subscribers.splice(index, 1);
    }
};

World.prototype.unsubscribeAll = function (subscriber) {
    this.subscribers = [];
};

// обновление оповещает всех подписчиков, передавая им новое состояние
World.prototype.updateSubscribers = function () {
    var index;
    var len = this.subscribers.length;
    for (index = 0; index < len; index++) {
        this.subscribers[index].update(this.state);
    }
};

/*
 универсальный сеттер для установки параметров WorldState
 param - строковый параметр
 value - его новое значение
 * */
World.prototype.set = function (param, value) {
    this.state[param] = value;
};

World.prototype.increment = function (param, value) {
    this.state[param] = this.state[param] + value;
};

World.prototype.decrement = function (param, value) {
    this.state[param] = this.state[param] - value;
};

/*
 /!*
 *   Инициализация данными с объектом-функцией не нужна, используем конструктор
 * *!/
 World.prototype.init = function () {
 var world = this;
 PotionDataArray.forEach(function (potionData) {
 world.state.potions.push(new Potion(potionData));
 });
 };

 // Добавляем пузырек в мир
 World.prototype.addPotion = function (potionData) {
 var world = this;
 var isAdded = false;
 var newPotion = new Potion(potionData)
 this.state.potions.forEach(function (potion) {
 if (newPotion.name == potion.name) {
 potion.amount++;
 world.updateSubcribers();
 isAdded = true;
 }
 });
 var message = isAdded ? "add potion": "no Added potion";
 console.log(message + ": " + newPotion.name);
 };*/

/*********************************
 *   Обновление дня в мире
 ********************************/

World.prototype.nextStep = function () {
    var state = this.state;
    console.log("state day = "+state.day);
    if(state.day == 0.0){
        this.addMessage(R.strings.START_MESSAGE, 'positive');
        // todo delete
        console.log("log size = "+state.log.length);
    }
    state.day += Caravan.DAY_PER_STEP;

    this.consumeFood(); //update food

    // можно двигаться дальше только если есть еда
    // в данной версии наступает смерть
    if (state.food > 0) {
        this.updateWeight();  //update weight
        this.updateDistance();  //update progress
    }

    this.updateSubscribers();
};

// ----- food consumption ----------------------------------------------------------
World.prototype.consumeFood = function () {
    var state = this.state;
    state.food -= state.crew * Caravan.FOOD_PER_PERSON;

    if (state.food < 0) {
        state.food = 0;
    }
};

// ------------------------------------------------------------------------
World.prototype.updateDistance = function () {
    var state = this.state;
    //the closer to capacity, the slower
    var diff = state.capacity - state.weight;
    var speed = Caravan.SLOW_SPEED + diff / state.capacity * Caravan.FULL_SPEED;
    state.distance += speed;
};
// ------------------------------------------------------------------------
World.prototype.updateWeight = function () {
    var state = this.state;

    var droppedFood = 0;
    var droppedGuns = 0;

    //how much can the caravan carry
    state.capacity = state.oxen * Caravan.WEIGHT_PER_OX + state.crew * Caravan.WEIGHT_PER_PERSON;

    //how much weight do we currently have
    state.weight = state.food * Caravan.FOOD_WEIGHT + state.firepower * Caravan.FIREPOWER_WEIGHT;

    // Я сбрасываю сначала еду, так как еду можно пополнить с оружием в руках - eSTet
    while (state.food && state.capacity <= state.weight) {
        state.food--;
        state.weight -= Caravan.FOOD_WEIGHT;
        droppedFood++;
    }

    if (droppedFood) {
        //state.log.push(R.strings.DROPPED_FOOD.withArg(droppedFood));
        this.addMessage(R.strings.DROPPED_FOOD.withArg(droppedFood));
        //this.ui.notify(R.strings.DROPPED_FOOD.withArg(droppedFood));
    }

    // Я сбрасываю сначала еду, так как еду можно пополнить с оружием в руках - eSTet

    //drop things behind if it's too much weight
    //assume guns get dropped before food
    while (state.firepower && state.capacity <= state.weight) {
        state.firepower--;
        state.weight -= Caravan.FIREPOWER_WEIGHT;
        droppedGuns++;
    }

    if (droppedGuns) {
        this.addMessage(R.strings.DROPPED_GUNS.withArg(droppedFood));
        //this.ui.notify(R.strings.DROPPED_GUNS.withArg(droppedGuns));
    }

};
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

/*
 *   События в мире
 * */

World.prototype.generateEvent = function () {
    var eventData = Utils.Random.fromArray(this.eventTypes);
    //events that consist in updating a stat
    if (eventData.type == 'STAT-CHANGE') {
        this.stateChangeEvent(eventData);
    }
    //shops
    else if (eventData.type == 'SHOP') {
        //pause game
        this.game.pauseJourney();

        //notify user
        state.log.push(R.strings.DROPPED_GUNS.withArg(droppedFood));
        // this.ui.notify(eventData.text, eventData.notification);
        addMessage(eventData.text, eventData.notification);

        //prepare event
        this.shopEvent(eventData);
    }

    //attacks
    else if (eventData.type == 'ATTACK') {
        //pause game
        this.game.pauseJourney();

        //notify user
        // this.ui.notify(eventData.text, eventData.notification);
        addMessage(eventData.text, eventData.notification);

        //prepare event
        this.attackEvent(eventData);
    }
};

// ------------------------------------------------------------------------
World.prototype.addMessage = function (message, type) {
    this.state.log.push({
        day: this.state.day,
        message: message,
        type: type
    });
};
// ------------------------------------------------------------------------

