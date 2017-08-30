/**
 *  WorldUpdate - класс для обновления вычисляемх полей в модели мира
 *  - сюда добавляем все вычисления, которые нужны для обновления полей модели в случае ее обновления
 */

function WorldUpdater() {
}

WorldUpdater.prototype.update = function (world) {
    world.capacity = world.oxen * Caravan.WEIGHT_PER_OX + world.crew * Caravan.WEIGHT_PER_PERSON;
    world.weight = world.food * Caravan.FOOD_WEIGHT + world.firepower * Caravan.FIREPOWER_WEIGHT;
};