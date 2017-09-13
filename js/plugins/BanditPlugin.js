/**
 *  Столкновения с бандитами
 *
 *
 - встречи делятся на два этапа
 - приблизиться // возможны разные варианты, смотри ниже
 - бежать // вас атакуют в любом случае

 - у бандитов есть параметры
 - описание банды
 - число оружия
 - число человек
 - голод  0..1

 - бандиты нападают всегда, если у вас меньше оружия и людей (на 1 человека нападут всегда)

 - бандиты могут захотеть примкнуть к вам, если у вас столько же оружия или больше,
 есть еда и они голодны
 - цена снижается

 - бандитов можно перекупить, если у вас есть деньги
 - цена зависит от количества стволов и человек
 - цена высокая
 - вы не получаете денег
 *
 */

BanditPlugin = {};

BanditPlugin.init = function (world) {
    this.world = world;
    this.dialogView = DialogWindow;
};

BanditPlugin.update = function () {
    // если стоим на месте - бандиты не появляются
    if (this.world.stop || this.world.gameover) return;
    // проверка на выпадение события вообще
    // я использую стоп-условие, так как оно позволяет избегать лесенки c if
    // но вы можете использовать классический блок if

    // todo delete
    //if (!checkEventForStep(BanditConstants.EVENT_PROBABILITY)) return;

    // ну, понеслась!
    // караван останавливается
    this.world.stop = true;
    // флаг для блокировки UI в других плагинах включается
    this.world.uiLock = true;
    // генерируется случайная банда
    var bandits = BanditEvents.getRandom();
    // она голодная по рандому от 0 до 1, 0 - самый сильный, "смертельный", голод
    bandits.hunger = Math.random();
    // количество денег у бандитов - это явно функция от количества стволов
    bandits.money = bandits.firepower * BanditConstants.GOLD_PER_FIREPOWER;

    // цена найма бандитов за 1 человека
    bandits.price = BanditConstants.HIRE_PRICE_PER_PERSON;
    // коээффициент лута и потерь (будет менять от разных факторов)
    bandits.lootK = 1;
    // показываем окно с первым диалогом
    // this.showDialog("start");
    this.dialogView.show(BanditDialogs, this.world, bandits, this);
};

// отправляемся дальше
BanditPlugin.onDialogClose = function () {
    this.world.uiLock = false; // снимаем захват с действий пользователя
    this.world.stop = false; // продолжаем путешествие
};

/*  Вычисление ущерба для команды от открытого сражения с бандитами
 *     1. ущерб - число погибших в команде
 *     2. ущерб не может быть больше команды, естественно
 *     3. ущерб растет в зависимости от силы оружия бандитов
 *     4. ущерб уменьшается при накапливании оружия в караване, но не уходит в ноль
 *     5. ущерб имеет рандомный разброс
 * */
BanditPlugin.getDamage = function (world, bandits) {
    // перевес каравана по оружию, минимум 0
    var caravanOverpowered = Math.max(0, world.firepower - bandits.firepower);
    // по мере возрастания caravanOverpowered - caravanOverPowerK будет стремиться от 1 к нулю,
    // не уходя в него полностью.
    // получаем коэффицинт от 1 до 0.01, уменьшающий дамаг
    var caravanOverPowerK = 1 / Math.sqrt(caravanOverpowered + 1);
    // таки в среднем baseDamage будет колебаться около bandits.firepower
    var baseDamage = bandits.firepower * 2 * Math.random();
    // получаем уменьшающийся с прокачкой дамаг. Иногда даже будет вылетать ноль
    var damage = Math.round(baseDamage * caravanOverPowerK);
    // не может погибнуть больше, чем в команде
    damage = Math.min(damage, world.crew);
    return damage;
};

/*
 *  Вычисляем, сколько бандитов могут наняться к вам
 * */
BanditPlugin.getMaxHire = function (world, bandits) {
    // вычисляем по своему кошельку и их цене, или берем всех, если бандиты бесплатные
    console.log("world.money = " + world.money + " bandits.price = " + bandits.price);
    var max = bandits.price > 0 ? Math.floor(world.money / bandits.price) : bandits.crew;
    return max;
};