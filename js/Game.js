var Caravan = Caravan || {};

//constants
Caravan.WEIGHT_PER_OX = 20;
Caravan.WEIGHT_PER_PERSON = 2;
Caravan.FOOD_WEIGHT = 0.6;
Caravan.FIREPOWER_WEIGHT = 5;
Caravan.GAME_SPEED = 800;
Caravan.DAY_PER_STEP = 0.2;
Caravan.FOOD_PER_PERSON = 0.02;
Caravan.FULL_SPEED = 5;
Caravan.SLOW_SPEED = 3;
Caravan.FINAL_DISTANCE = 1000;
Caravan.EVENT_PROBABILITY = 0.15;
Caravan.ENEMY_FIREPOWER_AVG = 5;
Caravan.ENEMY_GOLD_AVG = 50;

Caravan.Game = {};

//initiate the game
Caravan.Game.init = function () {
    // new logic ----------------------
    this.world = new World({
        day: 0,
        distance: 0,
        crew: 30,
        food: 80,
        oxen: 2,
        money: 300,
        firepower: 2
    });

    this.ui = Caravan.UI;
    this.world.subcribe(this.ui);

    // old logic -----------------------
    //reference ui
    this.ui = Caravan.UI;

    //reference event manager
    this.eventManager = Caravan.Event;

    //setup caravan
    this.caravan = Caravan.Caravan;
    this.caravan.init({
        day: 0,
        distance: 0,
        crew: 30,
        food: 80,
        oxen: 2,
        money: 300,
        firepower: 2
    });

    /*this.world = new World({
     day: 0,
     distance: 0,
     crew: 30,
     food: 80,
     oxen: 2,
     money: 300,
     firepower: 2
     });*/

    //pass references
    this.caravan.ui = this.ui;
    //this.world.subcribe(this.ui);


    this.caravan.eventManager = this.eventManager;

    this.ui.game = this;
    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;

    //begin adventure!
    this.startJourney();
};

//start the journey and time starts running
Caravan.Game.startJourney = function () {
    this.gameActive = true;
    this.previousTime = null;
    // this.ui.notify(R.strings.START_MESSAGE, 'positive');
    // message goes to world

    // this.step();
    // setInterval for old Safari
    this.startLoop();
};

// start loop
Caravan.Game.startLoop = function () {
    Caravan.Game.interval = setInterval(Caravan.Game.step, Caravan.GAME_SPEED);
    Caravan.Game.time = 0;
};

// end loop
Caravan.Game.endLoop = function () {
    clearInterval(Caravan.Game.interval);
};


//game loop
Caravan.Game.step = function () {
    Caravan.Game.time += Caravan.GAME_SPEED;

    console.log("Caravan.Game.step!");
    //starting, setup the previous time for the first time
    if (!Caravan.Game.previousTime) {
        Caravan.Game.previousTime = Caravan.Game.time;
        Caravan.Game.updateGame();
    }

    //time difference
    var progress = Caravan.Game.time - Caravan.Game.previousTime;

    //game update
    console.log("progress: " + progress + " / Caravan.GAME_SPEED: " + Caravan.GAME_SPEED);
    console.log("Caravan.Game.time: " + Caravan.Game.time);
    if (progress >= Caravan.GAME_SPEED) {
        Caravan.Game.previousTime = Caravan.Game.time;
        Caravan.Game.world.nextStep();
    }

    //we use "bind" so that we can refer to the context "this" inside of the step method
    // if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));

    if (!Caravan.Game.gameActive) {
        Caravan.Game.endLoop();
    }

};

//update game stats
Caravan.Game.updateGame = function () {
    //day update
    // this.caravan.day += Caravan.DAY_PER_STEP;

    //food consumption
    // this.caravan.consumeFood();

    //update weight
    // this.caravan.updateWeight();

    //update progress
    // this.caravan.updateDistance();

    this.caravan.updateDay();

    //show stats
    this.ui.refreshStats();

    //game over no food
    if (this.caravan.food === 0) {
        this.ui.notify(R.strings.DEATH_STARVED, 'negative');
        this.gameActive = false;
        return;
    }

    //check if everyone died
    if (this.caravan.crew <= 0) {
        this.caravan.crew = 0;
        this.ui.notify(R.strings.DEATH_ALL, 'negative');
        this.gameActive = false;
        return;
    }

    //check win game
    if (this.caravan.distance >= Caravan.FINAL_DISTANCE) {
        this.ui.notify(R.strings.SUCCESS_HOME, 'positive');
        this.gameActive = false;
        return;
    }


    //random events
    if (Math.random() <= Caravan.EVENT_PROBABILITY) {
        this.eventManager.generateEvent();
    }

};

//pause the journey
Caravan.Game.pauseJourney = function () {
    this.gameActive = false;
};

//resume the journey
Caravan.Game.resumeJourney = function () {
    this.gameActive = true;
    Caravan.Game.startLoop();
};


//init game
Caravan.Game.init();