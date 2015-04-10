
/* BOX CONSTRUCTOR
   ================================================================= */

var Box = function Box(game, gameSize, centerY) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: gameSize.x / 2, y: centerY };
};

Box.prototype.update = function update() {};
