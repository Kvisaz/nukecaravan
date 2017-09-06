/*
*   Набор рандомных событий, происходят по генератору, правил пока никаких
*   type - один из вариантов Goodness
*       (позитивное, нейтральное, отрицательное изменение)
*
*   $1  - используется для указание реального значения параметра
* */
var RandomEventConstants = {
    EVENT_PROBABILITY: 3, // базовая вероятность случайного события в текущий день
};

var RandomEvents = [
    {
        goodness: Goodness.negative,
        stat: 'crew',
        value: -3,
        text: 'Пищевое отравление. Погибло: $1'
    },
    {
        goodness: Goodness.negative,
        stat: 'crew',
        value: -4,
        text: 'Вспышка простуды. Погибло: $1'
    },

    // food states ---------------------------
    {
        goodness: Goodness.negative,
        stat: 'food',
        value: -10,
        text: 'Заражение червями. Пропало пищи: $1'
    },

    {
        goodness: Goodness.negative,
        stat: 'food',
        value: -15,
        text: 'Бродяги напали на воз с едой. Пропало пищи: $1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 20,
        text: 'Следопыты нашли дикие ягоды. Запасы пищи пополнены: $1'
    },

    {
        goodness: Goodness.positive,
        stat: 'food',
        value: 100,
        text: 'Следопыты застрелили оленя. Запасы пищи пополнены: $1'
    },

    // money states ---------------------------
    {
        goodness: Goodness.negative,
        stat: 'money',
        value: -50,
        text: 'Карманники украли $$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 15,
        text: 'У дороги найден мертвый путешественник. На теле найдено монет: $1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 5,
        text: 'Встречные охотники купили у вас товары. Денег добавлено: $$1'
    },

    {
        goodness: Goodness.positive,
        stat: 'money',
        value: 5,
        text: 'Вы поймали карманника! Отнято денег: $$1'
    },

// Волы -------------------------

    {
        goodness: Goodness.negative,
        stat: 'oxen',
        value: -1,
        text: 'Вспышка гриппа у волов. Погибло: $1'
    },

    {
        goodness: Goodness.positive,
        stat: 'oxen',
        value: 1,
        text: 'Найден дикий вол. Добавлено волов: $1'
    },
];