/**
 * Map2D Plugin *
 *  - при клике на городе на карте - отправляет караван туда
 *  - в update проверяет прибытие в город
 */
function Map2DPlugin(world) {
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
            world.from.x = world.caravan.x;
            world.from.y = world.caravan.y;
            world.to.x = element.offsetLeft;
            world.to.y = element.offsetTop;
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
}

Map2DPlugin.prototype.update = function (world) {
    if (world.stop) return; // не двигаемся
    this.movePlayerViewTo(world.caravan.x, world.caravan.y);

    // проверяем достижение поставленной цели
    if (this.isAboutTarget(world)) {
        world.stop = true;
        addLogMessage(world, Goodness.positive, "Вы достигли города!");
    }
};

// проверка, что координаты каравана около заданной цели
Map2DPlugin.prototype.isAboutTarget = function (world) {
    var targetDistance = Math.sqrt(Math.pow((world.to.x - world.caravan.x), 2) + Math.pow((world.to.y - world.caravan.y), 2));
    return targetDistance < 10;
};

Map2DPlugin.prototype.movePlayerViewTo = function (x, y) {
    this.view.player.style.left = x + "px"; // сдвигаем маркер на карте
    this.view.player.style.top = y + "px"; // сдвигаем маркер на карте
};