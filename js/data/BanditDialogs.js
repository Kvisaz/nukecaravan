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
        iconWin: false, // true для иконки переговоров или победы. Не обязательный параметр.
        exit: false, // наличие кнопки выхода, после которой мы возвращаемся в обычную игру. Необязательный параметр.
        title: "Заголовок окна под иконкой",
        desc: "Возможно многословное описание ситуации мелким шрифтом. Можно пустую строку.",

        // Необязательная функция. Можно в принципе не указывать
        // Позволяет добавлять вычисляемые параметры после desc.
        // Возвращайте строку. Если нет вычислений - пишите только в desc.
        desc_action: function (world, bandits) {
            return " ";
        },

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
    "start": {
        title: "Вы наткнулись на бандитов!",
        desc: "",
        desc_action: function (world, bandits) {
            var desc = bandits.text + " " + BanditAtmospheric.getRandom() + ". ";
            desc += "Они " + BanditFirepowers.getByDegree(bandits.crew / bandits.firepower) + ".";
            desc += "Число людей в банде: " + BanditNumbers.getByDegree(bandits.crew / 10) + ".";
            addLogMessage(world, Goodness.negative, this.title); // логируем описание
            addLogMessage(world, Goodness.negative, desc); // логируем описание
            return desc;
        },
        choices: [
            {
                text: "Подойти", // что показывается на кнопке
                action: function (world, bandits) {
                    // бандиты наглеют и лезут в бой, если у них больше оружия
                    if (bandits.firepower > world.firepower) return "fight";
                    // голодный найм, бандиты сбрасываютцену на найм
                    if (bandits.hunger < BanditConstants.HUNGER_THRESHOLD) return "hungertalk";
                    // обычный найм, если силы равны и никто не голоден, и у вас есть деньги
                    console.log("world.money = "+world.money);
                    console.log("BanditConstants.HIRE_PRICE_PER_PERSON = "+BanditConstants.HIRE_PRICE_PER_PERSON);
                    if (world.money >= BanditConstants.HIRE_PRICE_PER_PERSON) return "hiretalk";

                    // нет денег
                    addLogMessage(world, Goodness.neutral, "Вы расходитесь с бандитами миром");
                    return "hiretalk_nomoney"; // todo
                }
            },
            {
                text: "Бежать",
                action: function (world, bandits) {
                    return "run"; // если бежим - бандиты при любом раскладе атакуют, зато меньше потерь
                }
            }
        ],
    },

    /*
     *   todo
     * */
    "fight": { //
        title: "Сражение!",
        desc: "Наглые бастарды атаковали ваш караван с целью наживы",
        choices: [
            {   // полновесная стычка, где побеждает тот, у кого больше стволов
                text: "Открыть огонь из всех стволов!",
                action: function (world, bandits) {
                    // количество погибших в вашем отряде - зависит от перевеса в вооружении
                    var damage = Math.ceil(Math.max(0, bandits.firepower * 2 * Math.random() - world.firepower));
                    world.crew -= damage;
                    addLogMessage(world, 'В яростной атаке вы потеряли ' + damage + ' человек.');
                    var isWin = world.crew > 0;
                    return isWin ? "lost" : "win";
                }
            },
            {   // осторожный бой, по сути активное бегство, теряем людей, но меньше, чем при обычном бое
                text: "Занять круговую оборону и принять бой!",
                action: function (world, bandits) {
                    var damage = Math.ceil(Math.max(0, bandits.firepower * 2 * Math.random() - world.firepower) / 2);
                    world.crew -= damage;
                    addLogMessage(world, 'В бою погибло ' + damage + ' человек.');
                    var isWin = world.crew > 0;
                    return isWin ? "lost" : "win";
                }
            },
            {   // Караван, который пытается сбежать... грустное, должно быть, зрелище
                // теряем меньше всего людей
                // но неизбежно теряем какой-то процент браминов/волов/передвижных средств
                // и еды
                text: "Попытаться сбежать",
                action: function (world, bandits) {
                    return "run"; // или гибнем, или успешно бежим
                }
            }
        ],
    },

    /*
     *   todo
     * */
    "hungertalk": { //
        iconWin: true, // true для воинственной иконки, false для мирной
        title: "Бандиты хотят присоединиться!",
        desc: "Восхищенные вашим оружием и едой, голодные оборванцы хотят служить в вашем караване!",
        desc_action: function (world, bandits) {
            var info = " " + BanditConstants.HIRE_INFO.withArg(bandits.crew, bandits.firepower);
            // чем голоднее бандиты, тем ниже цена
            var price = Math.floor(BanditConstants.HIRE_PRICE_PER_PERSON * bandits.hunger);
            info += " " + BanditConstants.HIRE_PRICE_INFO.withArg(price)
            return info;
        },

        // массив выборов - может быть сколько угодно
        choices: [
            {
                text: "Нанять всех",
                action: function (world, bandits) {

                    return "h"
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
    "hiretalk": { //
        iconWin: true,
        title: "Разговор на равных",
        desc: "Бандиты выказывают респект вашему вооружению. Часть из них хочет примкнуть к вашему каравану.",
        desc_action: function (world, bandits) {

            // это не голодные бандиты, они хотят обычную цену
            var price = BanditConstants.HIRE_PRICE_PER_PERSON;
            // вычисляем, сколько вы можете нанять
            var maxForHire = Math.floor(world.money / price);

            // вычисляем, сколько бандитов могло бы наняться совсем
            bandits.hired = {}; // добавляем в бандитов инфу о цене и количестве
            bandits.hired.crew = Math.floor(Math.random() * bandits.crew * 0.5); // создаем поле для передачи в выбор
            // разумеется, нанять мы можем не больше, чем у нас есть денег
            // условие наличия денег проверяется перед вызовом диалога
            bandits.hired.crew = Math.max(maxForHire, bandits.hired.crew);
            // вычисляем окончательную цену
            bandits.hired.price = Math.floor(BanditConstants.HIRE_PRICE_PER_PERSON * bandits.hired.crew);

            // сколько может быть оружия у нанимающихся - вычисляем по среднему
            var firepowerAvg = bandits.firepower / bandits.crew;
            bandits.hired.firepower = Math.ceil(bandits.hired.crew * firepowerAvg);

            // формируем текст
            var info = " " + BanditConstants.HIRE_INFO.withArg(bandits.hired.crew, bandits.hired.firepower);
            info += " " + BanditConstants.HIRE_PRICE_INFO.withArg(bandits.hired.price);
            return info;
        },

        choices: [
            {
                text: "Нанять",
                action: function (world, bandits) {
                    world.crew += bandits.hired.crew;
                    world.firepower += bandits.hired.firepower;
                    world.money -= bandits.hired.price;
                    return "hire_success";
                }
            },
            {
                text: "Отказать",
                action: function (world, bandits) {
                    addLogMessage(world, Goodness.neutral, "Вы расходитесь с бандитами миром");
                    return "hire_decline";
                }
            }
        ],

        exit: false // наличие кнопки выхода, после которой мы возвращаемся в обычную игру
    },

    "hire_decline": {
        iconWin: true,
        exit: true, // финал,
        title: "Бандиты подавлены",
        desc: "Они хотели бы служить у вас, но вы отказали им по своей причине. Уходя, вы слышите выстрел. Кажется, кто-то из неудачников застрелился, не вынеся депрессии.",
        choices: []
    },

    "hire_success": {
        iconWin: true,
        exit: true, // финал
        title: "Переговоры прошли успешно",
        desc: "Вы наняли бандитов.",
        desc_action: function (world, bandits) {
            var message = "К вам присоединилась часть бандитов. ";
            message += "Людей: +" + bandits.hired.crew + ". ";
            message += "Оружия: +" + bandits.hired.firepower;
            message += "Денег: -" + bandits.hired.price;
            addLogMessage(world, message);
            return message;
        },
        choices: [] // никаких вариантов
    },

    "hiretalk_nomoney": {
        iconWin: true,
        exit: true,
        title: "Бандиты разочарованы",
        desc: "Они хотели бы наняться к вам, но у вас слишком мало денег",
        choices: []
    },

    /*
     *   todo
     * */
    "run": { //
        title: "Побег",
        exit: true, // возвращение к обычной игре
        desc: "Воодушевленные вашим отступлением, бандиты стреляют вам вслед и улюлюкают.",
        desc_action: function (world, bandits) {
            // при побеге наносится ослабленный ущерб
            var damage = Math.ceil(Math.max(0, bandits.firepower * Math.random() / 2));
            var survivedBase = world.crew - damage; // предварительное число выживших
            var survived = Math.max(BanditConstants.RUN_CREW_MIN, survivedBase); // гарантируем выживание при побеге.
            var lostCrew = world.crew - survived;
            world.crew = survived;

            // подсчитываем ущербы
            var lostOxen = Math.ceil(world.oxen * BanditConstants.RUN_OXES_LOST_K);
            var lostFood = Math.ceil(world.food * BanditConstants.RUN_FOOD_LOST_K);
            var lostGold = Math.ceil(world.food * BanditConstants.RUN_GOLD_LOST_K);

            // меняем мир
            world.oxen -= lostOxen;
            world.food -= lostFood;
            world.money -= lostGold;

            // создаем описание
            var desc = " Ваши потери: люди: " + lostCrew;
            desc += " / браминов: " + lostOxen + " / eда: " + lostFood + ". Денег: " + lostGold
                addLogMessage(world, Goodness.negative, desc); // логируем описание

            return desc;
        },
        choices: [], // выборов тут нет, это терминальное окно
    },


};
