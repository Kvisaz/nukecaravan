/**
 *  Функции для расчета боев с бандитами
 */

var BanditMathUtils = {};

/*  Вычисление ущерба от открытого сражения с бандитами
 *
 *     1. ущерб - число погибших в команде
 *     2. ущерб не может быть больше команды, естественно
 *     3. ущерб растет в зависимости от силы оружия бандитов
 *     4. ущерб уменьшается при накапливании оружия в караване, но не уходит в ноль
 *     5. ущерб имеет рандомный разброс
 * */
BanditMathUtils.getDamage = function (world, bandits) {
    // перевес каравана по оружию
    var caravanOverpowered = Math.min(0, world.firepower - bandits.firepower);

    // по мере возрастания caravanOverpowered - caravanOverPowerK будет стремиться от 1 к нулю,
    // не уходя в него полностью.
    // получаем коэффицинт от 1 до 0.01, уменьшающий дамаг
    var caravanOverPowerK = 1 / Math.sqrt(caravanOverpowered+1);

    // таки в среднем baseDamage будет колебаться около bandits.firepower
    var baseDamage = bandits.firepower * 2 * Math.random();

    // получаем уменьшающийся с прокачкой дамаг. Иногда даже будет вылетать ноль
    // дамаг - это число погибшших у нас
    var damage = Math.ceil(baseDamage * caravanOverPowerK);
    // не может погибнуть больше, чем в команде
    damage = Math.min(damage, world.crew);

    return damage;
};