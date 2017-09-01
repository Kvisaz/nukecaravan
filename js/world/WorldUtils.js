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

// вектор направления
function getCaravanDirection(world) {
    var dx = world.to.x - world.from.x;
    var dy = world.to.y - world.from.y;
    var dd = Math.sqrt(dx*dx + dy*dy);

    var kx = dx / dd; // коэффициент смещения по x со знаком
    var ky = dy / dd; // коэффициент смещения по y со знаком

    return { kx: kx, ky: ky };
}