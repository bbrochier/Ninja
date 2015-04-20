;(function() {

'use strict';


/* GAME CONSTRUCTOR
   ================================================================= */
var Game = function Game() {
  var canvas = document.getElementById('my-game');
  var screen = canvas.getContext('2d');
  var gameSize = { x: canvas.width, y: canvas.height };
  var _this = this;
  var j = 0;
  var i;

  // Timer
  this.gameTime = 90; /* seconds */
  this.startTime = new Date().getTime();
  this.currentTime = this.startTime;
  this.remainTime = (this.gameTime * 1000);
  this.endTime = this.startTime + (this.gameTime * 1000);

  // Create Players
  this.players = [];
  var playerOne = new Player(this, gameSize, gameSize.x - 8, { up: 38, down: 40, shoot: 37}, 'right');
  var playerTwo = new Player(this, gameSize, 8, { up: 87, down: 83, shoot: 68}, 'left');
  this.players = this.players.concat(playerOne, playerTwo);

  // Create Boxes
  this.boxes = [];
  for (i = 8; i < gameSize.y; i = i + 16) {
    if (j === 0) {
      this.boxes.push(new Box(this, gameSize, i, 'rock', false));
      j = 8;
    } else {
      this.boxes.push(new Box(this, gameSize, i, 'bomb', true));
    }

    j--;
  }

  // Weapons
  this.weaponsRight = [];
  this.weaponsLeft = [];

  //Tick
  var tick = function tick() {
    _this.update();
    _this.draw(screen, gameSize);
    _this.updateScore(gameSize);

    requestAnimationFrame(tick);
  };

  tick();
};

Game.prototype.update = function update() {
  var _this = this;
  var i;

  // Call update on every body
  for (i = 0; i < this.players.length; i++) {
    this.players[i].update();
  }

  for (i = 0; i < this.weaponsRight.length; i++) {
    this.weaponsRight[i].update(this.weaponsRight, i, this.boxes);
  }

  for (i = 0; i < this.weaponsLeft.length; i++) {
    this.weaponsLeft[i].update(this.weaponsLeft, i, this.boxes);
  }

  // UpdateTime
  this.currentTime = new Date().getTime();
  if (this.remainTime > 0) {
    this.remainTime = this.endTime - this.currentTime;
  }

  document.getElementById('timer').innerHTML = Math.round(this.remainTime / 1000);

};

Game.prototype.updateScore = function updateScore(gameSize) {
  var i;
  this.players[0].score = 0;
  this.players[1].score = 0;

  // Score calculation & display
  for (i = 0; i < this.boxes.length; i++) {
    if (this.boxes[i].center.x >= (gameSize.x / 2)) {
      this.players[0].score = this.players[0].score + (this.boxes[i].center.x - (gameSize.x / 2)) / this.boxes[i].size.x;
      document.getElementById('scoreLeft').innerHTML = (this.players[0].score) * 100;
    }

    if (this.boxes[i].center.x <= (gameSize.x / 2)) {
      this.players[1].score = this.players[1].score + ((gameSize.x / 2) - this.boxes[i].center.x) / this.boxes[i].size.x;
      document.getElementById('scoreRight').innerHTML = (this.players[1].score) * 100;
    }
  }
};

Game.prototype.draw = function draw(screen, gameSize) {
  var i;

  // Clear canvas
  screen.clearRect(0, 0, gameSize.x, gameSize.y);

  // Draw players
  for (i = 0; i < this.players.length; i++) {
    drawRect(screen, this.players[i], '#a5866f');
  }

  // Draw boxes
  for (i = 0; i < this.boxes.length; i++) {
    if (this.boxes[i].type === 'bomb') {
      drawRect(screen, this.boxes[i], '#2ea583');
    }

    if (this.boxes[i].type === 'rock') {
      drawRect(screen, this.boxes[i], '#f23030');
    }

    if (this.boxes[i].succeed === true) {
      drawRect(screen, this.boxes[i], '#ffff00');
    }
  }

  // Draw weapons
  for (i = 0; i < this.weaponsRight.length; i++) {
    drawRect(screen, this.weaponsRight[i], '#ffff00');
  }

  for (i = 0; i < this.weaponsLeft.length; i++) {
    drawRect(screen, this.weaponsLeft[i], '#ffff00');
  }
};

Game.prototype.addWeapon = function(weapon, side) {
  if (side === 'right') {
    this.weaponsRight.push(weapon);
  }

  if (side === 'left') {
    this.weaponsLeft.push(weapon);
  }
};


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


/* KEYBOARDER CONSTRUCTOR
   ================================================================= */

// **new Keyboarder()** creates a new keyboard input tracking object.
var Keyboarder = function Keyboarder() {

  // Records up/down state of each key that has ever been pressed.
  var keyState = {};

  // When key goes down, record that it is down.
  window.addEventListener('keydown', function(e) {
    keyState[e.keyCode] = true;
  });

  // When key goes up, record that it is up.
  window.addEventListener('keyup', function(e) {
    keyState[e.keyCode] = false;
  });

  // Returns true if passed key is currently down.  `keyCode` is a
  // unique number that represents a particular key on the keyboard.
  this.isDown = function isDown(keyCode) {
    return keyState[keyCode] === true;
  };

  this.isUp = function isUp(keyCode) {
    return keyState[keyCode] === false;
  };

  // Handy constants that give keyCodes human-readable names.
  this.KEYS = { LEFT: 37, UP: 38, DOWN: 40, W: 87, S: 83, D: 68 };
};

/* DRAWING
   ================================================================= */

// **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
var drawRect = function drawRect(screen, body, color) {
  screen.fillStyle = color;
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);

  // screen.strokeStyle = color;
  // screen.lineWidth = 1;
  // screen.strokeRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
  //                 body.size.x, body.size.y);
};

/* COLLISION
   ================================================================= */

// **colliding()** returns true if two passed bodies are colliding.
// The approach is to test for five situations.  If any are true,
// the bodies are definitely not colliding.  If none of them
// are true, the bodies are colliding.
// 1. b1 is the same body as b2.
// 2. Right of `b1` is to the left of the left of `b2`.
// 3. Bottom of `b1` is above the top of `b2`.
// 4. Left of `b1` is to the right of the right of `b2`.
// 5. Top of `b1` is below the bottom of `b2`.

var colliding = function(b1, b2) {
  return !(
    b1 === b2 ||
      b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
      b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
      b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
      b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
  );
};

  /* START GAME
     ================================================================= */
  window.addEventListener('load', function() {
    new Game();
  });


})();
