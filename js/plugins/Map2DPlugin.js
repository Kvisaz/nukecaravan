/**
 * Map2D Plugin *
 *  - при клике на городе на карте - отправляет караван туда
 *  - в update проверяет прибытие в город
 */
Map2DPlugin = {
    // чтобы не гонять DOM каждый раз - гоняем только когда обновляются координаты игрока
    // для этогоп делаем проверку через это поле
    lastPlayerPosition: {x: 0, y: 0},
    // маркер "мы в городе" - соответствует "открыт диалог города"
    inTown: false,
    // последний посещенный город
    lastTown: { x: -1, y: -1 },
};

Map2DPlugin.init = function (world) {
    this.world = world;

    // элементы для отображения карты
    this.view = {};
    this.view.player = document.getElementById('map-player'); // маркер игрока

    // добавляем в них города - пока два
    this.view.towns = document.getElementsByClassName('town');

    // вешаем на города обработчики кликов, чтобы отправлять туда караван
    var i, map2dPlugin = this;
    for (i = 0; i < this.view.towns.length; i++) {
        this.view.towns[i].addEventListener("click", function (e) {
            if (world.uiLock) return; // если какой-то плагин перехватил работу с пользователем, то есть открыто модальное окно, не реагируем на действия пользователя
            var element = e.target || e.srcElement;
            world.from = {x: world.caravan.x, y: world.caravan.y};
            world.to = {x: element.offsetLeft, y: element.offsetTop};
            world.stop = false;
            map2dPlugin.inTown = false; // все, покидаем город

            addLogMessage(world, Goodness.positive, "Путешествие через пустыню начинается!");
        });
    }

    // если найдены города на карте, помещаем игрока в первый попавшийся
    if (this.view.towns.length > 0) {
        world.caravan.x = this.view.towns[0].offsetLeft;
        world.caravan.y = this.view.towns[0].offsetTop;
        // запоминаем его как последний, чтобы не торговать в нем же при быстром возвращении
        this.lastTown = {x: world.caravan.x, y: world.caravan.y };
        world.stop = true; // чтобы не двигался
        this.movePlayerViewTo(world.caravan.x, world.caravan.y);
    }
};

Map2DPlugin.update = function () {
    if (this.inTown) return; // если открыт диалог города - ничего не делаем


    // обновляем DOM только когда есть изменения в координатах
    if (this.lastPlayerPosition.x != this.world.caravan.x ||
        this.lastPlayerPosition.y != this.world.caravan.y) {
        this.movePlayerViewTo(this.world.caravan.x, this.world.caravan.y);
        this.lastPlayerPosition.x = this.world.caravan.x;
        this.lastPlayerPosition.y = this.world.caravan.y;
    }

    // проверяем достижение города на остановках
    if (this.world.stop && this.isAboutTarget(this.world)) {
        this.inTown = true;
        this.world.uiLock = true; // маркируем интерфейс как блокированный
        addLogMessage(this.world, Goodness.positive, "Вы достигли города!");
        // проверка что мы были в этом городе
        var revisit = this.world.to.x === this.lastTown.x && this.world.to.y === this.lastTown.y;
        // запоминаем последений посещенный город
        this.lastTown = { x: this.world.to.x, y: this.world.to.y};
        DialogWindow.show(TownDialogs, this.world, revisit, this);
    }
};

// проверка, что координаты каравана около заданной цели
Map2DPlugin.isAboutTarget = function (world) {
    return areNearPoints(world.caravan, world.to, Caravan.TOUCH_DISTANCE);
};

Map2DPlugin.movePlayerViewTo = function (x, y) {
    this.view.player.style.left = x + "px"; // сдвигаем маркер на карте
    this.view.player.style.top = y + "px"; // сдвигаем маркер на карте
};

Map2DPlugin.onDialogClose = function () {
    // запоминаем этот город, как последний, чтобы не было чита с автоторговлей
    this.world.uiLock = false;
};

Game.addPlugin(Map2DPlugin);