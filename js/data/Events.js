var Caravan = Caravan || {};
Caravan.Event = {};


/*
    type: refers to what type of event this is. See how they are all of type “STAT-CHANGE” for now.
    
	notification: positive, neutral or negative
    
	stat: which property of the caravan we are changing
    
	value: how much are we changing this property by (it can be positive or negative)
    
	text: what we show to the user in the message log

*/

Caravan.Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -3,
    text: 'Пищевое отравление. Погибло: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'crew',
    value: -4,
    text: 'Вспышка простуды. Погибло: '
  },
	
	// food states ---------------------------
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Заражение червями. Пропало пищи: '
  },
	
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -15,
    text: 'Бродяги напали на воз с едой. Пропало пищи: '
  },
	
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Следопыты нашли дикие ягоды. Запасы пищи пополнены: '
  },
	
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 100,
    text: 'Следопыты застрелили оленя. Запасы пищи пополнены: '
  },
	
  // money states ---------------------------
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Карманники украли $'
  },
	
	{
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'money',
    value: 15,
    text: 'У дороги найден мертвый путешественник. На теле найдено монет: '
  },
	
	{
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'money',
    value: 5,
    text: 'Встречные охотники купили у вас товары. Денег добавлено:'
  },
	
	{
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'money',
    value: 5,
    text: 'Вы поймали карманника! Отнято денег: $'
  },
	
// Волы ------------------------- 	 
	
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'oxen',
    value: -1,
    text: 'Вспышка гриппа у волов. Погибло: '
  },

  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'oxen',
    value: 1,
    text: 'Найден дикий вол. Добавлено волов: '
  },
	
 // Магазины -------------------------	
	
{
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'crew', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'oxen', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'crew', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'oxen', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'crew', qty: 5, price: 60}
    ]
  },
	
	// Сражения -------------------------	
	
  {
    type: 'ATTACK',
    notification: 'negative',
    text: R.strings.EVENT_BANDITS_ATTACKS
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: R.strings.EVENT_BANDITS_ATTACKS
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: R.strings.EVENT_BANDITS_ATTACKS
  }	
 
];

Caravan.Event.generateEvent = function(){	
	var eventData = this.eventTypes.getRandom();
  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {	
    this.stateChangeEvent(eventData);
  }
	//shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();
 
    //notify user
    this.ui.notify(eventData.text, eventData.notification);
 
    //prepare event
    this.shopEvent(eventData);
  }
 
  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();
 
    //notify user
    this.ui.notify(eventData.text, eventData.notification);
 
    //prepare event
    this.attackEvent(eventData);
  }
 
};

Caravan.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.caravan[eventData.stat] >= 0) {
	var value = Math.floor(Math.random() * eventData.value);
	  console.log("event value = "+value);
	  console.log("eventData.value = "+eventData.value);
    this.caravan[eventData.stat] += value;
    this.ui.notify(eventData.text + Math.abs(value), eventData.notification);
  }
}
	
Caravan.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);
 
  //product list
  var products = [];
  var j, priceFactor;
 
  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);
 
    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();
 
    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }
 
  this.ui.showShop(products, Caravan.Caravan);
};
 
//prepare an attack event
Caravan.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * Caravan.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * Caravan.ENEMY_GOLD_AVG);
 
  this.ui.showAttack(firepower, gold);
};