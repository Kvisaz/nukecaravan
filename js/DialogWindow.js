/**
 *  Простое универсальное диалоговое окно для магазинов, атак и дропа
 */

var DialogWindow = {};

DialogWindow.init = function () {
    // два аргумента, через которые при вызове диалога конкретны плагином, можно передавать данные для модификации
    this.arg1 = {};
    this.arg2 = {};
    // описания диалогов, в одном окне может быть куча диалогов
    this.dialogs = [];
    // коллбэки для диалогов
    this.dialogActions = [];
    // вызывающий объект
    this.parent = {};

    // DOM-элементы для отображения интерфейса
    // находим и сохраняем все элементы, необходимые для вывода информации
    this.view = {};
    this.view.window = document.getElementById('dialog'); // по сути не само окно, а окно с большой тенью
    this.view.title = document.getElementById('dialog-title');
    this.view.icon = document.getElementById('dialog-icon');
    this.view.hint = document.getElementById('dialog-hint');
    this.view.choices = document.getElementById('dialog-choices');
    this.view.exitButton = document.getElementById('dialog-exit-button');

    // Обработка кликов
    // класс для кнопки выбора
    this.CHOICE_CLASS_NAME = 'dialog-choice';
    this.CHOICE_ATTRIBUTE = 'choice';
    this.ICON_PEACE_CLASS_NAME = 'icon_bandits_peace';


    // Добавляем реакцию на клик пользователя
    // используется универсальный listener для всего диалога
    // просто отслеживаем конкретно на чем кликнули
    var dialogWindow = this;
    this.view.window.addEventListener('click', this.listener.bind(this));
};

DialogWindow.listener = function (e) {
    var target = e.target || e.src;

    // клик на кнопке. Кнопка у нас - выход
    if (target.tagName == 'BUTTON') {
        this.close(); // выход
        return; // обработка закончилась
    }

    // клик на каком-то из выборов
    if (target.tagName == 'DIV' && target.className.indexOf(this.CHOICE_CLASS_NAME) !== -1) {

        // получаем из атрибута номер коллбэка
        var choiceIndex = target.getAttribute(this.CHOICE_ATTRIBUTE);

        // передаем этому коллбэку аргументы диалога
        // и получаем тег для следующего диалога
        var choiceTag = this.dialogActions[choiceIndex](this.arg1, this.arg2);

        console.log("choiceIndex = " + choiceIndex); // todo delete
        console.log("choiceTag = " + choiceTag); // todo delete

        this.showDialog(choiceTag);
        return; // обработка закончилась
    }
};

/*
 *   При вызове диалога ему следует передать ассоциативный массив описаний диалогов
 *   и два аргумента, которые можно использовать в коллбэках выбора в конкретном диалоге
 * */
DialogWindow.show = function (dialogs, arg1, arg2, parent) {
    this.dialogs = dialogs;
    this.arg1 = arg1;
    this.arg2 = arg2;
    this.parent = parent;
    this.showDialog("start");
    this.view.window.classList.remove("hidden");
};

// прячем окно и очищаем используемые переменные
DialogWindow.close = function () {
    this.arg1 = {};
    this.arg2 = {};
    this.dialogs = [];
    this.dialogActions = [];
    this.view.exitButton.classList.add("hidden");
    this.view.window.classList.add("hidden");
    if(typeof this.parent.onDialogClose==="function"){
        this.parent.onDialogClose();
    }
};

/*
 *   Показываем диалог с тегом.
 * */
DialogWindow.showDialog = function (dialogTag) {
    if (!this.dialogs.hasOwnProperty(dialogTag)) {
        console.log("!! DialogWindow Error! Диалог с названием " + dialogTag + " не найден");
        return;
    }
    var dialog = this.dialogs[dialogTag];
    this.view.title.innerHTML = this.getString(dialog, "title"); // устанавливаем заголовок диалога
    this.view.icon.setAttribute("src", this.getString(dialog, "icon")); // устанавливаем картинку

    // Описание. С возможностью вычисляемых параметров.
    var description = this.getString(dialog, "desc"); // если есть базовое описание - ставим его
    // Вычисляем дополнительную инфу для диалога - если у него реализована функция desc_action
    if (typeof dialog.desc_action === "function") {
        description += dialog.desc_action(this.arg1, this.arg2);
    }
    this.view.hint.innerHTML = description;

    // Очищаем предыдущие выборы
    this.dialogActions = []; // очищаем массив коллбэков
    this.view.choices.innerHTML = ''; // очищаем видимые элементы предыдущего выбора

    // если есть выборы - добавляем их
    var choices = this.getArr(dialog, "choices");
    var i, choice;
    for (i = 0; i < choices.length; i++) {
        choice = dialog.choices[i];
        this.addChoice(i, choice.text); // создаем div со специальным атрибутом с номером выполняемой функции
        // todo delete
        console.log(" i =" + i + "choice.text=" + choice.text);
        this.dialogActions[i] = choice.action; // запоминаем коллбэк под этой же функцией
    }

    if (this.getBoolean(dialog, "exit")) {
        this.view.exitButton.classList.remove("hidden");
    }
    else {
        this.view.exitButton.classList.add("hidden");
    }
};


// добавляем кнопку выбора действий в окно с текстом
DialogWindow.addChoice = function (index, text) {
    this.view.choices.innerHTML += '<div class="' + this.CHOICE_CLASS_NAME + '" ' + this.CHOICE_ATTRIBUTE + '="' + index + '">' + text + '</div>';
};

// проверяем, есть ли поле у объекта, если нет - возвращаем пустую строку
DialogWindow.getString = function (dialog, fieldName) {
    return dialog.hasOwnProperty(fieldName) ? dialog[fieldName] : "";
};

// проверяем, есть ли поле у объекта, если нет - возвращаем пустой массив
DialogWindow.getArr = function (dialog, arrFieldName) {
    return dialog.hasOwnProperty(arrFieldName) ? dialog[arrFieldName] : [];
};

DialogWindow.getBoolean = function (dialog, booleanFieldName) {
    return dialog.hasOwnProperty(booleanFieldName) ? dialog[booleanFieldName] : false;
};