/**
 *  Плагин магазина
 *  основная концепция - минимальная связь с другими классами
 *
 *  1. модуль вызывается из Game
 *  2. модуль имеет функцию отображения своего интерфейса
 *  3. модуль  меняет состояние мира.
 *  4. после изменения состояни мира вызываем  game.onWorldUpdate(); для оповещения подписчиков
 *
 *
 *  Обязательные функции
 *  show(pluginEvent) - получает данные о событии
 *
 *
 */

function ShopPlugin(game) {
    this.game = game;
    this.isListenerAdded = false;
    this.shops = ShopEvents.shops; // возможные случаи магазинов, основы для генерация конкретной встречи

    // расстояние до предыдущего магазина - чтобы не слишком часто

    this.previousShopDistance = 0;

    this.products = []; // продукты в конкретном магазине, генерируем
}

// Обязательная функция плагина -
ShopPlugin.prototype.update = function (world) {
    if (world.stop) return; // если стоим - никаких новых магазинов

    var caravanDistance = getCaravanDistance(world);
    // Магазины не встречаются рядом с городами
    if (caravanDistance < 100 || caravanDistance > 900) return;

    // между магазинами расстояние минимум 100
    var shopDistance = caravanDistance - this.previousShopDistance;
    if (ShopEvents.SHOP_INTERVAL_MIN > shopDistance) return;

    // проверка на выпадение случайного магазина
    if (Math.random() > ShopEvents.SHOP_PROBABILITY) return;

    // стоп-условия выполнились, создаем и наполняем случайный магазин
    var shop = this.shops.getRandom();
    this.products = this.generateProducts(shop);

    world.stop = true; // караван остановился
    this.previousShopDistance = caravanDistance;
    this.show(this.products, shop); // показываем магазин
    addLogMessage(world, Goodness.neutral, shop.text); // добавляем сообщение о магазине в лог
};

ShopPlugin.prototype.show = function (products, shop) {
    // находим div для интерфейса магазина
    var shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    // кастомизируем внешний вид магазина по его данным
    document.getElementById('shop-exit-button').innerHTML = shop.exitText;
    document.getElementById('shop-title').innerHTML = shop.text;

    // добавляем функцию реакции на действия пользователя, если не добавлено
    if (!this.isListenerAdded) {
        this.addListeners(shopDiv);
        this.isListenerAdded = true;
    }
    // очищаем предыдущий набор продуктов
    var prodsDiv = document.getElementById('prods');
    prodsDiv.innerHTML = '';

    /*
    *   Сохраняем индекс продукта в атрибутах тега,
    *   позже в листенере клика извлекает этот атрибут
    *   и берем из модели this.products
    * */
    var product;
    for (var i = 0; i < products.length; i++) {
        product = products[i];
        prodsDiv.innerHTML += '<div class="product" data-index="'+i+'">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
    }
};


ShopPlugin.prototype.addListeners = function (shopDiv) {
    var shopPlugin = this;
    shopDiv.addEventListener('click', function (e) {
        var target = e.target || e.src;

        if (target.tagName == 'BUTTON') {  //exit button
            //resume journey
            shopDiv.classList.add('hidden');
            shopPlugin.game.resume();
        }
        else if (target.tagName == 'DIV' && target.className.match(/product/)) { //buy button
            var product = shopPlugin.products[target.getAttribute('data-index')];
            shopPlugin.buy(
                product.item,  // item
                product.qty, // qty
                product.price // price
            );
        }
    });
};

ShopPlugin.prototype.generateProducts = function (shop) {
    // модификация продуктов в магазине
    var PRODUCTS_AMOUNT = 4;
    var numProds = Math.ceil(Math.random() * PRODUCTS_AMOUNT);

    var products = [];
    var j, priceFactor;

    for (var i = 0; i < numProds; i++) {
        j = Math.floor(Math.random() * shop.products.length); // берем случайный продукт из набора
        priceFactor = 0.7 + 0.6 * Math.random(); // //multiply price by random factor +-30%

        products.push({
            item: shop.products[j].item,
            qty: shop.products[j].qty,
            price: Math.round(shop.products[j].price * priceFactor)
        });
    }

    return products;
};

ShopPlugin.prototype.buy = function (item, qty, price) {
    var world = this.game.world;

    if (price > world.money) {
        addLogMessage(world, Goodness.negative,ShopEvents.SHOP_NO_MONEY_MESSAGE);
        return false;
    }

    world.money -= price;
    world[item] += +qty;

    addLogMessage(world, Goodness.positive, ShopEvents.SHOP_BUY_MESSAGE + ' ' + qty + ' x ' + item);
};