define(function(require, exports, module) {

	var Transform = require('famous/core/Transform');
	var Easing = require('famous/transitions/Easing');
	var Timer = require('famous/utilities/Timer');

    /*-- 
        PUBLIC VARIABLE LIST
        

     --*/
    
    /*--- CONSTRUCTION ---*/

    //Prototype constructor
    function GameEngine(gameObjects) {

    	this.gameObjects = gameObjects;
    	this.score = 0;

    	//Milliseconds it takes for an object to traverse the conveyor belt
    	this.conveyorSpeed = 2000;
        
    }

    GameEngine.prototype.constructor = GameEngine;

    //Set the default options
    GameEngine.DEFAULT_OPTIONS = {

    };


    /*--- END CONSTRUCTION ---*/


    /*--- PRIVATE METHODS ---*/

    function _placeSmashableToo(smashableType) {
    	
    }

    function _placeSmashable(smashableNum) {

    	delete this.gameObjects.smashables.types.orangeLenovo.surfacesAvailable[smashableNum];

    	this.gameObjects.smashables.types.orangeLenovo.modifierPool[smashableNum].setTransform(
			Transform.translate(-850, 330, 0),
		 	{ duration : this.conveyorSpeed }
		);

		this.gameObjects.smashables.types.orangeLenovo.modifierPool[smashableNum].setTransform(
			Transform.translate(-980, 500, 0),
			{ duration : 100, curve: Easing.inOutSine },
			function() {
				this.gameObjects.smashables.types.orangeLenovo.surfacePool[smashableNum].setProperties(
					{ zIndex: '-1' }
				);
			}.bind(this)
		);
		
		
		this.gameObjects.smashables.types.orangeLenovo.modifierPool[smashableNum].setTransform(
			Transform.rotateZ(0),
			{ duration : 0 }
		);
		
		this.gameObjects.smashables.types.orangeLenovo.modifierPool[smashableNum].setTransform(
			Transform.translate(this.gameObjects.smashables.types.orangeLenovo.size[0], 340, 0),
			{ duration : 1 },
			function() {
				this.gameObjects.smashables.types.orangeLenovo.surfacePool[smashableNum].setProperties(
					{ zIndex: '1' }
				);

				this.gameObjects.smashables.types.orangeLenovo.surfacesAvailable[smashableNum] = smashableNum;
			}.bind(this)
		);

    }


    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/

    GameEngine.prototype.runConveyor = function() {

    	_placeSmashable.call(this, 0);

		Timer.setTimeout(_placeSmashable.bind(this, 1), 400);

		Timer.setTimeout(_placeSmashable.bind(this, 1), 800);


    }
    /*--- END PUBLIC METHODS --*/

    module.exports = GameEngine;
});