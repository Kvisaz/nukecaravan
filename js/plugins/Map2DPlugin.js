/**
 * Map2D Plugin *
 *  - при клике на городе на карте - отправляет караван туда
 *  - в update проверяет прибытие в город
 */
Map2DPlugin = {};

Map2DPlugin.init = function (world) {
    this.world = world;

    // элементы для отображения карты
    this.view = {};
    this.view.player = document.getElementById('map-player'); // маркер игрока

    // добавляем в них города - пока два
    this.view.towns = document.getElementsByClassName('town');
    console.log("this.view.towns length = " + this.view.towns.length);

    // вешаем на города обработчики кликов, чтобы отправлять туда караван
    var i;
    for (i = 0; i < this.view.towns.length; i++) {
        this.view.towns[i].addEventListener("click", function (e) {
            if (world.uiLock) return; // если какой-то плагин перехватил работу с пользователем, то есть открыто модальное окно, не реагируем на действия пользователя
            var element = e.target || e.srcElement;
            world.from = { x: world.caravan.x, y: world.caravan.y };
            world.to = {x: element.offsetLeft, y: element.offsetTop};
            world.stop = false;
            addLogMessage(world, Goodness.positive, "Путешествие через пустыню начинается!");
        });
    }

    // если найдены города на карте, помещаем игрока в первый попавшийся
    if (this.view.towns.length > 0) {
        world.caravan.x = this.view.towns[0].offsetLeft;
        world.caravan.y = this.view.towns[0].offsetTop;
        this.movePlayerViewTo(world.caravan.x, world.caravan.y);
    }
};

Map2DPlugin.update = function () {
    if (this.world.stop) return; // не двигаемся
    this.movePlayerViewTo(this.world.caravan.x, this.world.caravan.y);

    // проверяем достижение поставленной цели
    if (this.isAboutTarget(this.world)) {
        this.world.stop = true;
        addLogMessage(this.world, Goodness.positive, "Вы достигли города!");
        this.cityMarket();
    }
};

// проверка, что координаты каравана около заданной цели
Map2DPlugin.isAboutTarget = function (world) {
    var targetDistance = Math.sqrt(Math.pow((world.to.x - world.caravan.x), 2) + Math.pow((world.to.y - world.caravan.y), 2));
    return targetDistance < 10;
};

Map2DPlugin.movePlayerViewTo = function (x, y) {
    this.view.player.style.left = x + "px"; // сдвигаем маркер на карте
    this.view.player.style.top = y + "px"; // сдвигаем маркер на карте
};

// функция для прибытия в новый город
Map2DPlugin.cityMarket = function () {
    var message = "Вы входите на местный рынок";

    addLogMessage(this.world, Goodness.neutral, message);

    var sell = sellCargo(this.world);
    if(sell.money>0){
        message = "Продано $1 товаров на сумму $2".withArg(sell.cargo, sell.money);
    }
    else{
        message = "Товаров нет, поэтому ничего продать не удалось";
    }
    addLogMessage(this.world, Goodness.neutral, message);

    var buy = buyCargo(this.world);
    if(buy.money>0){
        message = "Куплено $1 товаров на сумму $2".withArg(buy.cargo, buy.money);
    }
    else{
        message = "Для покупки на рынке нужны деньги и быки, чтобы везти товар.";
    }
};