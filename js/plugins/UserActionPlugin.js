/**
 *  Модуль интерфейса для активных действий пользователя
 *  в любой момент игры
 *
 *  - каждый модуль интерфейса должен содержать функцию init(world, game)
 *  - в листенерах при изменении параметров world должен вызываться game.onWorldUpdate
 */

var UserActionPlugin = {};

UserActionPlugin.init = function (world) {
    this.world = world;
    this.lastWorldGameOver = false;
    this.addListeners(world);
};

// Основная функция - делать недоступными кнопки интерфейса,
// если состояние изменилось на gameover
// и наоборот
UserActionPlugin.update = function () {
    var world = this.world;
    if (this.lastWorldGameOver == world.gameover) return; // никаких изменений, возвращаемся
    this.lastWorldGameOver = world.gameover; // сохраняем текущее состояние мира
    var userInputDiv = document.getElementById("user-input");
    if (this.lastWorldGameOver) {
        userInputDiv.classList.add('hidden');
    }
    else {
        userInputDiv.classList.remove('hidden');
    }
};

UserActionPlugin.addListeners = function (world) {
    var dropWeaponButton = document.getElementById('actions-dropweapon');
    var dropFoodButton = document.getElementById('actions-dropfood');

    dropFoodButton.addEventListener('click', function (e) {
       if (world.food == 0) {
            return;
        }
        world.food--;
        if (world.food <= 0) {
            addLogMessage(world, Goodness.neutral, R.strings.DROPPED_NO);
            world.food = 0;
        }

        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_FOOD.withArg(Caravan.FOOD_WEIGHT));
    });

    dropWeaponButton.addEventListener('click', function (e) {
        if (world.firepower == 0) {
            return;
        }
        world.firepower--;
        if (world.firepower < 0) {
            addLogMessage(world, Goodness.neutral, R.strings.DROPPED_NO);
            world.firepower = 0;
        }
        //world.weight -= Caravan.FIREPOWER_WEIGHT;
        addLogMessage(world, Goodness.neutral, R.strings.DROPPED_GUNS.withArg(Caravan.FIREPOWER_WEIGHT));
    });
};