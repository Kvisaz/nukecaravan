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
    this.view.towns = [];
    this.view.towns.push(document.getElementById('startTown'));
    this.view.towns.push(document.getElementById('endTown'));

    // вешаем на города обработчики кликов, чтобы отправлять туда караван
    this.view.towns.forEach(function (town) {
        town.addEventListener("click", function (e) {
            if (!world.stop) return; // если караван уже идет - направление не меняем
            var element = e.target || e.srcElement;
            world.to.x = element.offsetLeft;
            world.stop = false;
            addLogMessage(world, Goodness.positive, "Путешествие через пустыню начинается!");
        });
    });
}

Map2DPlugin.prototype.update = function (world) {
    if (world.stop) return; // не двигаемся
    this.view.player.style.left = world.caravan.x+"px"; // сдвигаем маркер на карте

    // проверяем достижение поставленной цели
    if(this.isAboutTarget(world)){
        world.stop = true;
        addLogMessage(world, Goodness.positive, "Вы достигли города!");
    }
};

// проверка, что координаты каравана около заданной цели
Map2DPlugin.prototype.isAboutTarget = function (world) {
    var targetDistance = Math.sqrt(Math.pow((world.to.x - world.caravan.x),2) + Math.pow((world.to.y - world.caravan.y),2));
    console.log("targetDistance = "+targetDistance);
    return targetDistance<10;
};