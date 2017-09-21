/*
 *      Функция для отображения текущего состояния мира
 *       и лога событий
 * */
var WorldView =  {
    // модель для хранения состояния View: предыдущие отображаемые значения
    // чтобы не дергать UI каждый раз, только при изменениях
    viewModel: {
        day: 0,
        crew: 0,
        oxen: 0,
        food: 0,
        firepower: 0,
        cargo: 0,
        money: 0,
        lastMessage: "", // обновление лога мониторим по последнему сообщению, так как размер лога теперь ограничен
        distance: 0,
        weight: 0,
        maxWeight: 0,
    }
};

WorldView.init = function (world) {
    this.world = world;

    this.UI_DAY_TEXT = "День";

    // элементы DOM находим сразу и запоминаем
    this.view = {};
    this.view.distance = document.getElementById('game-stat-distance');
    this.view.days = document.getElementById('game-stat-day');
    this.view.crew = document.getElementById('game-stat-crew');
    this.view.oxen = document.getElementById('game-stat-oxen');
    this.view.food = document.getElementById('game-stat-food');
    this.view.money = document.getElementById('game-stat-money');
    this.view.firepower = document.getElementById('game-stat-firepower');
    this.view.cargo = document.getElementById('game-stat-cargo');
    this.view.log = document.getElementById('game-log');
    this.view.weightBarText = document.getElementById('game-weight-bartext');
    this.view.weightBarFill = document.getElementById('game-weight-barfill');
    this.view.weight = document.getElementById('game-stat-cargo');
};

// Обновляем параметры по текущему состоянию мира
// если какой-то параметр не менялся - обновления для него не происходит
WorldView.update = function () {
    var world = this.world;
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

    if(this.viewModel.cargo != world.cargo){
        this.view.cargo.innerHTML = Math.ceil(world.cargo);
        this.viewModel.cargo = world.cargo;
    }

    var lastMessage = world.log[world.log.length-1];
    if (this.viewModel.lastMessage != lastMessage) {
        this.refreshLog(world.log);
        this.viewModel.lastMessage = lastMessage;
    }

    var weight = getCaravanWeight(world);
    var maxWeight = getCaravanMaxWeight(world);
    if(weight!=this.viewModel.weight || maxWeight!=this.viewModel.maxWeight){
        var percent = Math.ceil(100*(Math.min(1, weight / maxWeight)));
        this.view.weightBarFill.style.width = percent+"%";
        this.view.weightBarText.innerHTML = "общий вес "+Math.ceil(weight) + " / максимальный вес " + Math.ceil(maxWeight);
        this.viewModel.weight = weight;
        this.viewModel.maxWeight = maxWeight;
    }
};

WorldView.refreshLog = function (log) {
    var messageLog = "", index;
    // лог показываем снизу вверх
    for (index = log.length - 1; index >= 0; index--) {
        messageLog += this.formatMessage(log[index]);
    }
    this.view.log.innerHTML = messageLog;
};

WorldView.formatMessage = function (message) {
    var messageClass = 'log-message-'+message.goodness;
    var formatted = '<div class="' + messageClass + '">' + this.UI_DAY_TEXT + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};

Game.addPlugin(WorldView);