/**
 * Плагин рандомных событий
 * - основного геймплея в оригинале игры с караваном
 */
RandomEventPlugin = {};

RandomEventPlugin.init = function (world) {
    this.world = world;
    this.events = RandomEvents;
};

RandomEventPlugin.update = function () {
    if (this.world.stop) return; // если стоим на месте - рандомных событий нет
    // проверка на выпадение события вообще
    if(!checkEventForStep(RandomEventConstants.EVENT_PROBABILITY)) return;

    var event = this.events.getRandom();
    var valueChange = event.value;

    valueChange = Math.floor(Math.random() * valueChange); // случайные значения изменений

    if (valueChange == 0) return; // если случайное значение выпало ноль - никаких изменений, событие отменяется

    // если выпало отрицательное значение, а параметр уже нулевой - ничего не происходит
    if (valueChange < 0 && this.world[event.stat] <= 0) return;

    // отрицательные значения не могут быть по модулю больше текущего параметра
    if (valueChange < 0 && Math.abs(valueChange) > this.world[event.stat]) {
        valueChange = Math.floor(this.world[event.stat]);
    }

    this.world[event.stat] += valueChange;
    var message = event.text.withArg(Math.abs(valueChange));
    addLogMessage(this.world, event.goodness, message);
};

Game.addPlugin(RandomEventPlugin);