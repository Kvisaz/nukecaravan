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
    this.dialogs = BanditDialogs; // описания диалогов
    this.dialogActions = []; // коллбэки для диалогов

    // класс для кнопки выбора
    this.CHOICE_CLASS_NAME = 'bandits-choice';
    this.CHOICE_ATTRIBUTE = 'choice';
    this.ICON_PEACE_CLASS_NAME = 'icon_bandits_peace';

    // DOM-элементы для отображения интерфейса
    this.view = {};
    this.view.bandits = document.getElementById('bandits');
    this.view.title = document.getElementById('bandits-title');
    this.view.icon = document.getElementById('bandits-icon');
    this.view.hint = document.getElementById('bandits-hint');
    this.view.choices = document.getElementById('bandits-choices');
    this.view.exitButton = document.getElementById('bandits-exit-button');

    // Добавляем реакцию на клик пользователя
    // используется универсальный listener для всего диалога
    // просто отслеживаем конкретно на чем кликнули
    var choiceClassName = this.CHOICE_CLASS_NAME; // класс кнопки слушателя, для передачи в листенер
    var banditPlugin = this; // для передачи в листенер
    this.view.bandits.addEventListener('click', function (e) {
        var target = e.target || e.src;

        // клик на кнопке. Кнопка у нас - выход
        if (target.tagName == 'BUTTON') {
            banditPlugin.finish(); // выход
            return; // обработка закончилась
        }

        // клик на каком-то из выборов
        if (target.tagName == 'DIV'
            && target.className.indexOf(choiceClassName) !== -1) {
            console.log("Click on " + target.innerHTML); // todo delete
            // получаем из атрибута номер коллбэка
            var choiceIndex = target.getAttribute(banditPlugin.CHOICE_ATTRIBUTE);
            // получаем из коллбэка с этим номером тег для следующего диалога
            var choiceTag = banditPlugin.dialogActions[choiceIndex](banditPlugin.world, banditPlugin.bandits);
            console.log("choiceTag = " + choiceTag); // todo delete
            banditPlugin.showDialog(choiceTag);
            return; // обработка закончилась
        }
    });
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
    world.uiLock = true;
    // генерируется случайная банда
    this.bandits = BanditEvents.getRandom();
    // она голодная по рандому от 0 до 1, 0 - самый сильный, "смертельный", голод
    this.bandits.hunger = Math.random();
    // количество денег у бандитов - это явно функция от количества стволов
    this.bandits.gold = this.bandits.firepower * BanditConstants.GOLD_PER_FIREPOWER;

    // генерируем описание для встречи
    var desc = this.bandits.text + " " + BanditAtmospheric.getRandom() + ". ";
    desc+= "Они " + BanditFirepowers.getByDegree(this.bandits.firepower) + ".";
    desc+= "Число людей в банде: " + BanditNumbers.getByDegree(this.bandits.crew) + ".";

    // показываем окно с первым диалогом
    this.showDialog("start", desc);
};

// Показываем диалог. dialogTag - строка с названием BanditDialogs
BanditPlugin.prototype.showDialog = function (dialogTag, desc) {

    if (!this.dialogs.hasOwnProperty(dialogTag)){
        console.log("!! BanditPlugin Error! Не найден диалога с таким названием в BanditDialogs");
        return;
    }

    var dialog = this.dialogs[dialogTag];

    // наполняем элементы и показываем их
    this.view.title.innerHTML = dialog.title;
    this.showWarIcon(dialog.iconWar);

    // если передано описание - добавляем его
    // необходимо было для реализации стартового описания
    var description = desc ? desc : dialog.desc;
    this.view.hint.innerHTML = description; // описание

    // Добавление выборов
    this.dialogActions = []; // очищаем массив коллбэков
    this.view.choices.innerHTML = ''; // очищаем видимые элементы предыдущего выбора
    var i, choice;
    for (i = 0; i < dialog.choices.length; i++) {
        choice = dialog.choices[i];
        this.addChoice(i, choice.text); // создаем div со специальным атрибутом с номером выполняемой функции
        this.dialogActions[i] = choice.action; // запоминаем коллбэк под этой же функцией
    }

    if (dialog.exit) {
        this.view.exitButton.classList.remove("hidden");
    }
    else {
        this.view.exitButton.classList.add("hidden");
    }

    this.view.bandits.classList.remove("hidden");  // показываем окно
};

