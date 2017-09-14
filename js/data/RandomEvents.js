var RandomEventConstants = {
    EVENT_PROBABILITY: 1, // 3 // примерное число событий в день, реально будет колебаться около этого значения
};

/*
 *   Набор рандомных событий, происходят по генератору, правил пока никаких
 *   type - один из вариантов Goodness
 *       (позитивное, нейтральное, отрицательное изменение)
 *
 *   $1  - используется для указание реального значения параметра
 * */
var RandomEvents = [
    {
        goodness: Goodness.negative,
        stat: 'crew',
        value: -4,
        text: 'На караван напал смертокогть! Людей: -$1'
    },
    {
        goodness: Goodness.negative,
        stat: 'crew',
        value: -3,
        text: 'Радиоактивная буря убила часть команды. Людей: -$1'
    },
    {
        goodness: Goodness.positive,
        stat: 'crew',
        value: 2,
        text: 'Вы встретили одиноких путников, которые с радостью хотят присоединиться к вам. Людей: +$1'
    },

    // food states ---------------------------
    {
        goodness: Goodness.negative,
        stat: 'food',
        value: -10,
        text: 'Кротокрысы на привале сожрали часть еды. Пропало пищи: -$1'
    },

    {
        goodness: Goodness.negative,
        stat: 'food',
        value: -15,
        text: 'Радиоактивные осадки испортили часть запасов. Пищи: -$1'
    },

    {
        goodness: Goodness.negative,
        stat: 'food',
        value: -5,
        text: 'В запасах еды завелись черви. Пропало пищи: -$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 20,
        text: 'Следопыты нашли съедобный кактус. Запасы пищи: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 20,
        text: 'Ваши люди подстрелили нападающих кротокрысов. Запасы пищи: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 30,
        text: 'Атака гекконов успешно отражена. Запасы еды: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 10,
        text: 'В руинах дома следопыты нашли довоенные консервы. Запасы еды: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 5,
        text: 'На дороге найдены хорошие довоенные кожаные сапоги. Запасы еды: +$1'
    },

    // money states ---------------------------
    {
        goodness: Goodness.negative,
        stat: 'money',
        value: -50,
        text: 'Воры выследили ваш караван. Денег: -$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 15,
        text: 'У дороги найден мертвый путешественник. На теле найдены монеты. Денег: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 5,
        text: 'Встречные охотники купили у вас товары. Денег: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 5,
        text: 'Вы поймали вора, затаившегося у дороги, и отняли у него часть добычи! Денег: +$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 12,
        text: 'Следопыты нашли и раскопали свежую могилу. Денег: +$1'
    },

// Волы -------------------------

    {
        goodness: Goodness.negative,
        stat: 'oxen',
        value: -1,
        text: 'Радиоактивные гекконы напали на ваших быков. Браминов: -$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'oxen',
        value: 1,
        text: 'Найден одичалый брамин. Браминов: +$1'
    },
];