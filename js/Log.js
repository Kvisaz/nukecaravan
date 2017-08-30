/**
 *  Общие функции добавления сообщений в лог
 */

function addLogMessage(world, goodness, message) {
    world.log.push({
        day: world.day,
        message: message,
        goodness: goodness
    });
}