/**
 *  Константы для настройки магазинов
 */
var ShopEventConstants = {
    SHOP_DISTANCE_MIN: 100,   // минимальное расстояние между магазинами
    SHOP_PROBABILITY: 0.15,   // шанс встретить магазин, если условие минимального расстояния выполняется (0..1)
    SHOP_NO_MONEY_MESSAGE: 'Не хватает денег!',   // сообщение о нехватке денег
    SHOP_BUY_MESSAGE: 'Вы купили',   // сообщение о нехватке денег
};

//  описания возможных магазинов
var Shops = [{
    text: 'Вы нашли магазин в этой жуткой пустоши',
    products: [
        {item: 'food', text: 'Еда', qty: 20, price: 50},
        {item: 'oxen', text: 'Волы', qty: 1, price: 200},
        {item: 'firepower', text: 'Оружие', qty: 2, price: 50},
    ]
},
    {
        text: 'Вы встретили другой караван!',
        products: [
            {item: 'food', text: 'Еда', qty: 30, price: 50},
            {item: 'oxen', text: 'Волы',qty: 1, price: 200},
            {item: 'firepower', text: 'Оружие',qty: 2, price: 20},
            {item: 'crew', text: 'Наемники',qty: 10, price: 80}
        ]
    },
    {
        text: 'Следопыты встретили контрабандистов',
        products: [
            {item: 'food', text: 'Еда', qty: 20, price: 60},
            {item: 'oxen', text: 'Волы', qty: 1, price: 300},
            {item: 'firepower', text: 'Оружие', qty: 2, price: 80},
            {item: 'crew', text: 'Контрабандисты', qty: 5, price: 60}
        ]
    },
];