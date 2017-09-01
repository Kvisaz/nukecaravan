function Game() {
    this.delta = 20;    // интервал в миллисекундах между шагами / обновлениями мира

    this.world = new WorldState({
        crew: 4,
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
        new DeathCheck(), // проверка условий смерти
        new WorldView(), // обновляем WorldView каждый цикл
        new UserActionPlugin()// инициализируем интерфейс пользователя
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
    for (index = 0; index < this.plugins.length; index++) {
        this.plugins[index].update(this.world);
    }
};

var newGame = new Game();
newGame.resume();