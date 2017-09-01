/**
 *  Столкновения с бандитами
 *
 */

function BanditPlugin(){
}

//show attack
BanditPlugin.prototype.showAttack = function (firepower, gold) {
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
BanditPlugin.prototype.fight = function () {

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
BanditPlugin.prototype.runaway = function () {

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