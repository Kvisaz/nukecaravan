/*
 *      Функция для отображения текущего состояния мира
 *       и лога событий
 * */
function WorldView() {
    // модель для хранения состояния View: предыдущие отображаемые значения
    // чтобы не дергать UI каждый раз, только при изменениях
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

    // элементы DOM находим сразу и запоминаем
    this.view = {};
    this.view.distance = document.getElementById('game-stat-distance');
    this.view.days = document.getElementById('game-stat-day');
    this.view.crew = document.getElementById('game-stat-crew');
    this.view.oxen = document.getElementById('game-stat-oxen');
    this.view.food = document.getElementById('game-stat-food');
    this.view.money = document.getElementById('game-stat-money');
    this.view.firepower = document.getElementById('game-stat-firepower');
    this.view.weight = document.getElementById('game-stat-cargo');
    this.view.maxWeight = document.getElementById('game-stat-cargo-max');
    this.view.log = document.getElementById('game-log');

}

// Обновляем параметры по текущему состоянию мира
// если какой-то параметр не менялся - обновления для него не происходит
WorldView.prototype.update = function (world) {
    if(this.viewModel.distance != world.distance){
        this.view.distance.innerHTML = Math.floor(world.distance);
        this.viewModel.distance = world.distance;
    }

    if(this.viewModel.day != world.day){
        this.view.days.innerHTML = Math.ceil(world.day);
        this.viewModel.day = world.day;
    }

    if(this.viewModel.crew != world.crew){
        this.view.crew.innerHTML = world.crew;
        this.viewModel.crew = world.crew;
    }

    if(this.viewModel.oxen != world.oxen){
        this.view.oxen.innerHTML = world.oxen;
        this.viewModel.oxen = world.oxen;
    }

    if(this.viewModel.food != world.food){
        this.view.food.innerHTML = Math.ceil(world.food);
        this.viewModel.food = world.food;
    }

    if(this.viewModel.money != world.money){
        this.view.money.innerHTML = Math.ceil(world.money);
        this.viewModel.money = world.money;
    }

    if(this.viewModel.firepower != world.firepower){
        this.view.firepower.innerHTML = Math.ceil(world.firepower);
        this.viewModel.firepower = world.firepower;
    }

    var weight = getCaravanWeight(world);
    if(this.viewModel.weight != weight){
        this.view.weight.innerHTML = Math.ceil(weight);
        this.viewModel.weight = weight;
    }

    var maxWeight = getCaravanMaxWeight(world);
    if(this.viewModel.maxWeight != maxWeight){
        this.viewModel.maxWeight = maxWeight;
        this.view.maxWeight.innerHTML = Math.ceil(maxWeight);
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
    this.view.log.innerHTML = messageLog;
};

WorldView.prototype.formatMessage = function (message) {
    var messageClass = 'log-message-'+message.goodness;
    var formatted = '<div class="' + messageClass + '">' + R.strings.UI_DAY + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};