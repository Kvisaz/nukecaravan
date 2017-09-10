/**
 *  Столкновения с бандитами
 *
 *
 - встречи делятся на два этапа
 - приблизиться // возможны разные варианты, смотри ниже
 - бежать // вас атакуют в любом случае

 - у бандитов есть параметры
 - описание банды
 - число оружия
 - число человек
 - голод  0..1

 - бандиты нападают всегда, если у вас меньше оружия и людей (на 1 человека нападут всегда)

 - бандиты могут захотеть примкнуть к вам, если у вас столько же оружия или больше,
 есть еда и они голодны
 - цена снижается

 - бандитов можно перекупить, если у вас есть деньги
 - цена зависит от количества стволов и человек
 - цена высокая
 - вы не получаете денег
 *
 */

function BanditPlugin(world) {
    this.bandits = {};
    this.world = world;

    // DOM-элементы для отображения интерфейса
    this.view = {};
    this.view.containerView = document.getElementById('attack');
    this.view.descView = document.getElementById('attack-description');
    this.view.approachButton = document.getElementById('attack-approach');
    this.view.runButton = document.getElementById('attack-run');
}

BanditPlugin.prototype.update = function (world) {
    // если стоим на месте - бандиты не появляются
    if (world.stop) return;
    // проверка на выпадение события вообще
    // я использую стоп-условие, так как оно позволяет избегать лесенки c if
    // но вы можете использовать классический блок if
    // todo uncomment
    //if(!checkEventForStep(BanditConstants.EVENT_PROBABILITY)) return;
    // ну, понеслась! пишем в лог
    addLogMessage(world, Goodness.negative, BanditConstants.NOTICE_MESSAGE);
    // караван останавливается
    world.stop = true;
    // флаг для блокировки UI в других плагинах включается
    world.uiLock = true; // todo не забудь выключить при выходе
    // генерируется случайная банда
    this.bandits = BanditEvents.getRandom();
    // она голодная по рандому от 0 до 1
    this.bandits.hunger = Math.random();
    // показываем окно с выбором "Встретиться / Бежать"
    this.showMeetUpView();
};

BanditPlugin.prototype.showMeetUpView = function () {
    var bandits = this.bandits;

    // видимую силу их оружия задаем как численность войск в Героях Магии и Меча
    // - то есть не прямым числом, а неконкретным описанием (слабо, сильно вооружены)
    // getByDegree - это функция из Utils.js, выбирает из массива по числу между 0 и 1 - чем больше, тем дальше от начала
    // это позволяет иметь массив описаний произвольной длины
    var firepowerDesc = BanditFirepowers.getByDegree(this.bandits.firepower / this.bandits.crew);
    addLogMessage(world, Goodness.negative, "Это "+this.bandits.text + " числом " + this.bandits.crew + " и они " + firepowerDesc);

    // todo delete
    console.log("Bandits hunger: "+this.bandits.hunger + " / firepower:"+this.bandits.firepower);

};

BanditPlugin.prototype.showEvent = function (world) {
    var bandits = this.bandits;
    var containerView = document.getElementById('attack');
    var descView = document.getElementById('attack-description');
    var approachButton = document.getElementById('attack-approach');
    var runButton = document.getElementById('attack-run');

    // Описание бандитов ----------------------------
    // вычисляем степень вооружения бандитов
    var banditFirePowerMid = bandits.firepower / bandits.crew;
    if(banditFirePowerMid > 1) {
        banditFirePowerMid = 1;
    }
    var index = BanditFirepowers.length - Math.abs((BanditFirepowers.length-1) * banditFirePowerMid);

    // Бандиты
    descView.innerHTML = "Это "+bandits.text + " числом " + bandits.crew + " и они " + BanditFirepowers[index];


    // Варианты действий ----------------------------
    approachButton.addEventListener('click', this.approach.bind(this));
    runButton.addEventListener('click', this.run.bind(this));
    containerView.classList.remove('hidden');
};

BanditPlugin.prototype.approach = function () {
    var bandits = this.bandits;
    var world = this.bandits;
    /*
    *  - бандиты могут захотеть примкнуть к вам, если у вас столько же оружия или больше,
     есть еда и они голодны
     - цена снижается

     - бандитов можно перекупить, если у вас есть деньги
     - цена зависит от количества стволов и человек
     - цена высокая
     - вы не получаете денег
    * */

    // firepower
   if(world.firepower < bandits.firepower ) {
       // todo attack!
       addLogMessage(world, Goodness.negative, "Бандиты атакуют!");
   }
   else{
       // фактор голода
       // в команде достаточно еды (БАЛАНС!)
       if(world.food / world.crew > bandits.hunger ){
           addLogMessage(world, Goodness.positive, "Восхищенные вашими запасами еды, бандиты решили присоединиться к вам!");
           // todo принять / отвергнуть
           //
       }
       else {
           addLogMessage(world, Goodness.neutral, "Бандиты настороженно смотрят на ваше оружие и еду, и требуют дань за проход");
           // todo принять / отвергнуть
       }
   }

};

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