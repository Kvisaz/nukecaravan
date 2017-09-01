/**
 *   Плагин событий, зависящих от дистанции
 *   может менять состояние мира, разрешая другие события
 */

function DistancePlugin(game) {
    this.game = game;
    this.rules = DistanceRules;

    // проставляем метку, что данное правило еще не совпадало
    // иначе при перемещении событие будет происходить постоянно
    this.rules.forEach(function (segment) {
        segment.notVisited = true;
    });

    // при повторном путешествии сегменты надо обнулить
}

DistancePlugin.prototype.update = function (world) {
    var distancePercent = 100 * world.distance / world.to.x;

    var i, rule, game = this.game;
    for (i = 0; i < this.rules.length; i++) {
        rule = this.rules[i];
        if (distancePercent >= rule.distance && rule.notVisited) {
            rule.notVisited = false;
            addLogMessage(world, Goodness.positive, rule.text);
            world.stop = rule.pause;
            break;
        }
    }
};