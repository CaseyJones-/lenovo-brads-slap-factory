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
                placementOdds: .2,
                classes: ["smashables", "smashable-orange-lenovo"]
            },

            silverLenovo: {
                size: [80, 87],
                smashable: false,
                initialPoolSize: 5,
                placementOdds: .2,
                classes: ["smashables", "smashable-silver-lenovo"]
            },

            fruitPc: {
                size: [110, 85],
                smashable: true,
                initialPoolSize: 5,
                placementOdds: .28,
                classes: ["smashables", "smashable-fruit-pc"]
            },

            oldPc: {
                size: [110, 85],
                smashable: true,
                initialPoolSize: 5,
                placementOdds: .28,
                classes: ["smashables", "smashable-old-pc"]
            },

            mattForte: {
                size: [400, 80],
                smashable: true,
                initialPoolSize: 2,
                placementOdds: .02,
                classes: ["smashables", "smashable-matt-forte"]
            },

            andrewLuck: {
                size: [380, 80],
                smashable: true,
                initialPoolSize: 2,
                placementOdds: .02,
                classes: ["smashables", "smashable-andrew-luck"]
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

                this.types[key].surfacesAvailable.push(j);
            }
        }
    }

    Smashables.prototype.constructor = Smashables;


    /*--- END CONSTRUCTION ---*/


    /*--- PRIVATE METHODS ---*/


    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/

    Smashables.prototype.calcDurations = function(conveyorDistance, conveyorSpeed) {

        for(var key in this.types) {

            var duration = conveyorDistance / conveyorSpeed;
                duration = ((this.types[key].size[0] - 1) / duration);
                duration = Math.round(conveyorSpeed + duration);

            this.types[key].duration = duration;
        }
    }

    Smashables.prototype.calcMinGapDurations = function(conveyorDistance, conveyorSpeed, minPixelGap) {

        for(var key in this.types) {

            var distanceSpeedRatio = conveyorDistance / conveyorSpeed;
            
            var minGapDuration = this.types[key].size[0] / distanceSpeedRatio;
                minGapDuration += minPixelGap / distanceSpeedRatio;

            this.types[key].minGapDuration = Math.round(minGapDuration);
        }
    }

    Smashables.prototype.getPositionFromElapsed = function(type, elapsed, conveyorDistance) {

        var position = new Array();

        position[0] = ((conveyorDistance + this.types[type].size[0]) / this.types[type].duration);
        position[0] = (position[0] * elapsed) - this.types[type].size[0];

        position[1] = position[0] + this.types[type].size[0];

        return position;
    }

    Smashables.prototype.generateRandToTypeArray = function() {

        this.randToType = new Array();
        var indexSum = 0;

        for(var key in this.types) {

            var maxIndex = this.types[key].placementOdds * 100;

            for(var i = indexSum; i < (maxIndex + indexSum); i++) {

                this.randToType[i] = key;
            }

            indexSum += this.types[key].placementOdds * 100;
        }    
    }


    /*--- END PUBLIC METHODS --*/

    module.exports = Smashables;
});