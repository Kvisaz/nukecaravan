/**
 * Константы для плагина сброса лишнего груза
 */

var DropDialogs = {
    "start": {
        icon: "images/pic_overweight.jpg",
        exit: false,
        title: "Перевес",
        desc_action: function (world) {
            var desc = "Караван перегружен и не может двигаться";
            addLogMessage(world, Goodness.negative, desc); // логируем
            return desc;
        },
        choices: [
            {
                text: "Сбросить 100 единиц груза",
                action: function (world) {
                    world.cargo = Math.max(0, world.cargo - 100);
                    var next = hasCaravanOverweight(world) ? "start" : "stop";
                    return next;
                }
            },
            {
                text: "Сбросить 10 единиц груза",
                action: function (world) {
                    world.cargo = Math.max(0, world.cargo - 10);
                    var next = hasCaravanOverweight(world) ? "start" : "stop";
                    return next;
                }
            }, {
                text: "Сбросить 10 единиц еды",
                action: function (world) {
                    world.food = Math.max(0, world.food - 10);
                    var next = hasCaravanOverweight(world) ? "start" : "stop";
                    return next;
                }
            }, {
                text: "Сбросить 1 единицу оружия",
                action: function (world) {
                    world.firepower = Math.max(0, world.firepower - 1);
                    var next = hasCaravanOverweight(world) ? "start" : "stop";
                    return next;
                }
            }
        ]
    }
};