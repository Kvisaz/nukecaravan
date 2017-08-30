function UI() {
    this.logLength = 0;
}

UI.prototype.notify = function (message, type) {
    var message = '<div class="update-' + type + '">' + R.strings.UI_DAY + ' ' + Math.ceil(this.caravan.day) + ': ' + message + '</div>';
    this.addInnerHtml('updates-area', message);
};

UI.prototype.addInnerHtml = function (id, html) {
    var el = document.getElementById(id);
    el.innerHTML = html + el.innerHTML;
};

UI.prototype.show = function (id, html) {
    document.getElementById(id).innerHTML = "" + html;
};

//refresh visual caravan stats
UI.prototype.update = function (worldState) {
    //modify the dom
    var idS = 'stat-day';
    this.show('stat-day', Math.ceil(worldState.day));
    this.show('stat-distance', Math.floor(worldState.distance));
    this.show('stat-crew', worldState.crew);
    this.show('stat-oxen', worldState.oxen);
    this.show('stat-food', Math.ceil(worldState.food));
    this.show('stat-money', worldState.money);
    this.show('stat-firepower', worldState.firepower);
    this.show('stat-weight', Math.ceil(worldState.weight) + '/' + worldState.capacity);

    //update caravan position
    var caravanPosition = (364 * (worldState.distance / worldState.to.x)) + 'px';
    document.getElementById('caravan').style.left = caravanPosition;
    console.log("worldState.distance = "+worldState.distance);
    console.log("caravanPosition = "+caravanPosition);

    this.refreshLog(worldState.log);
};

UI.prototype.refreshLog = function (log) {
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

UI.prototype.formatMessage = function (message) {
    var messageClass = this.getMessageClass(message);
    var formatted = '<div class="' + messageClass + '">' + R.strings.UI_DAY + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};

UI.prototype.getMessageClass = function (message) {
    var messageClass = "update-";
    return messageClass+message.goodness;
};


//show attack
UI.prototype.showAttack = function (firepower, gold) {
    var attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');

    //keep properties
    this.firepower = firepower;
    this.gold = gold;

    //show firepower
    document.getElementById('attack-description').innerHTML = R.strings.UI_FIREPOWER + ': ' + firepower;

    //init once
    if (!this.attackInitiated) {

        //fight
        document.getElementById('fight').addEventListener('click', this.fight.bind(this));

        //run away
        document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

        this.attackInitiated = true;
    }
};

//fight
UI.prototype.fight = function () {

    var firepower = this.firepower;
    var gold = this.gold;

    var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

    //check there are survivors
    if (damage < this.caravan.crew) {
        this.caravan.crew -= damage;
        this.caravan.money += gold;
        this.notify(R.strings.BATTLE_FIGHT.withArg(damage), 'negative');
        this.notify(R.strings.BATTLE_LOOT.withArg(gold), 'gold');
    }
    else {
        this.caravan.crew = 0;
        this.notify(R.strings.BATTLE_FIGHT_DEATH_ALL, 'negative');
    }

    //resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resume();
};

//runing away from enemy
UI.prototype.runaway = function () {

    var firepower = this.firepower;

    var damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));

    //check there are survivors
    if (damage < this.caravan.crew) {
        this.caravan.crew -= damage;
        this.notify(R.strings.BATTLE_RUN.withArg(damage), 'negative');
    }
    else {
        this.caravan.crew = 0;
        this.notify(R.strings.BATTLE_RUN_DEATH_ALL, 'negative');
    }

    //remove event listener
    document.getElementById('runaway').removeEventListener('click', Caravan.UI.runaway);

    //resume journey
    document.getElementById('attack').classList.add('hidden');
    this.game.resume();

};