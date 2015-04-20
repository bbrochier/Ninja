
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
  this.players[0].score = 0;
  this.players[1].score = 0;

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

  // Score calculation & display
  for (i = 0; i < this.boxes.length; i++) {
    if (this.boxes[i].center.x > (gameSize.x / 2)) {
      this.players[0].score = this.players[0].score + (this.boxes[i].center.x - (gameSize.x / 2)) / this.boxes[i].size.x;
      document.getElementById('scoreLeft').innerHTML = (this.players[0].score) * 100;
    }

    if (this.boxes[i].center.x < (gameSize.x / 2)) {
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
