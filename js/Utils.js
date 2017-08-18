var Utils = Utils || {};

Utils.Random = {};

Utils.Random.fromArray = function(array){
  // Math.random() will never be 1, nor should it.
  return array[Math.floor(Math.random() * array.length)];	
};

String.prototype.withArg = function(arg){
	return this.replace("$1", arg);
};

Array.prototype.getRandom = function(){
    // Math.random() will never be 1, nor should it.
    return this[Math.floor(Math.random() * this.length)];
};