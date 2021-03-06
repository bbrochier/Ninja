
/* BOX CONSTRUCTOR
   ================================================================= */

var Box = function Box(game, gameSize, centerY, type, movable) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: gameSize.x / 2, y: centerY };
  this.type = type;
  this.movable = movable;
  this.succeed = false;
};

Box.prototype.update = function update() {};
