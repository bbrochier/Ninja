/* WEAPON CONSTRUCTOR
   ================================================================= */

var Weapon = function Weapon(player, center, side, gameSize) {
  this.center = center;
  this.gameSize = gameSize;
  this.size = { x: 10, y: 10 };
  this.side = side;
  this.speed = 6;
  this.player = player;
};

Weapon.prototype.update = function update(weapons, index) {
  if (this.side === 'right') {
    // Move weapon left
    if (this.center.x >= 0 + this.size.x / 2 + 3) {
      this.center.x -= this.speed;
    }

    // Actions when reached left side
    if (this.center.x <= 0 + this.size.x / 2 + 3) {
      this.player.armed = true;
      this.destroy(weapons, index);
    }
  }

  if (this.side === 'left') {
    // Move weapon right
    if (this.center.x <= this.gameSize.x - this.size.x / 2 - 3) {
      this.center.x += this.speed;
    }

    // Actions when reached right side
    if (this.center.x >= this.gameSize.x - this.size.x / 2 - 3) {
      this.player.armed = true;
      this.destroy(weapons, index);
    }
  }
};

Weapon.prototype.destroy = function destroy(weapons, index) {
  weapons.splice(index, 1);
};
