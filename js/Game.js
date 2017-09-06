function Game() {
    this.delta = GameConstants.STEP_IN_MS;    // интервал в миллисекундах между шагами / обновлениями мира

    this.world = new WorldState({
        crew: 8,
        oxen: 2,
        food: 80,
        firepower: 3,
        money: 300,
        goods: 300,
    });

    this.plugins = [
        new TimePlugin(this), // должен стоять первым
        new DistancePlugin(this), // события связанные с преодоленной дистанцией
        new RandomEventPlugin(this), // рандомные события
        new ShopPlugin(this), // магазины
        new BanditPlugin(), // бандиты
        new DeathCheck(), // проверка условий смерти
    ];

    this.views = [
        new WorldView(), // состояние мира
        new UserActionPlugin()// интерфейс пользователя
    ];
}

// запуск цикла игры
// использую setInterval для совместимости со старым Safari (так получилось)
// bind позволяет привязать this объекта
// так как по дефолту setInterval передает в функцию this от window
Game.prototype.resume = function () {
    this.interval = setInterval(this.update.bind(this), this.delta);
};

// игровой цикл
Game.prototype.update = function () {
    var index;
    for (index = 0; index < this.plugins.length; index++) {
        this.plugins[index].update(this.world);
    }

    if (this.world.isChanged) {
        for (index = 0; index < this.views.length; index++) {
            this.views[index].update(this.world);
        }
        this.world.isChanged = false;
    }
};

var newGame = new Game();
newGame.resume();