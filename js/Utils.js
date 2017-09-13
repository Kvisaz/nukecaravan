String.prototype.withArg = function (arg1, arg2) {
    var str = this.replace("$1", arg1);
    if (arg2) {
        str = str.replace("$2", arg2);
    }
    return str;
};

Array.prototype.getRandom = function () {
    // Math.random() will never be 1, nor should it.
    return this[Math.floor(Math.random() * this.length)];
};

// функция для взятия описания по числу от 0 до 1
// описания в массиве идут от 0 до 1, описаний может быть сколько угодно
Array.prototype.getByDegree = function (number) {
    if (number > 1) number = 1;
    var maxI = this.length - 1;
    return this[Math.floor(maxI * number)];
};

// функция проверки для выпадения случаного события с вероятностью от 0 до 1
function checkProbability(probability) {
    return Math.random() <= probability;
}

// функция для проверки выпадения случайного события на текущем шаге игры
function checkEventForStep(dayProbability) {
    var probability = dayProbability * GameConstants.STEP_IN_MS / GameConstants.DAY_IN_MS;
    return checkProbability(probability);
}

// определяем знак числа, -1 или 1. 0 если 0
function getSign(number) {
    return number > 0 ? 1 : number < 0 ? -1 : 0;
}
