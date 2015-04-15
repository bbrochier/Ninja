
/* BONUS CONSTRUCTOR
   ================================================================= */

var Bonus = function Bonus(game, gameSize, type) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: gameSize.x / 2, y: centerY };
  this.type = type;
};

Bonus.prototype.update = function update() {};
