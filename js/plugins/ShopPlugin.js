/**
 *  Плагин магазина
 *  основная концепция - минимальная связь с другими классами
 *
 *  1. модуль вызывается из Game
 *  2. модуль имеет функцию отображения своего интерфейса
 *  3. модуль  меняет состояние мира.
 *
 */

var ShopPlugin = {};

ShopPlugin.init = function (world) {
    this.world = world;
    this.shops = Shops; // возможные случаи магазинов, основы для генерация конкретной встречи

    this.lastShop = {x: -1, y: -1}; // координаты предыдущего магазина - чтобы не слишком часто
    this.lastTown = {x: -1, y: -1}; // координаты предыдущего города - чтобы не встречать караван в том же сегменте
    this.products = []; // продукты в конкретном магазине, генерируем
};

ShopPlugin.update = function () {
    var world = this.world;
    if (world.stop) return; // если стоим - никаких новых магазинов

    // проверяем, не были ли выхода из города - если да, то запоминаем его
    if(this.lastTown.x != world.from.x || this.lastTown.y != world.from.y)
    {
        this.lastTown = { x: world.from.x, y: world.from.y };
        this.lastShop = { x: world.from.x, y: world.from.y };
    }

    // проверяем расстояние до предыдущего магазина, чтобы не частили
    var prevShopDistance = getDistance(world.caravan, this.lastShop);
    if (prevShopDistance < ShopEventConstants.SHOP_DISTANCE_MIN) return;

    // проверка на выпадение случайного магазина
    if (!checkEventForStep(ShopEventConstants.SHOP_PROBABILITY)) return;

    // стоп-условия выполнились
    world.stop = true; // караван остановился
    world.uiLock = true; // обозначаем, что действия пользователя теперь исключительно наши, пример: чтобы караван случайно не пошел по карте, если кликнем по ней при работе с магазином

    this.lastShop =  { x: world.caravan.x, y: world.caravan.y };  // запоминаем магазинчик
    this.show(this.shops.getRandom()); // показываем магазин
};

ShopPlugin.show = function (shop) {
    // добавляем сообщение о магазине в лог
    addLogMessage(this.world, Goodness.neutral, shop.text);
    // создаем набор продуктов по ассортименту данного магазина
    this.products = this.generateProducts(shop);
    // Создаем объект для отображения 1 диалога
    var ShopDialog = {
        start: {
            icon: ShopEventConstants.SHOP_PIC, // пока у магазина никакой иконки
            title: shop.text,  // заголовок
            desc: ShopEventConstants.SHOP_HINT, // описание
            choices: [], // выбор продуктов и
        }
    };

    // генерируем набор кнопок для продуктов
    var shopPlugin = this;
    var buttonText; // временная переменная для создания текста на кнопке продукта
    this.products.forEach(function (product) {
        buttonText = product.text + ' [' + product.qty + '] за $' + product.price;
        ShopDialog.start.choices.push({
            text: buttonText,
            action: function () {
                if (product.price > shopPlugin.world.money) {
                    addLogMessage(shopPlugin.world, Goodness.negative, ShopEventConstants.SHOP_NO_MONEY_MESSAGE);
                    return "stop";
                }
                shopPlugin.buy(product);
                return "start";
            }
        });
    });

    // и добавляем кнопку для просто выхода
    ShopDialog.start.choices.push({
        text: ShopEventConstants.SHOP_EXIT,
        action: function () { return "stop";}
    });

    DialogWindow.show(ShopDialog, null, null, this);
};

// Обязательная функция при использовании диалогов - коллбэк, вызываемый при закрытии
ShopPlugin.onDialogClose = function () {
    this.world.uiLock = false; // снимаем захват с действий пользователя
    this.world.stop = false; // продолжаем путешествие
};

// генерируем набор продуктов на основе базового
ShopPlugin.generateProducts = function (shop) {
    var PRODUCTS_AMOUNT = 4;
    var numProds = Math.ceil(Math.random() * PRODUCTS_AMOUNT);
    var products = [];
    var j, priceFactor;

    for (var i = 0; i < numProds; i++) {
        j = Math.floor(Math.random() * shop.products.length); // берем случайный продукт из набора
        priceFactor = 0.7 + 0.6 * Math.random(); // //multiply price by random factor +-30%
        products.push({
            item: shop.products[j].item,
            text: shop.products[j].text,
            qty: shop.products[j].qty,
            price: Math.round(shop.products[j].price * priceFactor)
        });
    }
    return products;
};

ShopPlugin.buy = function (product) {
    var world = this.world;
    world.money -= product.price;
    world[product.item] += product.qty;
    addLogMessage(world, Goodness.positive, ShopEventConstants.SHOP_BUY_MESSAGE + ' ' + product.text + ' +' + product.qty);
};

Game.addPlugin(ShopPlugin);