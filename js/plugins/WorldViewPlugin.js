/*
*      Функция для отображения текущего состояния мира
*       и анимации движения каравана на карте
* */
function WorldView() {
    // переменная для отслеживания длины лога, чтобы не обновлять его все время
    this.logLength = 0;
}

WorldView.prototype.notify = function (message, type) {
    var message = '<div class="update-' + type + '">' + R.strings.UI_DAY + ' ' + Math.ceil(this.caravan.day) + ': ' + message + '</div>';
    this.addInnerHtml('updates-area', message);
};

WorldView.prototype.addInnerHtml = function (id, html) {
    var el = document.getElementById(id);
    el.innerHTML = html + el.innerHTML;
};

WorldView.prototype.show = function (id, html) {
    document.getElementById(id).innerHTML = "" + html;
};

//refresh visual caravan stats
WorldView.prototype.update = function (world) {
    var caravanDistance = getCaravanDistance(world);

    //modify the dom
    this.show('game-stat-day', Math.ceil(world.day));
    this.show('game-stat-distance', Math.floor(caravanDistance));
    this.show('game-stat-crew', world.crew);
    this.show('game-stat-oxen', world.oxen);
    this.show('game-stat-food', Math.ceil(world.food));
    this.show('game-stat-money', world.money);
    this.show('game-stat-firepower', world.firepower);

    //update weight
    var weight = getCaravanWeight(world);
    var maxWeight = getCaravanMaxWeight(world);
    var cargoStatEl = document.getElementById('game-stat-cargo');
    this.show('game-stat-cargo', Math.ceil(weight));
    this.show('game-stat-cargo-max', maxWeight);

    //update caravan position
    var endTownOnMapX = 832;
    var caravanPosition = Math.abs(endTownOnMapX * (caravanDistance / world.to.x)) + 'px';
    document.getElementById('map-player').style.left = caravanPosition;
    this.refreshLog(world.log);
};

WorldView.prototype.refreshLog = function (log) {
    if (this.logLength == log.length) return; // если лог не менялся, не обновляем

    var messageLog = "", index;
    // лог показываем снизу вверх
    for (index = log.length - 1; index >= 0; index--) {
        messageLog += this.formatMessage(log[index]);
    }
    this.show('updates-area', messageLog);
    // todo delete
    console.log("log refreshes, log size: " + log.length);
    this.logLength = log.length;
};

WorldView.prototype.formatMessage = function (message) {
    var messageClass = this.getMessageClass(message);
    var formatted = '<div class="' + messageClass + '">' + R.strings.UI_DAY + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};

WorldView.prototype.getMessageClass = function (message) {
    var messageClass = "update-";
    return messageClass+message.goodness;
};