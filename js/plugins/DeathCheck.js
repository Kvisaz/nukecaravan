/**
 *   Проверяет условия смерти
 *   по DeathRules
 *   если смерть
 *   - устанавливает world.gameover = true
 *   - устанавливает world.stop = true
 */

DeathCheck = {};

DeathCheck.init = function (world) {
    this.world = world;
    this.rules = DeathRules;
};

DeathCheck.update = function () {
    if (this.world.gameover) return; // если уже мертвы, проверять бесполезно

    // проверка условий по массиву DeathRules
    var i, rule, sign;
    for (i = 0; i < this.rules.length; i++) {
        rule = this.rules[i];
        sign = (rule.live - rule.death) / Math.abs(rule.live - rule.death);
        if (this.world[rule.param] == rule.death || this.world[rule.param] * sign <= rule.death) {
            this.onDeath(this.world, rule);
            break;
        }
    }
};

DeathCheck.onDeath = function (world, rule) {
    Game.stop();
    addLogMessage(world, Goodness.negative, rule.text);
    world.gameover = true;
    world.stop = true;
    DialogWindow.show(DeathDialogs, world, rule, this);
};

DeathCheck.onDialogClose = function () {
    Game.restart();
};

Game.addPlugin(DeathCheck);