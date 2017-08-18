/**
 *  Обработчик событий,
 *  центральная логика игры,
 *  класс, которому единственному дозволено менять мир
 *
 */

function EventHandler(world) {
    this.world = world;
}

EventHandler.prototype.nextStep = function() {
    console.log("eventHandler next Day starts");
    this.world.nextStep();
};