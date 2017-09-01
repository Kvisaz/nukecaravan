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
    var idS = 'stat-day';
    this.show('stat-day', Math.ceil(world.day));
    this.show('stat-distance', Math.floor(caravanDistance));
    this.show('stat-crew', world.crew);
    this.show('stat-oxen', world.oxen);
    this.show('stat-food', Math.ceil(world.food));
    this.show('stat-money', world.money);
    this.show('stat-firepower', world.firepower);

    //update weight
    var maxWeight = getCaravanMaxWeight(world);
    var weight = getCaravanWeight(world);
    this.show('stat-weight', Math.ceil(weight) + '/' + maxWeight);

    //update caravan position
    var caravanPosition = Math.abs(364 * (caravanDistance / world.to.x)) + 'px';
    document.getElementById('caravan').style.left = caravanPosition;
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