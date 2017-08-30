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
    this.products = []; // продукты в конкретном магазине

    // координаты предыдущего магазина
    this.previousShop = {
        x: 0
    };

    // список магазинов
    this.shops = ShopEvents;
}

// Обязательная функция плагина -
ShopPlugin.prototype.run = function (world) {
    // Магазины не встречаются рядом с пустошами
    if (world.distance < 100 || world.distance > 900) return;

    // между магазинами расстояние минимум 100
    var previousShopDistance = world.distance - this.previousShop.x;
    if (ShopConstants.SHOP_INTERVAL_MIN > previousShopDistance) return;

    // проверка на выпадение случайного магазина
    if (Math.random() > ShopConstants.SHOP_PROBABILITY) return;

    // стоп-условия выполнились, создаем и наполняем случайный магазин
    var shop = this.shops.getRandom();
    this.products = this.generateProducts(shop);

    // ставим игру на паузу, чтобы показать интерфейс
    this.game.pause();
    this.show(this.products);
};

ShopPlugin.prototype.show = function (products) {

    console.log("ShopPlugin show");

    //  Готовим вью
    var shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    if (!this.isListenerAdded) {
        this.addListeners(shopDiv);
        this.isListenerAdded = true;
    }
    //clear existing content
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
    //check
    if (price > world.money) {
        addLogMessage(world, Goodness.negative,ShopConstants.SHOP_NO_MONEY_MESSAGE);
        this.game.onWorldUpdate();
        return false;
    }

    world.money -= price;
    world[item] += +qty;

    // todo КАК ОБНОВЛЯТЬ ВЕС КАРАВАНА???
    // this.world.updateWeight(); // это надо бы предупреждать или выносить в отдельную функцию

    addLogMessage(world, Goodness.positive, ShopConstants.SHOP_BUY_MESSAGE + ' ' + qty + ' x ' + item);

    // мир обновился, оповещаем интерфейс и других подписчиков модели
    this.game.onWorldUpdate();
};