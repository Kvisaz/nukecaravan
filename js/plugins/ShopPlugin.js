/**
 *  Плагин магазина
 *  основная концепция - минимальная связь с другими классами
 *
 *  1. модуль вызывается из Game
 *  2. модуль имеет функцию отображения своего интерфейса
 *  3. модуль  меняет состояние мира.
 *
 *
 *  Обязательные функции
 *  show(pluginEvent) - получает данные о событии
 *
 *
 */

function ShopPlugin(world) {
    this.world = world; // необходимо для листенера
    this.shops = Shops; // возможные случаи магазинов, основы для генерация конкретной встречи

    this.lastShop = { x:0, y:0 }; // координаты предыдущего магазина - чтобы не слишком часто
    this.products = []; // продукты в конкретном магазине, генерируем

    // элементы интерфейса
    this.view = {};
    this.view.shop = document.getElementById('shop');
    this.view.shopTitle = document.getElementById('shop-title');
    this.view.exitButton = document.getElementById('shop-exit-button');
    this.view.products = document.getElementById('prods');

    // добавляем общий слушатель кликов пользователя к магазину
    var shopView = this.view.shop; // для передачи в листенер как переменную, а не как this
    var shopPlugin = this; // для передачи в листенер как переменную, а не как this
    shopView.addEventListener('click', function (e) {
        var target = e.target || e.src;
        if (target.tagName == 'BUTTON') {  // клик на кнопке выхода
            shopView.classList.add('hidden');  // скрываем магазин
            world.uiLock = false; // снимаем захват с действий пользователя
            world.stop = false; // продолжаем путешествие
        }
        else if (target.tagName == 'DIV' && target.className.match(/product/)) { //buy button
            // в атрибуте data-index при открытии магазина записывает индекс продукта
            var product = shopPlugin.products[target.getAttribute('data-index')];
            shopPlugin.buy(
                product.item,  // item
                product.qty, // qty
                product.price // price
            );
        }
    });
}

// Обязательная функция плагина -
ShopPlugin.prototype.update = function (world) {
    if (world.stop) return; // если стоим - никаких новых магазинов

    // проверяем расстояние до предыдущего магазина, чтобы не частили
    //var prevShopDistance = Math.abs(world.caravan.x - this.lastShop.x);
    //if (ShopEventConstants.SHOP_DISTANCE_MIN < prevShopDistance) return;

    // проверка на выпадение случайного магазина
    //if (Math.random() > ShopEventConstants.SHOP_PROBABILITY) return;

    // стоп-условия выполнились
    world.stop = true; // караван остановился
    this.lastShop.x = world.caravan.x;  // запоминаем магазинчик
    this.show(this.shops.getRandom()); // показываем магазин
    world.uiLock = true; // обозначаем, что действия пользователя теперь исключительно наши, пример: чтобы караван случайно не пошел по карте, если кликнем по ней при работе с магазином
};

ShopPlugin.prototype.show = function (shop) {
    this.view.shop.classList.remove('hidden'); // показываем сам магазин в попапе
    this.view.shopTitle.innerHTML = shop.text; // описание магазина
    this.view.products.innerHTML = ''; // очищаем предыдущий набор продуктов

    addLogMessage(this.world, Goodness.neutral, shop.text); // добавляем сообщение о магазине в лог
    this.products = this.generateProducts(shop); // случайный набор продуктов по ассортименту данного магазина

    /*
     *   Сохраняем индекс продукта в атрибутах тега,
     *   позже в листенере клика извлекает этот атрибут
     *   и берем из модели this.products
     * */
    var productsView = this.view.products;
    this.products.forEach(function (product, i) {
        productsView.innerHTML += '<div class="shop-product" data-index="' + i + '">' + product.qty + ' ' + product.text + ' - $' + product.price + '</div>';
    });
};

// генерируем набор продуктов на основе базового
ShopPlugin.prototype.generateProducts = function (shop) {
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

ShopPlugin.prototype.buy = function (item, qty, price) {
    var world = this.world;
    if (price > world.money) {
        addLogMessage(world, Goodness.negative, ShopEventConstants.SHOP_NO_MONEY_MESSAGE);
        return false;
    }
    world.money -= price;
    world[item] += qty;
    addLogMessage(world, Goodness.positive, ShopEventConstants.SHOP_BUY_MESSAGE + ' ' + qty + ' x ' + item);
};