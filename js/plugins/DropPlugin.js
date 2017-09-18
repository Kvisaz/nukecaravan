/**
 *  Модуль интерфейса для дропа, если есть перевес
 *
 *  - каждый модуль интерфейса должен содержать функцию init(world, game)
 *  - в листенерах при изменении параметров world должен вызываться game.onWorldUpdate
 */

var DropPlugin = {};

DropPlugin.init = function (world) {
    this.world = world;
};

DropPlugin.onDialogClose = function () {
    this.world.uiLock = false; // снимаем захват с действий пользователя
    this.world.stop = false; // продолжаем путешествие
};

DropPlugin.update = function () {
    // если стоим или нет перевеса - ничего не делаем
    if(this.world.stop || !hasCaravanOverweight(this.world)) return;

    // Перевес! стопим караван
    this.world.uiLock = true; // стопим захват с действий пользователя
    this.world.stop = true; // стопим путешествие
    DialogWindow.show(DropDialogs, this.world, null, this); // показываем диалог
};

Game.addPlugin(DropPlugin);