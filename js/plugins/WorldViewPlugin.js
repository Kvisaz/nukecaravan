/*
 *      Функция для отображения текущего состояния мира
 *       и анимации движения каравана на карте
 * */
function WorldView() {
    // модель для хранения состояния View: предыдущие отображаемые значения
    // чтобы не дергать UI каждый раз, толкьо при изменениях
    this.viewModel = {
        day: 0,
        crew: 0,
        oxen: 0,
        food: 0,
        firepower: 0,
        cargo: 0,
        money: 0,
        logLength: 0, // лог мониторим по размеру
        distance: 0,
        weight: 0,
        maxWeight: 0,
    };
}
// рабочий шорткат для отображения параметра
WorldView.prototype.show = function (id, html) {
    document.getElementById(id).innerHTML = "" + html;
};

// Обновляем параметры по текущему состоянию мира
// если какой-то параметр не менялся - обновления для него не происходит
WorldView.prototype.update = function (world) {
    var caravanDistance = getCaravanDistance(world);
    if(this.viewModel.distance != caravanDistance){
        var endTownOnMapX = 832;
        var caravanPosition = Math.abs(endTownOnMapX * (caravanDistance / world.to.x)) + 'px';
        document.getElementById('map-player').style.left = caravanPosition; // сдвигаем маркер на карте
        this.show('game-stat-distance', Math.floor(caravanDistance)); // обновляем числовой индикатор
        this.viewModel.distance = caravanDistance;
    }

    if(this.viewModel.day != world.day){
        this.show('game-stat-day', Math.ceil(world.day));
        this.viewModel.day = world.day;
    }

    if(this.viewModel.crew != world.crew){
        this.show('game-stat-crew', world.crew);
        this.viewModel.crew = world.crew;
    }

    if(this.viewModel.oxen != world.oxen){
        this.show('game-stat-oxen', world.oxen);
        this.viewModel.oxen = world.oxen;
    }

    if(this.viewModel.food != world.food){
        this.show('game-stat-food', Math.ceil(world.food));
        this.viewModel.food = world.food;
    }

    if(this.viewModel.money != world.money){
        this.show('game-stat-money', Math.ceil(world.money));
        this.viewModel.money = world.money;
    }

    if(this.viewModel.firepower != world.firepower){
        this.show('game-stat-firepower', Math.ceil(world.firepower));
        this.viewModel.firepower = world.firepower;
    }

    var weight = getCaravanWeight(world);
    if(this.viewModel.weight != weight){
        this.show('game-stat-cargo', Math.ceil(weight));
        this.viewModel.weight = weight;
    }

    var maxWeight = getCaravanMaxWeight(world);
    if(this.viewModel.maxWeight != maxWeight){
        this.show('game-stat-cargo-max', maxWeight);
        this.viewModel.maxWeight = maxWeight;
    }

    if (this.viewModel.logLength != world.log.length) {
        this.refreshLog(world.log);
        this.viewModel.logLength = world.log.length;
    }
};

WorldView.prototype.refreshLog = function (log) {
    var messageLog = "", index;
    // лог показываем снизу вверх
    for (index = log.length - 1; index >= 0; index--) {
        messageLog += this.formatMessage(log[index]);
    }
    this.show('game-log', messageLog);
};

WorldView.prototype.formatMessage = function (message) {
    var messageClass = 'log-message-'+message.goodness;
    var formatted = '<div class="' + messageClass + '">' + R.strings.UI_DAY + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};