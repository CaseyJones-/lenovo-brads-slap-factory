define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var GridLayout = require("famous/views/GridLayout");
    var GameEngine = require("GameEngine");
    var Smashables = require("Smashables");

    /*-- 
        PUBLIC VARIABLE LIST
        

     --*/
    
    /*--- CONSTRUCTION ---*/

    //Prototype constructor
    function GameView() {

        //Call the upstream constructor with our 'this' pointer and arguments
        HeaderFooterLayout.apply(this, arguments);

        this.gameObjects = new Object();
        this.gameObjects.smashables = new Smashables();

        this.gameEngine = new GameEngine(this.gameObjects);

        this.options.headerSize = 60;

        this.contentWindowSize = _getContentWindowSize.call(this);

        _createHeader.call(this);
        _createGameWorld.call(this);
        _addSmashables.call(this);

        this.gameEngine.runConveyor();
    }

    //Extend the View prototype and assign our constructor
    GameView.prototype = Object.create(HeaderFooterLayout.prototype);
    GameView.prototype.constructor = GameView;

    //Set the default options
    GameView.DEFAULT_OPTIONS = {
        headerSize: 100,
        footerSize: 50
    };

    /*--- END CONSTRUCTION ---*/


    /*--- PRIVATE METHODS ---*/


    function _createHeader() {

        this.header.bar = new Surface({
          size: [undefined, 60],
          classes: ["header"]
        })

        this.header.gameTitle = new Surface({
          content: "Computer Slap",
          size: [true, true],
          classes: ["header"]
        });

        this.header.score = new Surface({
          content: ("Score: " + this.gameEngine.score),
          size: [true, true],
          classes: ["header"]
        });

        this.header.gameTitleModifier = new Modifier({
          origin: [0.5, 0.4]
        });

        this.header.scoreModifier = new Modifier({
          origin: [0.96, 0.4]
        });

        

        this.header.add(this.header.bar);
        this.header.add(this.header.gameTitleModifier).add(this.header.gameTitle);
        this.header.add(this.header.scoreModifier).add(this.header.score);
      
    }

    function _createGameWorld() {
        
        this.content.wall = new Surface({
          size: [undefined, (this.contentWindowSize[1] * 0.6)],
          classes: ["wall"]
        });

        this.content.floor = new Surface({
          size: [undefined, (this.contentWindowSize[1] * 0.4)],
          classes: ["floor"]
        })

        this.content.floorModifier = new Modifier({
          origin: [1, 1]
        });

        this.gameObjects.conveyor = new Surface({
          size: [880, 220],
          classes: ["conveyor"]
        });

        this.gameObjects.conveyorModifier = new Modifier({
          origin: [1, 0.8]
        });

        this.content.add(this.content.wall);
        this.content.add(this.content.floorModifier).add(this.content.floor);
        this.content.add(this.gameObjects.conveyorModifier).add(this.gameObjects.conveyor);
    }

    function _addSmashables() {

        for(var key in this.gameObjects.smashables.types) {

            for(var j = 0; j < this.gameObjects.smashables.types[key].initialPoolSize; j++) {

                //Initialize the StateModifiers
                this.gameObjects.smashables.types[key].modifierPool[j] = new StateModifier({
                  origin: [1, 0],
                  transform: Transform.translate(this.gameObjects.smashables.types[key].size[0], 340, 0)
                });

                this.content.add(this.gameObjects.smashables.types[key].modifierPool[j])
                            .add(this.gameObjects.smashables.types[key].surfacePool[j]);
            }
        }
    }

    function _getContentWindowSize() {

      return Array((window.innerWidth - this.options.headerSize), (window.innerHeight - this.options.headerSize));
    }




    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/


    /*--- END PUBLIC METHODS --*/

    module.exports = GameView;
});