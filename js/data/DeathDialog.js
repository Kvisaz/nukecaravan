/**
 *  Диалоги для смерти и рестарта.
 */
var DeathDialogs = {
    "start": {
        icon: "images/death_picture.jpg",
        title: "Погибший в пустоши",
        desc: "Ваш караван погиб в радиоактивной пустоши. Может быть, следующим караванщикам повезет больше?",
        desc_action: function (world) {
            var desc = " Вы сумели пройти "+Math.floor(world.distance) + " миль и накопить "+Math.floor(world.money) + " денег";
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