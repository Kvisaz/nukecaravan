/**
 *  Диалоги для городов
 */
var TownDialogs = {
    "start": {
        icon: "images/pic_wagons.jpg",
        title: "Вы прибыли в город",
        desc: "",
        desc_action: function (world, revisit) {
            if( revisit ) {
                return "Вы уже торговали в этом городе. Надо идти в другой.";
            }
            var desc = "Вы входите на местный рынок. ";
            var sell = sellCargo(world);
            if (sell.money > 0) {
                desc += "Продано $1 товаров на сумму $$2. ".withArg(sell.cargo, sell.money);
            }
            else {
                desc += "Товаров нет, поэтому ничего продать не удалось. ";
            }
            addLogMessage(world, Goodness.neutral, desc);
            var sellMessage;

            var buy = buyCargo(world);
            if (buy.money > 0) {
                sellMessage = "Куплено $1 товаров на сумму $$2. ".withArg(buy.cargo, buy.money);
            }
            else {
                sellMessage = "Купить ничего не удалось: не хватает денег или быков. ";
            }
            addLogMessage(world, Goodness.neutral, sellMessage);
            desc += sellMessage;

            var income = sell.money - buy.money;
            var signStr = income >= 0 ? "+" : "-";
            var goodness = income > 0 ? Goodness.positive : Goodness.negative;
            var incomeMessage = "Прибыль от посещения города: "+signStr+"$" + Math.abs(income);
            addLogMessage(world, goodness, incomeMessage);

            desc += incomeMessage;
            return desc;
        },
        choices: [
            {
                text: 'Выйти из города',
                action: function () {
                    return "stop";
                }
            }
        ]
    },
};