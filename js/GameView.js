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

        this.options.headerSize = 60;

        this.contentWindowSize = _getContentWindowSize.call(this);
        _calcLocations.call(this);

        this.gameObjects.smashables = new Smashables(this.gameObjects);
        this.gameEngine = new GameEngine(this.gameObjects);

        _createHeader.call(this);
        _createGameWorld.call(this);
        _addGameStartScreen.call(this);
        _addGameoverScreen.call(this);
        _addSmashables.call(this);
        _addBrad.call(this);

        
        //Remove start screen and start the game when
        //the start screen is clicked
        this.gameObjects.startScreen.on('click', function() {
          
          this.gameObjects.startScreen.setProperties({
            zIndex: '-4' 
          });
          
          this.gameEngine.startGame();
        }.bind(this));

        //Reveal the start screen when the game over screen is clicked  
        this.gameObjects.gameoverScreen.on('click', function() {
          
          this.gameObjects.gameoverScreen.setProperties({
            zIndex: '-4' 
          });

          this.gameObjects.startScreen.setProperties({
            zIndex: '4'
          });
        }.bind(this));
        
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

    function _calcLocations() {

        var conveyorLocation = new Array(),
            bradsLocation = new Array(),
            smashablesLocation = new Array();


        //If the window isn't wide enough, scoot the conveyor to the right
        if(this.contentWindowSize[0] < 880) {
          conveyorLocation[0] = 880 - this.contentWindowSize[0];

          smashablesLocation[0] = 1;  //Set this to 1 to denote the shift

          //Set the header game title
          this.header.titleText = 'Brad\'s SF'; 
        }
        else {  //Otherwise start at zero
          smashablesLocation[0] = 0;
          conveyorLocation[0] = 0;

          //Set the header game title
          this.header.titleText = 'Brad\'s Slap Factory'; 
        }

        //Calculate conveyor Y placement based on screen size
        conveyorLocation[1] = this.contentWindowSize[1] * 0.5;

        //Calculate Brad's location
        bradsLocation[1] = conveyorLocation[1] - 250;
        bradsLocation[0] = Math.round((880 - conveyorLocation[0]) * 0.666) * -1; 

        //The tablet Y offset is static
        this.gameObjects.bradsTabletYOffset = 115;

        //Copy to object vars
        this.gameObjects.conveyorLocation = conveyorLocation;
        this.gameObjects.bradsLocation = bradsLocation;
        this.gameObjects.smashablesLocation = smashablesLocation;
    }


    function _createHeader() {

        this.header.bar = new Surface({
          size: [undefined, 60],
          classes: ["header"]
        })

        this.header.gameTitle = new Surface({
          content: this.header.titleText,
          size: [true, true],
          classes: ["header"]
        });

        this.header.score = new Surface({
          content: ("0"),
          size: [true, true],
          classes: ["header"]
        });

        //Grab a reference to the score surface and put it in
        //gameObjects so it can be changed later.
        this.gameObjects.score = this.header.score;

        this.header.gameTitleModifier = new Modifier({
          origin: [0.05, 0.4]
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
          origin: [1, 0],
          transform : Transform.translate(this.gameObjects.conveyorLocation[0], this.gameObjects.conveyorLocation[1], 0)
        });



        this.content.add(this.content.wall);
        this.content.add(this.content.floorModifier).add(this.content.floor);
        this.content.add(this.gameObjects.conveyorModifier).add(this.gameObjects.conveyor);
    }

    function _addSmashables() {

        for(var key in this.gameObjects.smashables.types) {

            for(var j = 0; j < this.gameObjects.smashables.types[key].initialPoolSize; j++) {

                this.content.add(this.gameObjects.smashables.types[key].modifierPool[j])
                            .add(this.gameObjects.smashables.types[key].surfacePool[j]);
            }
        }
    }

    function _addBrad() {

      var bradsLocation = this.gameObjects.bradsLocation,
          bradsTabletYOffset = this.gameObjects.bradsTabletYOffset;

      this.gameObjects.bradsLocation = bradsLocation;

      this.gameObjects.bradModifier = new Modifier({
        origin: [1, 0],
        transform : Transform.translate(bradsLocation[0], bradsLocation[1], 0)
      });

      this.gameObjects.brad = new Surface({
        size: [101, 400],
        classes: ["brad"]
      })

      this.gameObjects.bradsTabletModifier = new Modifier({
        origin: [1, 0],
        transform : Transform.translate(bradsLocation[0], (bradsLocation[1] + bradsTabletYOffset), 0)
      });

      this.gameObjects.bradsTablet = new Surface({
        size: [101, 83],
        classes: ["brads-tablet"]
      })

      this.content.add(this.gameObjects.bradModifier).add(this.gameObjects.brad);
      this.content.add(this.gameObjects.bradsTabletModifier).add(this.gameObjects.bradsTablet);

    }

    function _addGameStartScreen() {

      //Set the size and position based on the browser window size
      var xSize = this.contentWindowSize[0] * 0.8,
          ySize = this.contentWindowSize[1] * 0.8,
          xDiff = this.contentWindowSize[0] * 0.1,
          yDiff = this.contentWindowSize[1] * 0.1;

      this.gameObjects.startScreenModifier = new Modifier({
        origin: [0, 0],
        transform : Transform.translate(xDiff, yDiff, 0)
      });

      var content = 'Slap all the old PCs and Macs by clicking or tapping.';
          content += '<br /> <br /> CLICK OR TAP TO START THE GAME!';

      this.gameObjects.startScreen = new Surface({
        content: content,
        size: [xSize, ySize],
        classes: ["start-screen"]
      });

      this.content.add(this.gameObjects.startScreenModifier).add(this.gameObjects.startScreen);

    }

    function _addGameoverScreen() {

      //Set the size and position based on the browser window size
      var xSize = this.contentWindowSize[0] * 0.8,
          ySize = this.contentWindowSize[1] * 0.8,
          xDiff = this.contentWindowSize[0] * 0.1,
          yDiff = this.contentWindowSize[1] * 0.1;

      this.gameObjects.gameoverScreenModifier = new Modifier({
        origin: [0, 0],
        transform : Transform.translate(xDiff, yDiff, 0)
      });

      this.gameObjects.gameoverScreen = new Surface({
        content: "GAME OVER! <br /> Score: <br />",
        size: [xSize, ySize],
        classes: ["gameover-screen"]
      });

      this.content.add(this.gameObjects.gameoverScreenModifier).add(this.gameObjects.gameoverScreen);
      
    }

    function _getContentWindowSize() {

      return Array((window.innerWidth), (window.innerHeight - this.options.headerSize));
    }




    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/


    /*--- END PUBLIC METHODS --*/

    module.exports = GameView;
});