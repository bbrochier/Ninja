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
  var playerOne = new Player(this, gameSize, gameSize.x - 8, { up: 38, down: 40, shoot: 37});
  var playerTwo = new Player(this, gameSize, 8, { up: 87, down: 83, shoot: 68});
  this.players = this.players.concat(playerOne, playerTwo);

  // Create Boxes
  this.boxes = [];
  for (i = 8; i < gameSize.y; i = i + 16) {
    this.boxes.push(new Box(this, gameSize, i));
  }

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

  // Call update on every body
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].update();
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
};


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


/* BOX CONSTRUCTOR
   ================================================================= */

var Box = function Box(game, gameSize, centerY) {
  this.game = game;
  this.gameSize = gameSize;
  this.size = { x: 16, y: 16 };
  this.center = { x: gameSize.x / 2, y: centerY };
};

Box.prototype.update = function update() {};


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

  // Handy constants that give keyCodes human-readable names.
  this.KEYS = { LEFT: 37, UP: 38, DOWN: 40, W: 87, S: 83, D: 68 };
};

/* DRAWING
   ================================================================= */

// **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
var drawRect = function drawRect(screen, body) {
  screen.fillStyle = '#ff00ff';
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);

  screen.strokeStyle = '#00ff00';
  screen.strokeRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);
};

  /* START GAME
     ================================================================= */
  window.addEventListener('load', function() {
    new Game();
  });


})();
