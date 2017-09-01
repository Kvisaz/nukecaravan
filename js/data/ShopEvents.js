/**
 *  Константы для настройки магазинов
 */
var ShopEventConstants = {
    SHOP_INTERVAL_MIN: 100,   // минимальное расстояние между магазинами
    SHOP_PROBABILITY: 0.15,   // шанс встретить магазин, если условие минимального расстояния выполняется (0..1)
    SHOP_NO_MONEY_MESSAGE: 'Не хватает денег!',   // сообщение о нехватке денег
    SHOP_BUY_MESSAGE: 'Вы купили',   // сообщение о нехватке денег
};

//  описания возможных магазинов
var Shops = [{
    text: 'Вы нашли магазин в этой жуткой пустоши',
    exitText: 'Покинуть магазин',
    products: [
        {item: 'food', qty: 20, price: 50},
        {item: 'oxen', qty: 1, price: 200},
        {item: 'firepower', qty: 2, price: 50},
        {item: 'crew', qty: 5, price: 80}
    ]
},
    {
        text: 'Вы встретили другой караван!',
        exitText: 'Пойти дальше',
        products: [
            {item: 'food', qty: 30, price: 50},
            {item: 'oxen', qty: 1, price: 200},
            {item: 'firepower', qty: 2, price: 20},
            {item: 'crew', qty: 10, price: 80}
        ]
    },
    {
        text: 'Следопыты встретили контрабандистов',
        exitText: 'Оставить контрабандистов',
        products: [
            {item: 'food', qty: 20, price: 60},
            {item: 'oxen', qty: 1, price: 300},
            {item: 'firepower', qty: 2, price: 80},
            {item: 'crew', qty: 5, price: 60}
        ]
    },
];