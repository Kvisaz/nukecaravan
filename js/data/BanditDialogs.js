/**
 *  Описания диалогов с бандитами
 *  вся структура и логика переходов - здесь
 */

// Это объект, используемый как ассоциативный массив
// названия полей служат для идентификации диалогов

var BanditDialogs = {
    /*
     *   Заготовка для диалога, копируйте и используйте для новых вариантов
     * */
    "none": { //
        iconWar: true, // true для воинственной иконки, false для мирной
        title: "Заголовок окна под иконкой",
        desc: "Возможно многословное описание ситуации мелким шрифтом. Можно пустую строку.",

        // массив выборов - может быть сколько угодно
        // может быть пустым
        choices: [
            {
                text: "Вариант 1",
                action: function (world, bandits) {
                    return "none"; // могут быть разные вычисления и много return
                }
            },
            {
                text: "Вариант 2",
                action: function (world, bandits) {
                    return "none"; // могут быть разные вычисления и много return
                }
            }
        ],
        exit: false // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
        // exit имеет смысл при пустом массиве выборов - то есть просто описание финальной ситуации
    },


    /*
     *   Стартовый диалог
     * */
    "start": { //
        iconWar: true, // true для воинственной иконки, false для мирной
        title: "Вы наткнулись на бандитов!",
        desc: "", // для старта у нас генерируется описание отдельно

        // массив выборов - может быть сколько угодно
        choices: [
            {
                text: "Подойти", // что показывается на кнопке
                action: function (world, bandits) { // функция может содержать любые JavaScript вычисления, главное, чтобы она возвращала строку с идентификатором одного из диалогов
                    if (bandits.firepower > world.firepower) return "fight"; // бандиты наглеют и лезут в бой
                    if (bandits.hunger < BanditConstants.HUNGER_THRESHOLD) return "hungertalk"
                }
            },
            {
                text: "Бежать",
                action: function (world, bandits) {
                    return "run"; // если бежим - бандиты при любом раскладе атакуют, зато меньше потерь
                }
            }
        ],

        exit: true // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
    },

    /*
     *   todo
     * */
    "fight": { //
        iconWar: true,
        title: "Сражение!",
        desc: "Наглые бастарды атаковали ваш караван с целью наживы",
        choices: [
            {   // полновесная стычка, где побеждает тот, у кого больше стволов
                text: "Открыть огонь из всех стволов!",
                action: function (world, bandits) {
                    // количество погибших в вашем отряде - зависит от перевеса в вооружении
                    var damage = Math.ceil(Math.max(0, bandits.firepower * 2 * Math.random() - world.firepower));
                    var isWin = damage > world.crew;
                    return isWin ? "lost" : "win";
                }
            },
            {   // осторожный бой, по сути активное бегство, теряем людей, но меньше, чем при обычном бое
                text: "Отступаем и отстреливаемся",
                action: function (world, bandits) {
                    var damage = Math.ceil(Math.max(0, bandits.firepower * 2 * Math.random() - world.firepower)/ 2);
                    var isWin = damage > world.crew;
                    return isWin ? "lost" : "win";
                }
            },
            {   // Караван, который пытается сбежать... грустное, должно быть, зрелище
                // теряем меньше всего людей
                // но неизбежно теряем какой-то процент браминов/волов/передвижных средств
                // и еды
                text: "Попытаться сбежать",
                action: function (world, bandits) {
                    var damage = Math.ceil(Math.max(0, bandits.firepower * Math.random() / 2));
                    var isWin = damage > world.crew;
                    return isWin ? "lost" : "run"; // или гибнем, или успешно бежим
                }
            }
        ],

        exit: false // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
    },

    /*
     *   todo
     * */
    "hungertalk": { //
        iconWar: false, // true для воинственной иконки, false для мирной
        title: "",
        desc: "hungertalk title",

        // массив выборов - может быть сколько угодно
        choices: [
            {
                text: "Подойти", // что показывается на кнопке
                action: function (world, bandits) { // функция может содержать любые JavaScript вычисления, главное, чтобы она возвращала строку с идентификатором одного из диалогов
                    if (bandits.firepower > world.firepower) return "fight"; // бандиты наглеют и лезут в бой
                    if (bandits.hunger < BanditConstants.HUNGER_THRESHOLD) return "hungertalk"
                }
            },
            {
                text: "Бежать",
                action: function (world, bandits) {
                    return "fight"; // если бежим - бандиты при любом раскладе атакуют, зато меньше потерь
                }
            }
        ],

        exit: false // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
    },


    /*
     *   todo
     * */
    "run": { //
        iconWar: true, // true для воинственной иконки, false для мирной
        title: "run title",
        desc: "",

        // массив выборов - может быть сколько угодно
        choices: [
            {
                text: "Подойти", // что показывается на кнопке
                action: function (world, bandits) { // функция может содержать любые JavaScript вычисления, главное, чтобы она возвращала строку с идентификатором одного из диалогов
                    if (bandits.firepower > world.firepower) return "fight"; // бандиты наглеют и лезут в бой
                    if (bandits.hunger < BanditConstants.HUNGER_THRESHOLD) return "hungertalk"
                }
            },
            {
                text: "Бежать",
                action: function (world, bandits) {
                    return "fight"; // если бежим - бандиты при любом раскладе атакуют, зато меньше потерь
                }
            }
        ],

        exit: false // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
    },





};
