var Caravan = Caravan || {};

Caravan.UI = {
    logLength: 0,
};

//show a notification in the message area
Caravan.UI.notify = function (message, type) {
    var message = '<div class="update-' + type + '">' + R.strings.UI_DAY + ' ' + Math.ceil(this.caravan.day) + ': ' + message + '</div>';
    this.addInnerHtml('updates-area', message);
};

Caravan.UI.addInnerHtml = function (id, html) {
    var el = document.getElementById(id);
    el.innerHTML = html + el.innerHTML;
};

Caravan.UI.getById = function (id) {
    return;
};

Caravan.UI.show = function (id, html) {
    document.getElementById(id).innerHTML = "" + html;
};

//refresh visual caravan stats
Caravan.UI.update = function (worldState) {
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
    document.getElementById('caravan').style.left = (380 * worldState.distance / Caravan.FINAL_DISTANCE) + 'px';

    // update log
    if (this.logLength < worldState.log.length) {
        this.refreshLog(worldState.log);
    }
};

Caravan.UI.refreshLog = function (log) {
    var messageLog = "", index;
    for (index = 0; index < log.length; index++) {
        messageLog += this.formatMessage(log[index]);
    }
    this.show('updates-area', messageLog);
    // todo delete
    console.log("log refreshes, log size: "+log.length);
    this.logLength = log.length;
};

Caravan.UI.formatMessage = function (message) {
    var formatted = '<div class="update-' + message.type + '">' + R.strings.UI_DAY + ' ' + Math.ceil(message.day) + ': ' + message.message + '</div>';
    return formatted;
};

//refresh visual caravan stats
Caravan.UI.refreshStats = function () {
    //modify the dom
    document.getElementById('stat-day').innerHTML = Math.ceil(this.caravan.day);
    document.getElementById('stat-distance').innerHTML = Math.floor(this.caravan.distance);
    document.getElementById('stat-crew').innerHTML = this.caravan.crew;
    document.getElementById('stat-oxen').innerHTML = this.caravan.oxen;
    document.getElementById('stat-food').innerHTML = Math.ceil(this.caravan.food);
    document.getElementById('stat-money').innerHTML = this.caravan.money;
    document.getElementById('stat-firepower').innerHTML = this.caravan.firepower;
    document.getElementById('stat-weight').innerHTML = Math.ceil(this.caravan.weight) + '/' + this.caravan.capacity;

    //update caravan position
    document.getElementById('caravan').style.left = (380 * this.caravan.distance / Caravan.FINAL_DISTANCE) + 'px';
};

//show shop
Caravan.UI.showShop = function (products, caravan) {

    //get shop area
    var shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    //init the shop just once
    if (!this.shopInitiated) {

        //event delegation
        shopDiv.addEventListener('click', function (e) {
            //what was clicked
            var target = e.target || e.src;

            //exit button
            if (target.tagName == 'BUTTON') {
                //resume journey
                shopDiv.classList.add('hidden');
                Caravan.UI.game.resumeJourney();
            }
            else if (target.tagName == 'DIV' && target.className.match(/product/)) {

                Caravan.UI.buyProduct({
                        item: target.getAttribute('data-item'),
                        qty: target.getAttribute('data-qty'),
                        price: target.getAttribute('data-price')
                    },
                    caravan
                );

            }
        });

        this.shopInitiated = true;
    }

    //clear existing content
    var prodsDiv = document.getElementById('prods');
    prodsDiv.innerHTML = '';

    //show products
    var product;
    for (var i = 0; i < products.length; i++) {
        product = products[i];
        prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
    }
};

//buy product
Caravan.UI.buyProduct = function (product, caravan) {
    //check we can afford it
    if (product.price > caravan.money) {
        this.notify('Not enough money', 'negative');
        return false;
    }

    this.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

    /*Caravan.UI.caravan.money -= product.price;
     Caravan.UI.caravan[product.item] += +product.qty;
     Caravan.UI.caravan.updateWeight();*/
    caravan.buy(product);

    //update visuals
    this.refreshStats();
};

//show attack
Caravan.UI.showAttack = function (firepower, gold) {
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
Caravan.UI.fight = function () {

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
    this.game.resumeJourney();
};

//runing away from enemy
Caravan.UI.runaway = function () {

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
    this.game.resumeJourney();

};