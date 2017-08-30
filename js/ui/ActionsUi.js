/**
 *  Модуль интерфейса для активных действий пользователя
 *  в любой момент игры
 *
 *  - каждый модуль интерфейса должен содержать функцию init(world, game)
 *  - в листенерах при изменении параметров world должен вызываться game.onWorldUpdate
 *
 *
 */

// сначала попробуем обойтись просто функцией - todo delete
function initActionUi(world, game) {
    var dropWeaponButton = document.getElementById('actions-dropweapon');
    var dropFoodButton = document.getElementById('actions-dropfood');

    dropFoodButton.addEventListener('click', function (e) {
        console.log("dropFoodButton clicked!"); // todo delete

        world.food--;
        world.weight -= Caravan.FOOD_WEIGHT;
        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_FOOD.withArg(Caravan.FOOD_WEIGHT));
        game.onWorldUpdate();
        if(world.paused){ game.resume(); }

    });

    dropWeaponButton.addEventListener('click', function (e) {
        console.log("dropWeaponButton clicked!"); // todo delete

        world.firepower--;
        world.weight -= Caravan.FIREPOWER_WEIGHT;
        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_GUNS.withArg(Caravan.FIREPOWER_WEIGHT));

        game.onWorldUpdate();
        if(world.paused){ game.resume(); }
    });
}