// todo сообщить в лог, к вам примкнуло
BanditPlugin.prototype.showHiredSuccess = function () {
    this.world.crew += this.bandits.crew;
    this.world.firepower += this.bandits.firepower;
    addLogMessage(this.world, BanditConstants.HIRE_FINISHED_TEXT.withArg(this.bandits.crew, this.bandits.firepower));
};

// отправляемся дальше
BanditPlugin.prototype.finish = function () {
    this.view.exitButton.classList.add('hidden'); // прячем финишную кнопку до следующего диалога
    this.view.bandits.classList.add('hidden'); // прячем окно
    this.world.uiLock = false; // снимаем захват с действий пользователя
    this.world.stop = false; // продолжаем путешествие
};

// За сколько можно нанять бандитов, зависит от силы голода
BanditPlugin.prototype.getBanditsPrice = function () {
    var priceForPerson = BanditConstants.HIRE_PRICE_PER_PERSON;
    priceForPerson *= this.bandits.hunger; // уменьшаем цену, в зависимости от силы голода
    var price = Math.ceil(this.bandits.crew * priceForPerson);
    return price;
};

// вычисляем, голодны ли бандиты
BanditPlugin.prototype.isBanditHunger = function () {
    return this.bandits.hunger < BanditConstants.HUNGER_THRESHOLD;
};

// вычисляем, сильно ли голодны бандиты
BanditPlugin.prototype.isBanditDeathHunger = function () {
    return this.bandits.hunger < BanditConstants.HUNGER_DEATH_THRESHOLD;
};

// вычисляем сколько в караване еды на человека и превышает ли это указанную константу, чтобы считать
// что еды много
BanditPlugin.prototype.isCaravanFoodEnough = function () {
    return this.world.food / this.world.crew > BanditConstants.HUNGER_CARAVAN_FOOD_PER_PERSON_THRESHOLD;
};

// Расчет потерь ваших людей в бою, аргумент isRun = true если вы бежите
BanditPlugin.prototype.getDamage = function (isRun) {
    var damage;
    if (isRun) {
        damage = this.bandits.firepower * Math.random() / 2; // при побеге жертв меньше
    }
    else {
        damage = this.bandits.firepower * 2 * Math.random() - this.world.firepower;  // в бою число жертв зависит от вашего оружия
    }
    damage = Math.floor(Math.max(0, damage));
    return damage;
};

// делаем мирную иконку
BanditPlugin.prototype.showWarIcon = function (isWar) {
    if (isWar) {
        this.view.icon.classList.remove(this.ICON_PEACE_CLASS_NAME);
    }
    else {
        this.view.icon.classList.add(this.ICON_PEACE_CLASS_NAME);
    }
};


// делаем мирную иконку
BanditPlugin.prototype.setPeaceIcon = function () {
    this.view.icon.classList.add(this.ICON_PEACE_CLASS_NAME);
};

// делаем воинственную иконку
BanditPlugin.prototype.setWarIcon = function () {
    this.view.icon.classList.remove(this.ICON_PEACE_CLASS_NAME);
};

// заголовок окна
BanditPlugin.prototype.setTitle = function (title) {
    this.view.title.innerHTML = title; // заголовок
};

// краткая подсказка
BanditPlugin.prototype.setDesc = function (desc) {
    this.view.hint.innerHTML = desc; // заголовок
};

// очищаем все кнопки
BanditPlugin.prototype.clearChoices = function () {
    this.view.choices.innerHTML = '';
};

// добавляем 1 кнопку выбора действий в окно с текстом
BanditPlugin.prototype.addChoice = function (index, text) {
    //this.view.choices.innerHTML += this.getChoiceCode(choice);
    this.view.choices.innerHTML += '<div class="bandits-choice" ' + this.CHOICE_ATTRIBUTE + '="' + index + '">' + text + '</div>';
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
    if (world.firepower < bandits.firepower) {
        // todo attack!
        addLogMessage(world, Goodness.negative, "Бандиты атакуют!");
    }
    else {
        // фактор голода
        // в команде достаточно еды (БАЛАНС!)
        if (world.food / world.crew > bandits.hunger) {
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