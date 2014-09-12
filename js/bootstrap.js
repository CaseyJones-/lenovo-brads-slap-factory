define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var GameView = require('GameView');

    var mainContext = Engine.createContext();
    var gameView = new GameView();

    mainContext.add(gameView);
});