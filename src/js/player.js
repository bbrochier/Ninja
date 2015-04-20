
/* PLAYER CONSTRUCTOR
   ================================================================= */

var Player = function Player(game, gameSize, centerX, keys, side) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: centerX, y: gameSize.y / 2 };
  this.keyboarder = new Keyboarder();
  this.keys = keys;
  this.side = side;
  this.armed = true;
  this.speed = 6;
  this.score = 0;
};

Player.prototype.update = function update() {
  var weaponCenterX;

  // Move
  if (this.keyboarder.isDown(this.keys.down)) {
    if (this.center.y < this.gameSize.y - this.size.y / 2 - 3) {
      this.center.y += this.speed;
    }
  } else if (this.keyboarder.isDown(this.keys.up)) {
    if (this.center.y > 0 + this.size.y / 2 + 3) {
      this.center.y -= this.speed;
    }
  }

  // Shoot
  if (this.keyboarder.isDown(this.keys.shoot)) {

    if (this.side === 'right') {
      weaponCenterX = this.center.x - this.size.x - 4;
    }

    if (this.side === 'left') {
      weaponCenterX = this.center.x + this.size.x + 4;
    }

    if (this.armed === true) {
      var weapon = new Weapon(this, { x: weaponCenterX, y: this.center.y }, this.side, this.gameSize);
      this.game.addWeapon(weapon, this.side);
      this.armed = false;
    }
  }

};
