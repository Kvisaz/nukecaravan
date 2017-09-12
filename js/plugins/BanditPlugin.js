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
        if (target.tagName == 'DIV' && target.className.indexOf(choiceClassName) !== -1) {
            // получаем из атрибута номер коллбэка
            var choiceIndex = target.getAttribute(banditPlugin.CHOICE_ATTRIBUTE);
            // получаем из коллбэка с этим номером тег для следующего диалога
            var choiceTag = banditPlugin.dialogActions[choiceIndex](banditPlugin.world, banditPlugin.bandits);
            console.log("choiceIndex = " + choiceIndex); // todo delete
            console.log("choiceTag = " + choiceTag); // todo delete
            banditPlugin.showDialog(choiceTag);
            return; // обработка закончилась
        }
    });
}

BanditPlugin.prototype.update = function (world) {
    // если стоим на месте - бандиты не появляются
    if (world.stop || world.gameover) return;
    // проверка на выпадение события вообще
    // я использую стоп-условие, так как оно позволяет избегать лесенки c if
    // но вы можете использовать классический блок if

    // todo uncomment
    //if(!checkEventForStep(BanditConstants.EVENT_PROBABILITY)) return;

    // ну, понеслась!
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

    // показываем окно с первым диалогом
    this.showDialog("start");
};

// Показываем диалог. dialogTag - строка с названием BanditDialogs
BanditPlugin.prototype.showDialog = function (dialogTag) {

    if (!this.dialogs.hasOwnProperty(dialogTag)) {
        console.log("!! BanditPlugin Error! Диалог с названием " + dialogTag + " не найден в BanditDialogs");
        return;
    }

    var dialog = this.dialogs[dialogTag];

    // наполняем элементы и показываем их
    this.view.title.innerHTML = dialog.title;
    if(dialog.hasOwnProperty("iconWin")){
        this.showPeaceIcon(dialog.iconWin);
    }

    // если передано описание - добавляем его
    // необходимо было для реализации стартового описания
    var description = dialog.desc;

    // Вычисляем дополнительную инфу для диалога - если у него реализована функция desc_action
    if(dialog.desc_action){ description += dialog.desc_action(this.world, this.bandits);}

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

    if (dialog.hasOwnProperty("exit")) {
        this.view.exitButton.classList.remove("hidden");
    }
    else {
        this.view.exitButton.classList.add("hidden");
    }

    this.view.bandits.classList.remove("hidden");  // показываем окно
};

// отправляемся дальше
BanditPlugin.prototype.finish = function () {
    this.view.exitButton.classList.add('hidden'); // прячем финишную кнопку до следующего диалога
    this.view.bandits.classList.add('hidden'); // прячем окно
    this.world.uiLock = false; // снимаем захват с действий пользователя
    this.world.stop = false; // продолжаем путешествие
};

// делаем мирную иконку
BanditPlugin.prototype.showPeaceIcon = function (isPeace) {
    if (isPeace) {
        this.view.icon.classList.add(this.ICON_PEACE_CLASS_NAME);
    }
    else {
        this.view.icon.classList.remove(this.ICON_PEACE_CLASS_NAME);
    }
};

// добавляем 1 кнопку выбора действий в окно с текстом
BanditPlugin.prototype.addChoice = function (index, text) {
    //this.view.choices.innerHTML += this.getChoiceCode(choice);
    this.view.choices.innerHTML += '<div class="bandits-choice" ' + this.CHOICE_ATTRIBUTE + '="' + index + '">' + text + '</div>';
};