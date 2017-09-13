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
        // можно не указывать параметр вообще - в BanditPlugin есть проверка на наличие,
        // если не указывать - никаких выборов не будет выведено
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
    },


    /*
     *   Стартовый диалог
     * */
    "start": {
        title: "Вы наткнулись на бандитов!",
        desc: "",
        desc_action: function (world, bandits) {
            var desc = bandits.text + " " + BanditAtmospheric.getRandom() + ". ";
            desc += "Они " + BanditFirepowers.getByDegree(bandits.firepower / bandits.crew) + ".";
            desc += "Число людей в банде: " + BanditNumbers.getByDegree(bandits.crew / 10) + ".";
            addLogMessage(world, Goodness.negative, this.title); // логируем описание
            addLogMessage(world, Goodness.negative, desc); // логируем описание

            console.log("bandits.firepower = "+bandits.firepower + " / crew: "+bandits.crew + " / money: "+bandits.money);

            return desc;
        },
        choices: [
            {
                text: "Подойти", // что показывается на кнопке
                action: function (world, bandits) {
                    // первоначальная идея была такая
                    // бандиты наглеют и лезут в бой, если у них больше оружия
                    // но решено было отказаться - так как при накоплении оружия в караване все бандиты отказываются от атаки
                    // это нереалистично и неинтересно. Всегда есть отморозки и оружие к тому же трудно оценить точно.

                    // if (bandits.firepower > world.firepower) return "fight"; // ...................

                    // поэтому оставили вариант с голым рандомом
                    if (checkProbability(BanditConstants.ATTACK_PROBABILITY)) return "fight";

                    // переменные для найма
                    var price = BanditConstants.HIRE_PRICE_PER_PERSON; // цена за 1 бандита
                    var maxForHire;   // максимум нанимающихся
                    var firepowerAvg = bandits.firepower / bandits.crew; // среднее количество оружия у 1 бандита
                    console.log("firepowerAvg = "+firepowerAvg);

                    // голодный найм,
                    if (bandits.hunger < BanditConstants.HUNGER_THRESHOLD) {
                        price = Math.floor(price * bandits.hunger); // бандиты сбрасывают цену
                        // защита от выпадения нуля
                        maxForHire = price > 0 ? Math.floor(world.money / price) : bandits.crew;
                        console.log("maxForHire = "+maxForHire);
                        bandits.hired = {}; // добавляем в бандитов инфу о цене и количестве
                        bandits.hired.crew = bandits.crew; // голодные хотят наняться все
                        // разумеется, нанять мы можем не больше, чем у нас есть денег
                        // условие наличия денег проверяется перед вызовом диалога
                        bandits.hired.crew = Math.min(maxForHire, bandits.hired.crew);
                        console.log("bandits.hired.crew = "+bandits.hired.crew);
                        // вычисляем окончательную цену
                        bandits.hired.price = Math.floor(BanditConstants.HIRE_PRICE_PER_PERSON * bandits.hired.crew);
                        bandits.hired.firepower = Math.ceil(bandits.hired.crew * firepowerAvg);
                        return "hunger_talk";
                    }


                    // обычный найм, если силы равны и никто не голоден, и у вас есть деньги
                    console.log("world.money = " + world.money);
                    console.log("BanditConstants.HIRE_PRICE_PER_PERSON = " + BanditConstants.HIRE_PRICE_PER_PERSON);
                    if (world.money >= BanditConstants.HIRE_PRICE_PER_PERSON) {
                        maxForHire = price > 0 ? Math.floor(world.money / price) : bandits.crew;
                        bandits.hired = {}; // добавляем в бандитов инфу о цене и количестве
                        bandits.hired.crew = Math.floor(Math.random() * bandits.crew * 0.5); // сытые хотят наниматься не все
                        bandits.hired.crew = Math.min(maxForHire, bandits.hired.crew); // гарантируем, что не нанимаем больше, чем у нас есть денег
                        // вычисляем окончательную цену
                        bandits.hired.price = Math.floor(BanditConstants.HIRE_PRICE_PER_PERSON * bandits.hired.crew);
                        bandits.hired.firepower = Math.ceil(bandits.hired.crew * firepowerAvg);
                        return "hire_talk";
                    }

                    // нет денег
                    addLogMessage(world, Goodness.neutral, "Вы расходитесь с бандитами миром");
                    return "hire_talk_nomoney";
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

    "fight": { //
        title: "Сражение!",
        desc: "Наглые бастарды атаковали ваш караван с целью наживы",
        choices: [
            {   // полновесная стычка, где побеждает тот, у кого больше стволов
                text: "Открыть огонь из всех стволов!",
                action: function (world, bandits) {
                    var damage = BanditMathUtils.getDamage(world, bandits);                            world.crew -= damage;
                    addLogMessage(world, Goodness.negative, 'В яростной атаке вы потеряли ' + damage + ' человек.');
                    var isWin = world.crew > 0;
                    return isWin ? "win" : "lost";
                }
            },
            {   // осторожный бой, по сути активное бегство, теряем людей, но меньше, чем при обычном бое
                text: "Занять круговую оборону и принять бой!",
                action: function (world, bandits) {
                    bandits.lootK = BanditConstants.FIGHT_DEFENSE_K; // коээфициент лута и потерь
                    var damage = BanditMathUtils.getDamage(world, bandits);
                    damage = Math.floor(damage*bandits.lootK);
                    world.crew -= damage;
                    addLogMessage(world, Goodness.negative, 'В бою погибло ' + damage + ' человек.');
                    var isWin = world.crew > 0;
                    return isWin ? "win" : "lost";
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
    "hunger_talk": { //
        iconWin: true, // true для воинственной иконки, false для мирной
        title: "Бандиты хотят присоединиться!",
        desc: "Восхищенные вашим оружием и едой, голодные оборванцы хотят служить в вашем караване за минимальную цену!",
        desc_action: function (world, bandits) {
            var info = " " + BanditConstants.HIRE_INFO.withArg(bandits.hired.crew, bandits.hired.firepower);
            info += " " + BanditConstants.HIRE_PRICE_INFO.withArg(bandits.hired.price);
            return info;
        },

        // массив выборов - может быть сколько угодно
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
                    // если бандиты очень голодны - они попросятся еще раз
                    var isDeathHunger = bandits.hunger <= BanditConstants.HUNGER_DEATH_THRESHOLD;
                    var nextDialog = isDeathHunger ? "hunger_death_talk" : "hire_decline"
                    return nextDialog;
                }
            }
        ],
    },


    /*
     *   todo
     * */
    "hire_talk": { //
        iconWin: true,
        title: "Разговор на равных",
        desc: "Бандиты выказывают респект вашему вооружению. Часть из них хочет примкнуть к вашему каравану.",
        desc_action: function (world, bandits) {
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
        ]
    },

    "hire_decline": {
        iconWin: true,
        exit: true, // финал,
        title: "Бандиты подавлены",
        desc: "Они хотели бы служить у вас, но вы отказали им по своей причине. Уходя, вы слышите выстрел. Кажется, кто-то из неудачников застрелился."
    },

    "hire_success": {
        iconWin: true,
        exit: true, // финал
        title: "Переговоры прошли успешно",
        desc: "",
        desc_action: function (world, bandits) {
            var isAll = bandits.hired.crew == bandits.crew;
            var message = isAll ? "К вам присоединились все бандиты" :"К вам присоединилась часть бандитов. ";
            message += "Людей: +" + bandits.hired.crew + ". ";
            message += "Оружия: +" + bandits.hired.firepower + ". ";

            var priceMessage = bandits.hired.price > 0 ? "Денег: -" + bandits.hired.price : "Это не стоил вам ничего";
            message += priceMessage;
            addLogMessage(world, Goodness.positive, message);
            return message;
        }
    },

    "hire_talk_nomoney": {
        iconWin: true,
        exit: true,
        title: "Бандиты разочарованы",
        desc: "Они хотели бы наняться к вам, но у вас слишком мало денег",
        choices: []
    },

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

            // подсчитываем ущербы, они не должны быть больше имеющихся параметров
            var lostOxen = Math.min(world.oxen, Math.ceil(world.oxen * BanditConstants.RUN_OXES_LOST_K));
            var lostFood = Math.min(world.food, Math.ceil(world.food * BanditConstants.RUN_FOOD_LOST_K));
            var lostMoney = Math.min(world.money, Math.ceil(world.money * BanditConstants.RUN_GOLD_LOST_K));

            // меняем мир
            world.oxen -= lostOxen;
            world.food -= lostFood;
            world.money -= lostMoney;

            // создаем описание
            var desc = " Ваши потери: люди: " + lostCrew;
            desc += " / браминов: " + lostOxen + " / eда: " + lostFood + ". Денег: " + lostMoney;
            addLogMessage(world, Goodness.negative, desc); // логируем описание

            return desc;
        }
    },


    "lost": {
        exit: true,
        title: "Поражение!",
        desc: "",
        desc_action: function (world, bandits) {
            var desc = BanditLostMessages.getRandom();
            addLogMessage(world, Goodness.positive, desc);
            return BanditLostMessages.getRandom();
        }
    },

    "win": {
        iconWin: true,
        exit: true,
        title: "Победа!",
        desc: "",
        desc_action: function (world, bandits) {
            var lootFirepower = Math.floor(bandits.lootK * bandits.firepower);
            var lootMoney = Math.floor(bandits.lootK * bandits.money);

            var desc = BanditWinMessages.getRandom();
            desc += " " + BanditConstants.LOOT_TITLE;
            desc += " " + BanditConstants.LOOT_WEAPON_MESSAGE.withArg(lootFirepower);
            desc += ", " + BanditConstants.LOOT_MONEY_MESSAGE.withArg(lootMoney);

            world.firepower += lootFirepower;
            world.money += lootMoney;

            addLogMessage(world, Goodness.positive, desc);
            return desc;
        }
    },

    "hunger_death_talk": {
        title: "Бандиты просят принять их",
        desc:"Они готовы служить вам бесплатно. Вот что они говорят: ",
        desc_action: function (world, bandits) {
            return '"'+BanditDeathHungerMessages.getRandom()+'"';
        },
        choices: [
            {
                text:"Спасти оборванцев от голодной смерти",
                action: function (world, bandits) {
                    bandits.hired = {}; // добавляем в бандитов инфу о цене и количестве
                    bandits.hired.crew = bandits.crew; // сытые хотят наниматься не все
                    bandits.hired.price = 0;
                    bandits.hired.firepower = bandits.firepower;
                    return "hire_success";
                }
            },
            {
                text: "Отказать",
                action: function (world, bandits) {
                    return "hire_decline";
                }
            }
        ]
    },
};