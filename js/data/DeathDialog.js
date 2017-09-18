/**
 *  Диалоги для смерти и рестарта.
 */
var DeathDialogs = {
    "start": {
        icon: "images/pic_death.jpg",
        title: "Погибший в пустоши",
        desc: "",
        desc_action: function (world, rule) {
            var desc = " Причина смерти: "+rule.text+". Вы сумели пройти "+Math.floor(world.distance) + " миль и накопить "+Math.floor(world.money) + " денег. ";
            desc += "Может быть, следующим караванщикам повезет больше?"
            return desc;
        },
        choices:[
            {
                text: 'Начать новую игру',
                action: function () { return "stop"; }
            }
        ]
    },
};