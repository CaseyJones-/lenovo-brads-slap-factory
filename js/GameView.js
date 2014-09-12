define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var GridLayout = require("famous/views/GridLayout");

    /*-- 
        PUBLIC VARIABLE LIST
        

     --*/
    
    /*--- CONSTRUCTION ---*/

    //Prototype constructor
    function GameView() {

        //Call the upstream constructor with our 'this' pointer and arguments
        HeaderFooterLayout.apply(this, arguments);

        this.options.headerSize = 60;

        _createHeader.call(this);

        console.log(this);
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
      this.header.add(new Surface({
        content: "Header",
        classes: ["header"],
        properties: {
          lineHeight: "100px",
          textAlign: "center"
        }
      }));
    }

    function _createContent() {
      layout.content.add(createGrid( 'content', [1, 2] ));
    }

    function createGrid( section, dimensions ) {
      var grid = new GridLayout({
        dimensions: dimensions
      });
      
      var surfaces = [];
      grid.sequenceFrom(surfaces);
      
      for(var i = 0; i < dimensions[0]; i++) {
        surfaces.push(new Surface({
          content: section + ' ' + (i + 1),
          size: [undefined, undefined],
          properties: {
            backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
            color: "#404040",
            textAlign: 'center'
          }
        }));
      }
      
      return grid;
    }




    /*--- END PRIVATE METHODS ---*/


    /*--- PUBLIC METHODS ---*/


    /*--- END PUBLIC METHODS --*/

    module.exports = GameView;
});