function Game() {
    this.world = new WorldState(StartWorldState);

    // генераторы событий
    this.eventPlugins = [
        new TimePlugin(this), // должен стоять первым
        new DistancePlugin(this), // события связанные с преодоленной дистанцией
        new RandomEventPlugin(this), // рандомные события
        new ShopPlugin(this), // магазины
        new BanditPlugin(), // бандиты
    ];

    // отражение событий перед пользователем
    this.reactionPlugins = [
        new WorldView(), // состояние мира
        new UserActionPlugin(), // интерфейс пользователя
        new DeathCheck(), // проверка условий смерти
    ];
}

// запуск цикла игры
// использую setInterval для совместимости со старым Safari (так получилось)
// bind позволяет привязать this объекта
// так как по дефолту setInterval передает в функцию this от window
Game.prototype.resume = function () {
    this.interval = setInterval(this.update.bind(this), GameConstants.STEP_IN_MS);
};

// игровой цикл
Game.prototype.update = function () {
    var index;
    for (index = 0; index < this.eventPlugins.length; index++) {
        this.eventPlugins[index].update(this.world);
    }

    if (this.world.isChanged) {
        for (index = 0; index < this.reactionPlugins.length; index++) {
            this.reactionPlugins[index].update(this.world);
        }
        this.world.isChanged = false;
    }
};

var newGame = new Game();
newGame.resume();