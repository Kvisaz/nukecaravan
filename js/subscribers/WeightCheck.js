/**
 *   Наблюдатель за весом
 *   - выделен в отдельный класс, так как общий вес каравана может измениться из-за разных событий
 *   - общий смысл: просто обновляем вес  и мощность
 */

// todo 1. Сделать перегруз, а не автосброс
// todo 2. Вынести в плагины
// todo 3. Добавить возможность сбросить еду или оружие по выбору

function WeightCheck() {
}

WeightCheck.prototype.update = function (world) {
    world.capacity = world.oxen * Caravan.WEIGHT_PER_OX + world.crew * Caravan.WEIGHT_PER_PERSON;
    world.weight = world.food * Caravan.FOOD_WEIGHT + world.firepower * Caravan.FIREPOWER_WEIGHT;
};