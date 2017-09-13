/**
 *  Функции для вычисления данных по параметрам мира
 */

// максимальный вес, который может нести караван
function getCaravanMaxWeight(world) {
    return world.oxen * Caravan.WEIGHT_PER_OX + world.crew * Caravan.WEIGHT_PER_PERSON;
}

// текущий вес, который тащит  караван
function getCaravanWeight(world) {
    return world.food * Caravan.FOOD_WEIGHT
        + world.firepower * Caravan.FIREPOWER_WEIGHT
        + world.cargo;
}

// Награда за прибытие в город - премия за сохраненный груз
function sellCargo(world) {
    var cargo = world.cargo;
    var money = cargo * Caravan.CARGO_PRICE;
    world.money += money;
    world.cargo = 0;
    return {money: money, cargo: cargo};
}

// Покупка груза, учитывает вес уже купленного и наличие денег
function buyCargo(world) {
    var cargoMax = world.money / Caravan.CARGO_BUY_PRICE;
    var newCargo = world.oxen * Caravan.CARGO_PER_OX - world.cargo; // сколько можем купить
    newCargo = Math.min(cargoMax, newCargo); // вычисляем адекватную нагрузку по кошельку
    var money = newCargo * Caravan.CARGO_BUY_PRICE;
    world.cargo += newCargo;
    world.money -= money;
    return {money: money, cargo: newCargo};
}

// добавляем сообщение в лог
function addLogMessage(world, goodness, message) {
    world.log.push({
        day: world.day,
        message: message,
        goodness: goodness
    });
}

/**
 *  Тип события для лога - положительный, отрицательный, нейтральный
 */
var Goodness = {
    positive: 'positive',
    negative: 'negative',
    neutral: 'neutral'
};