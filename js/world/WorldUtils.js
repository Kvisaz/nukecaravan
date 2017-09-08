/**
 *  Функции для вычисления данных по параметрам мира
 */

// максимальный вес, который может нести караван
function getCaravanMaxWeight(world) {
    return world.oxen * Caravan.WEIGHT_PER_OX + world.crew * Caravan.WEIGHT_PER_PERSON;
}

// текущий вес, который тащит  караван
function getCaravanWeight(world) {
    return world.food * Caravan.FOOD_WEIGHT + world.firepower * Caravan.FIREPOWER_WEIGHT;
}

// пройденный путь в текущем маршруте
function getCaravanDistance(world) {
    return Math.abs(world.x - world.from.x);
}