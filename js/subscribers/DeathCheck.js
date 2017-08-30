/**
 *   Проверяет условия смерти
 *   по DeathRules
 *   если смерть
 *   - устанавливает world.death = true
 *   - устанавливает world.pause = true
 */

function DeathCheck() {
    this.rules = DeathRules;
}

DeathCheck.prototype.update = function (world) {
    // проверка условий по массиву DeathRules
    var i, rule, sign, game = this.game, death = false;
    for (i = 0; i < this.rules.length; i++) {
        rule = this.rules[i];
        sign = (rule.live - rule.death) / Math.abs(rule.live - rule.death);
        if (world[rule.param] == rule.death || world[rule.param] * sign < rule.death) {
            this.onDeath(world, rule);
            break;
        }
    }
    return death;
};

DeathCheck.prototype.onDeath = function (world, rule) {
    addLogMessage(world, Goodness.negative,rule.text);
    world.dead = true;
    world.paused = true;
};