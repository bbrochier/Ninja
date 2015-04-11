;(function() {

'use strict';


/* GAME CONSTRUCTOR
   ================================================================= */
var Game = function Game() {
  var canvas = document.getElementById('my-game');
  var screen = canvas.getContext('2d');
  var gameSize = { x: canvas.width, y: canvas.height };
  var _this = this;
  var i;

  // Create Players
  this.players = [];
  var playerOne = new Player(this, gameSize, gameSize.x - 8, { up: 38, down: 40, shoot: 37}, 'right');
  var playerTwo = new Player(this, gameSize, 8, { up: 87, down: 83, shoot: 68}, 'left');
  this.players = this.players.concat(playerOne, playerTwo);

  // Create Boxes
  this.boxes = [];
  for (i = 8; i < gameSize.y; i = i + 16) {
    this.boxes.push(new Box(this, gameSize, i));
  }

  // Weapons
  this.weapons = [];

  //Tick
  var tick = function tick() {
    _this.update();
    _this.draw(screen, gameSize);
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

  for (i = 0; i < this.weapons.length; i++) {
    this.weapons[i].update(this.weapons, i);
  }
};

Game.prototype.draw = function draw(screen, gameSize) {
  var i;

  // Clear canvas
  screen.clearRect(0, 0, gameSize.x, gameSize.y);

  // Draw players
  for (i = 0; i < this.players.length; i++) {
    drawRect(screen, this.players[i]);
  }

  // Draw boxes
  for (i = 0; i < this.boxes.length; i++) {
    drawRect(screen, this.boxes[i]);
  }

  // Draw weapons
  for (i = 0; i < this.weapons.length; i++) {
    drawRect(screen, this.weapons[i]);
  }
};

Game.prototype.addWeapon = function(weapon) {
  this.weapons.push(weapon);
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
};

Player.prototype.update = function update() {
  var weaponCenterX;

  // Move
  if (this.keyboarder.isDown(this.keys.down)) {
    if (this.center.y < this.gameSize.y - this.size.y / 2 - 3) {
      this.center.y += 4;
    }
  } else if (this.keyboarder.isDown(this.keys.up)) {
    if (this.center.y > 0 + this.size.y / 2 + 3) {
      this.center.y -= 4;
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
      this.game.addWeapon(weapon);
      this.armed = false;
    }
  }

};


/* BOX CONSTRUCTOR
   ================================================================= */

var Box = function Box(game, gameSize, centerY) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: gameSize.x / 2, y: centerY };
};

Box.prototype.update = function update() {};

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
var drawRect = function drawRect(screen, body) {
  screen.fillStyle = '#000000';
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);

  screen.strokeStyle = '#ffffff';
  screen.strokeRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);
};

  /* START GAME
     ================================================================= */
  window.addEventListener('load', function() {
    new Game();
  });


})();
