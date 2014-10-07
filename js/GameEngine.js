define(function(require, exports, module) {

	var Engine = require('famous/core/Engine');
	var Transform = require('famous/core/Transform');
	var Easing = require('famous/transitions/Easing');
	var Timer = require('famous/utilities/Timer');

    /*-- 
        PUBLIC VARIABLE LIST
        

     --*/
    
    /*--- CONSTRUCTION ---*/

    //Prototype constructor
    function GameEngine(gameObjects) {

    	this._gameObjects = gameObjects;
    	this.smashables = gameObjects.smashables;
    	
    	this.conveyorDistance = 850;

    	this.score = 0;
    	this.engineLoopFrequency = 200;
    	this.cyclesSinceLast = 0;
    	this.smashablePlacementOdds = 0.25; //The odds of a smashable being placed in an engine cycle
    	this.randomIndices = new Array();
    	this.lastMinGap = 0;

    	this.gameStartTime = new Date();
    	this.gameStartTime = this.gameStartTime.getTime();

    	//Milliseconds it takes for an object to traverse the conveyor belt
    	this.conveyorSpeed = 2000;
    	this.conveyorSpeedIncrease = 100; 	  //Speed to increase the conveyor by
    	this.conveyorSpeedInterval = 10000;  //How often (in ms) the coveyor speed increases
    	this.conveyorLastIncreaseTime = this.gameStartTime; //The last time (in ms) speed increased

    	//An array of objects containing info on the current smashables on the conveyor
    	this.smashablesOnConveyor = new Array();

    	//Conveyor distance window within which Brad's tablet strikes the smashable
    	this.hitWindow = new Array();

    	///Initialize indicies used for selection of random indicies
    	this.placementIndexForRandom = 99;
    	this.smashableIndexForRandom = 0;

    	/* HOOKS */

    	Engine.on('click', function() {
		  _slap.call(this);
		}.bind(this));

    	/* END HOOKS */
        
    }

    GameEngine.prototype.constructor = GameEngine;

    //Set the default options
    GameEngine.DEFAULT_OPTIONS = {

    };


    /*--- END CONSTRUCTION ---*/


    /*--- PRIVATE METHODS ---*/

    function _mainLoop() {

    	if(this.placementIndexForRandom < 0)
    		this.placementIndexForRandom = 99;

    	if(this.smashableIndexForRandom > 99)
    		this.smashableIndexForRandom = 0;

    	this.cyclesSinceLast++;

    	var placementRandom = this.randomIndices[this.placementIndexForRandom],
    		smashableRandom = this.randomIndices[this.smashableIndexForRandom];

    	if(placementRandom > (this.smashablePlacementOdds * 100)) {

    		this.placementIndexForRandom--;
    		return;
    	}
    	else {

    		var durationSinceLast = this.engineLoopFrequency * this.cyclesSinceLast,
    			smashableType = this.smashables.randToType[smashableRandom];

    		if(durationSinceLast < this.lastMinGap){
    			return;
    		}

		    //Make a conveyor speed update call and return for speed increase
	    	if(_updateConveyorSpeed.call(this)) {
		    	return;
	    	}
	    	else {  //Otherwise update state and place the smashable
	    		this.placementIndexForRandom--;
	    		this.smashableIndexForRandom++;
	    		this.cyclesSinceLast = 0;

	    		this.lastMinGap = this.smashables.types[smashableType].minGapDuration;
	    		_placeSmashable.call(this, smashableType);
	    	}

    		
    	}
    }


    function _placeSmashable(type) {
    	
    	//If no surfaces are availible to send, return false
    	if(this.smashables.types[type].surfacesAvailable.length == 0) {
    		return false;
    	}
    	else { //Otherwise...

    		// Grab the index of the available smashable
    		var index = this.smashables.types[type].surfacesAvailable.pop();

    		// Calculate duration based off of conveyor speed, conveyor distance,
    		// and smashable width.
    		var duration = this.smashables.types[type].duration;

    		//Record the time (in milliseconds) the smashable was placed
    		//and its type 
    		var time = new Date();
    			time = time.getTime();

    		this.smashablesOnConveyor[time.toString()] = {type: type, placed: time, smashed: false};

	    	//Send the smashable down the conveyor, 
	    	this.smashables.types[type].modifierPool[index].setTransform(
				Transform.translate((this.conveyorDistance * -1), 330, 0),
			 	{ duration : duration },
			 	function() {

			 		//Remove the smashable from the conveyor list when
			 		//it reaches the end.
					delete this.smashablesOnConveyor[time.toString()];
				}.bind(this)
			);

			this.smashables.types[type].modifierPool[index].setTransform(
				Transform.translate(((130 + this.conveyorDistance) * -1), 500, 0),
				{ duration : 100, curve: Easing.inOutSine },
				function() {
					this.smashables.types[type].surfacePool[index].setProperties(
						{ zIndex: '-1' }
					);
				}.bind(this)
			);
			
			
			this.smashables.types[type].modifierPool[index].setTransform(
				Transform.rotateZ(0),
				{ duration : 0 }
			);
			
			this.smashables.types[type].modifierPool[index].setTransform(
				Transform.translate(this.smashables.types[type].size[0], 340, 0),
				{ duration : 1 },
				function() {
					this.smashables.types[type].surfacePool[index].setProperties(
						{ zIndex: '2' }
					);

					this.smashables.types[type].surfacesAvailable.push(index);
				}.bind(this)
			);

    	}
    }

  	function _slap() {

  		_detectHit.call(this)

  		this._gameObjects.bradsTabletModifier.setTransform(
				Transform.translate(-550, 260, 0),
			 	{ duration : 25 }
		);

		this._gameObjects.bradsTabletModifier.setTransform(
				Transform.translate(-550, 215, 0),
			 	{ duration : 25 }
		);

  	}

  	function _detectHit() {

  		//Get the current time in milliseconds
  		var time = new Date();
    		time = time.getTime();

    	//Loop through opjects on the conveyor and determine of they were hit
    	for(var key in this.smashablesOnConveyor) {

    		var smashableInfo = this.smashablesOnConveyor[key],
    		    timeElasped = time - smashableInfo.placed;

    		//If it wasn't already smashed...
    		if(!smashableInfo.smashed) {

	    		var position = this.smashables.getPositionFromElapsed(smashableInfo.type,
	    												   			  timeElasped,
	    												   			  this.conveyorDistance);
	    		
	    		//Test for three cases: 1. Is the trailing edge of the object in the window?
	    		//						2. Is the leading edge of the object in the window?
	    		//						3. Is the window within the object?
	    		//If any are true it's a hit!
	    		if((position[0] >= this.hitWindow[0]) && (position[0] <= this.hitWindow[1]) ||
	    		   (position[1] >= this.hitWindow[0]) && (position[1] <= this.hitWindow[1]) ||
	    		   (this.hitWindow[0] >= position[0]) && (this.hitWindow[1] <= position[1])) {

	    			//If the hit was on a smashable...
	    			if(this.smashables.types[smashableInfo.type].smashable) {
	    				
	    				//Increment the score
	    				this.score += 10;

	    				//Change the content of the score object
	    				this._gameObjects.score.setContent('Score: ' + this.score);

	    				//Set this smashable to smashed
	    				this.smashablesOnConveyor[key].smashed = true;
	    			}
	    			else
	    				console.log("You lose!");
	    			
	    		}

    		}

    	}
  	}

  	function _updateConveyorSpeed() {

  		//Increase the conveyor speed if required
    	var currentTime = new Date();
    	currentTime = currentTime.getTime();

    	//Clear the board and update the conveyor speed as needed by...
    	var timeSinceLast = currentTime - this.conveyorLastIncreaseTime;

    	console.log(this.conveyorSpeed);

    	//If a speed increase is necessary...
    	if(timeSinceLast > this.conveyorSpeedInterval) {

    		//Getting the current max duration for the smashables
	    	var maxDuration = this.smashables.getMaxDuration();

	    	//Clearing the board with a gap equal to the
		   	//current max duration before using the new speed
	    	this.lastMinGap = maxDuration + 200;

    		//Update the increase time
    		this.conveyorLastIncreaseTime = currentTime;
    		
    		//Add a hook to the engine to update the conveyor speed in the future
    		//when the conveyor is cleared
    		Timer.setTimeout(function() {

    			this.conveyorSpeed -= this.conveyorSpeedIncrease;

	    		//Re-calculate the durations for each smashable type
	    		this.smashables.calcDurations(this.conveyorDistance, this.conveyorSpeed);

		    	//Re-calculate the minimum gap durations for each smashable type
		    	this.smashables.calcMinGapDurations(this.conveyorDistance, this.conveyorSpeed, 50);

    		}.bind(this), (maxDuration + 200));
    		
    		return true;
    	}
    	else
    		return false;
  	}

    function _generateRandomIndices() {

    	for(var i = 0; i < 100; i++) {

    		this.randomIndices[i] = Math.floor((Math.random() * 100));
    	}
    }


    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/

    GameEngine.prototype.startGame = function() {

    	//Calculate the durations for each smashable type
    	this.smashables.calcDurations(this.conveyorDistance, this.conveyorSpeed);

    	//Calculate the minimum gap durations for each smashable type
    	this.smashables.calcMinGapDurations(this.conveyorDistance, this.conveyorSpeed, 50);

    	// Generate an array of 0-99 index to smashable type values to translate random draws
    	this.smashables.generateRandToTypeArray();

    	//Generate random number array
    	_generateRandomIndices.call(this);

    	//Calculate the distance window within which Brad's tablet strikes the smashable
    	this.hitWindow[1] = ((this._gameObjects.bradsLocation[0] * -1) + 99);
    	this.hitWindow[0] = ((this._gameObjects.bradsLocation[0] * -1));

    	console.log(this._gameObjects.bradsLocation[0]);

    	//Start the game loop
    	Timer.setInterval(_mainLoop.bind(this), this.engineLoopFrequency);

    }
    /*--- END PUBLIC METHODS --*/

    module.exports = GameEngine;
});