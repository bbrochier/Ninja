
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
