function Game() {
    // создаем мир по стартовому состоянию
    // все редактируемые переменные - в директории data
    this.world = new WorldState(StartWorldState);

    // генераторы событий
    this.eventPlugins = [
        new TimePlugin(this), // должен стоять первым
        new DistancePlugin(this), // события связанные с преодоленной дистанцией
        new RandomEventPlugin(this), // рандомные события
        new ShopPlugin(this), // магазины
        new BanditPlugin(), // бандиты
        new DeathCheck(), // проверка условий смерти
    ];

    // реакция на события
    this.viewPlugins = [
        new WorldView(), // состояние мира
        new UserActionPlugin(), // интерфейс пользователя
    ];
}

// игровой цикл
Game.prototype.update = function () {
    var index;
    for (index = 0; index < this.eventPlugins.length; index++) {
        this.eventPlugins[index].update(this.world);
    }

    if (this.world.isChanged) {
        for (index = 0; index < this.viewPlugins.length; index++) {
            this.viewPlugins[index].update(this.world);
        }
        this.world.isChanged = false;
    }
};

var newGame = new Game();
// запуск цикла игры, использую setInterval для совместимости со старым Safari
// bind позволяет привязать this объекта
// так как по дефолту setInterval передает в функцию this от window
setInterval(newGame.update.bind(newGame), GameConstants.STEP_IN_MS);