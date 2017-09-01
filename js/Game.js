function Game() {
    this.delta = 20;    // интервал в миллисекундах между шагами / обновлениями мира

    this.plugins = [
        new TimePlugin(this), // должен стоять первым
        new DistancePlugin(this), // события связанные с преодоленной дистанцией
        new RandomEventPlugin(this), // рандомные события
        new ShopPlugin(this), // магазины
        new DeathCheck(), // проверка условий смерти
        new UI(), // обновляем UI каждый цикл
    ];

    this.world = new WorldState({
        day: 0,
        distance: 0,
        crew: 4,
        food: 80,
        oxen: 2,
        money: 300,
        firepower: 3
    });
    // инициализируем интерфейс
    initActionUi(this.world, this);
}

Game.prototype.resume = function () {
    // использую setInterval для совместимости со старым Safari (так получилось)
    // bind позволяет привязать this объекта
    // так как по дефолту setInterval передает в функцию this от window
    this.interval = setInterval(this.step.bind(this), this.delta);
};

// передаем аргумент game, так как this в данном вызове - window
Game.prototype.step = function () {
    if (this.world.stop) return;
    for (index = 0; index < this.plugins.length; index++) {
        this.plugins[index].update(this.world);
    }
};

var newGame = new Game();
newGame.resume();