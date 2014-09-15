define(function(require, exports, module) {

    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*-- 
        PUBLIC VARIABLE LIST
        

     --*/
    
    /*--- CONSTRUCTION ---*/

    //Prototype constructor
    function Smashables(gameObjects) {

    	this.types = {

            orangeLenovo: {
                size: [80, 87],
                smashable: false,
                initialPoolSize: 5,
                classes: ["smashables", "smashable-orange-lenovo"]
            },

            silverLenovo: {
                size: [80, 87],
                smashable: false,
                initialPoolSize: 5,
                classes: ["smashables", "smashable-silver-lenovo"]
            },

            fruitPc: {
                size: [110, 85],
                smashable: true,
                initialPoolSize: 5,
                classes: ["smashables", "smashable-fruit-pc"]
            },

            oldPc: {
                size: [110, 85],
                smashable: true,
                initialPoolSize: 5,
                classes: ["smashables", "smashable-old-pc"]
            },

            mattForte: {
                size: [400, 80],
                smashable: true,
                initialPoolSize: 2,
                classes: ["smashables", "smashable-matt-forte"]
            },

            andrewLuck: {
                size: [380, 80],
                smashable: true,
                initialPoolSize: 2,
                classes: ["smashables", "smashable-andrew-luck"]
            },

            watermelon: {
                size: [80, 85],
                smashable: true,
                initialPoolSize: 10,
                classes: ["smashables", "smashable-watermelon"]
            }

        }

        //Initialize the surfacePool for each type and add them to
        //surfacesAvailable

        for(var key in this.types) {

            this.types[key].surfacePool = new Array();
            this.types[key].modifierPool = new Array();
            this.types[key].surfacesAvailable = new Array();

            for(var j = 0; j < this.types[key].initialPoolSize; j++) {

                this.types[key].surfacePool[j] = new Surface({
                  size: this.types[key].size,
                  classes: this.types[key].classes
                });

                //Initialize the StateModifiers
                this.types[key].modifierPool[j] = new StateModifier({
                  origin: [1, 0],
                  transform: Transform.translate(this.types[key].size[0], 340, 0)
                });

                this.types[key].surfacesAvailable[j] = j;
            }
        }
    }

    Smashables.prototype.constructor = Smashables;


    /*--- END CONSTRUCTION ---*/


    /*--- PRIVATE METHODS ---*/


    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/


    /*--- END PUBLIC METHODS --*/

    module.exports = Smashables;
});