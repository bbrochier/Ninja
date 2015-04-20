/* WEAPON CONSTRUCTOR
   ================================================================= */

var Weapon = function Weapon(player, center, side, gameSize) {
  this.center = center;
  this.gameSize = gameSize;
  this.size = { x: 4, y: 4 };
  this.side = side;
  this.speed = 8;
  this.player = player;
};

Weapon.prototype.update = function update(weapons, index, boxes) {
  var i;

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

    // Action when collite with boxes
    for (i = 0; i < boxes.length; i++) {
      var coliteBoxesRight = colliding(this, boxes[i]);
      if (coliteBoxesRight) {
        if (boxes[i].movable === true) {
          boxes[i].center.x -= 16;
          if (boxes[i].center.x <= (5 * (boxes[i].size.x / 2))) {
            boxes[i].movable = false;
            boxes[i].succeed = true;
          }
        }

        this.player.armed = true;
        this.destroy(weapons, index);
      }
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

    // Action when collite with boxes
    for (i = 0; i < boxes.length; i++) {
      var coliteBoxesLeft = colliding(this, boxes[i]);
      if (coliteBoxesLeft) {
        if (boxes[i].movable === true) {
          boxes[i].center.x += 16;
          if (boxes[i].center.x >= this.gameSize.x - (5 * (boxes[i].size.x / 2))) {
            boxes[i].movable = false;
            boxes[i].succeed = true;
          }
        }

        this.player.armed = true;
        this.destroy(weapons, index);
      }
    }
  }
};

Weapon.prototype.destroy = function destroy(weapons, index) {
  weapons.splice(index, 1);
};
