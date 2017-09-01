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
        if(world.food==0){ return; }
        world.food--;
        if(world.food<=0){
            addLogMessage(world, Goodness.neutral, R.strings.DROPPED_NO);
            world.food = 0;
        }
        //world.weight -= Caravan.FOOD_WEIGHT;
        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_FOOD.withArg(Caravan.FOOD_WEIGHT));

        world.stop = false;

    });

    dropWeaponButton.addEventListener('click', function (e) {
        if(world.firepower==0){ return; }
        world.firepower--;
        if(world.firepower<0){
            addLogMessage(world, Goodness.neutral, R.strings.DROPPED_NO);
            world.firepower = 0;
        }
        //world.weight -= Caravan.FIREPOWER_WEIGHT;
        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_GUNS.withArg(Caravan.FIREPOWER_WEIGHT));
        world.stop = false;
    });
}