
/* PLAYER CONSTRUCTOR
   ================================================================= */

var Player = function Player(game, gameSize, centerX, keys) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: centerX, y: gameSize.y / 2 };
  this.keyboarder = new Keyboarder();
  this.keys = keys;
};

Player.prototype.update = function update() {
  if (this.keyboarder.isDown(this.keys.down)) {
    if (this.center.y < this.gameSize.y - this.size.y / 2 - 3) {
      this.center.y += 4;
    }
  } else if (this.keyboarder.isDown(this.keys.up)) {
    if (this.center.y > 0 + this.size.y / 2 + 3) {
      this.center.y -= 4;
    }
  }
};
