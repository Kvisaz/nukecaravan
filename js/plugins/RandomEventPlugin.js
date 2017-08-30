/**
 * Плагин рандомных событий
 * - основного геймплея в оригинале игры с караваном
 */
function RandomEventPlugin(game) {
    this.game = game;
    this.events = RandomEvents;
}

RandomEventPlugin.prototype.run = function (world) {
    console.log("RandomEventPlugin run");

    if (Math.random() > Caravan.EVENT_PROBABILITY) return; // проверка на выпадение события вообще

    var event = this.events.getRandom();
    var valueChange = event.value;

    valueChange = Math.floor(Math.random() * valueChange); // случайные значения изменений

    if (valueChange == 0) return; // если случайное значение выпало ноль - никаких изменений, событие отменяется

    // отрицательные значения не могут быть по модулю больше текущего параметра
    if (valueChange < 0 && Math.abs(valueChange) > world[event.stat]) {
        valueChange = Math.floor(world[event.stat]);
    }

    world[event.stat] += valueChange;
    var message = event.text.withArg(valueChange);
    addLogMessage(world, event.goodness, message);

};