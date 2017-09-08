function Game() {
    // создаем мир по стартовому состоянию
    // все редактируемые переменные - в директории data
    this.world = new WorldState(StartWorldState);

    // генераторы событий
    this.eventPlugins = [
        new CorePlugin(), // должен стоять первым
        new MapPlugin(this.world),
        new RandomEventPlugin(), // рандомные события
        new ShopPlugin(), // магазины
        new BanditPlugin(), // бандиты
        new DeathCheck(), // проверка условий смерти
        new WorldView(), // внешний вид мира
        new UserActionPlugin(), // интерфейс пользователя
    ];
}

// игровой цикл
Game.prototype.update = function () {
    if (this.world.gameover) return; // никаких действий
    var index;
    for (index = 0; index < this.eventPlugins.length; index++) {
        this.eventPlugins[index].update(this.world);
    }
};

var newGame = new Game();
// запуск цикла игры, использую setInterval для совместимости со старым Safari
// bind позволяет привязать this объекта
// так как по дефолту setInterval передает в функцию this от window
setInterval(newGame.update.bind(newGame), GameConstants.STEP_IN_MS);