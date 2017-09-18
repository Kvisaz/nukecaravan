var Game = {
    plugins: [],  // генераторы событий
};

Game.init = function () {
    // создаем мир по стартовому состоянию
    // все редактируемые переменные - в директории data
    this.world = new WorldState(StartWorldState);

    var i;
    for (i = 0; i < this.plugins.length; i++) {
        this.plugins[i].init(this.world);
    }
};

// добавление плагинов
Game.addPlugin = function (plugin) {
    this.plugins.push(plugin);
};

// игровой цикл
Game.update = function () {
    if (this.world.gameover) return; // никаких действий
    var i;
    for (i = 0; i < this.plugins.length; i++) {
        this.plugins[i].update();
    }
};


// запуск цикла игры, использую setInterval для совместимости со старым Safari
// bind позволяет привязать this объекта
// так как по дефолту setInterval передает в функцию this от window
Game.resume = function () {
    this.interval = setInterval(this.update.bind(this), GameConstants.STEP_IN_MS);
};

Game.stop = function () {
    clearInterval(this.interval);
};

Game.restart = function () {
    this.init();
    this.resume();
};