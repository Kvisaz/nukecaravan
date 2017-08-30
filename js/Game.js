function Game() {
    this.plugins = [
        new TimePlugin(this), // должен стоять первым
        new DistancePlugin(this), // события связанные с преодоленной дистанцией
        new RandomEventPlugin(this), // рандомные события
        new ShopPlugin(this), // магазины
    ];

    // this.deathChecker = new DeathPlugin(this); // должен стоять последним

    this.world = new WorldState({
        day: 0,
        distance: 0,
        crew: 30,
        food: 80,
        oxen: 2,
        money: 300,
        firepower: 2
    });

    //this.log = new Log(this.world);

    // объект для наблюдения за состоянием мира
    // после группы изменений this.world
    // следует вызвать  this.worldObservable.update();
    // и тогда произойдут проверки на смерть, а затем обновления интерфейса
    this.worldObservable = new Observable(this.world);


    // проверка на смерть должна вызываться после каждого изменения мира
    // поэтому мы ее подписываем на изменение worldObservable
    this.deathCheck = new DeathCheck();
    this.worldObservable.subscribe(this.deathCheck);

    // обновление веса и мощности
    this.worldObservable.subscribe(new WeightCheck());

    // обновление интерфейса должна вызываться последней, чтобы суметь отобразить и смерть
    // поэтому мы ее подписываем на изменение worldObservable
    this.ui = new UI();
    this.worldObservable.subscribe(this.ui);
    this.onWorldUpdate(); // обновляем мир при запуске

    // инициализируем интерфейс
    initActionUi(this.world, this);
}

// Пожалуй, это подходящее компромиссное решение для оповещения об изменениях
Game.prototype.onWorldUpdate = function () {
    this.worldObservable.update();
};

Game.prototype.resume = function () {
    console.log("Game is resumed");

    this.world.paused = false;
    this.time = 0;
    this.previousTime = 0;

    // использую setInterval для совместимости со старым Safari (так получилось)
    this.interval = setInterval(this.step, Caravan.GAME_SPEED, this);
};

Game.prototype.pause = function () {
    console.log("Game is paused");
    this.world.paused = true;
};

// передаем аргумент game, так как this в данном вызове - window
Game.prototype.step = function (game) {
    game.time += Caravan.GAME_SPEED;
    var delta = game.time - game.previousTime;
    game.previousTime = game.time;

    // запускаем генераторы событий, реагирующие на изменение мира
    if (delta >= Caravan.GAME_SPEED) {
        for (index = 0; index < game.plugins.length; index++) {
            game.plugins[index].run(game.world);

            // если плагин запросил остановку мира - выходим из цикла, обновляем интерфейс
            if(game.world.paused){
                break; //
            }
        }
    }
    // обновляем UI и всех прочих наблюдателей состояния мира
    game.onWorldUpdate();

    // если событие вызывает паузу, останавливаем интервал
    if (game.world.paused) {
        clearInterval(game.interval);
    }

    console.log("Game.step!");
    console.log("game.previousTime :" + game.previousTime);
    console.log("game.time :" + game.time);
};

var newGame = new Game();
newGame.resume();