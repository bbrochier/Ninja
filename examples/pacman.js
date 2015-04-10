'use strict';

;(function() {

  /* GAME
     ================================================================= */
  var Game = function() {
    var canvas = document.getElementById('my-game');
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    // Score
    this.score = 0;

    // Bodies
    this.bodies = [];
    this.bodies = createMap(this, gameSize);
    var self = this;

    //Tick
    var tick = function() {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(tick);
    };

    tick();

  };

  Game.prototype = {
    update: function() {
      // Colision with pills
      for (var i = 0; i < this.bodies.pills.length; i++) {
        var colitePills = colliding(this.bodies.player[0], this.bodies.pills[i]);
        if (colitePills){
          this.bodies.pills.splice(i,1);
          this.score += 1;
        }
      }

      // Colision with superPills
      for (var i = 0; i < this.bodies.superPills.length; i++) {
        var coliteSuperPills = colliding(this.bodies.player[0], this.bodies.superPills[i]);
        if (coliteSuperPills){
          this.bodies.superPills.splice(i,1);
          for (var i = 0; i < this.bodies.ghosts.length; i++) {
            this.bodies.ghosts[i].mode = 'fear';
          }
        }
      }

      // Colision with ghost
      for (var i = 0; i < this.bodies.ghosts.length; i++) {
        var coliteghosts = colliding(this.bodies.player[0], this.bodies.ghosts[i]);
        if (coliteghosts){
          if (this.bodies.ghosts[i].mode == 'fear'){
            this.bodies.ghosts[i].mode = 'dead';
          }
        }
      }

      // Call update on every body.
      for (var i = 0; i < this.bodies.walls.length; i++) {
        this.bodies.walls[i].update(this.bodies);
      }
      // Call update on player.
      this.bodies.player[0].update(this.bodies);
    },

    draw: function(screen, gameSize) {
      //clear board
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      //draw walls
      for (var i = 0; i < this.bodies.walls.length; i++) {
        drawRect(screen, this.bodies.walls[i]);
      }
      //draw pills
      for (var i = 0; i < this.bodies.pills.length; i++) {
        drawPills(screen, this.bodies.pills[i]);
      }
      //draw superPills
      for (var i = 0; i < this.bodies.superPills.length; i++) {
        drawPills(screen, this.bodies.superPills[i]);
      }
      //draw player
      for (var i = 0; i < this.bodies.player.length; i++) {
        drawPacman(screen, this.bodies.player[i], this.bodies.player[i].direction.currentDir);
      }
      //draw ghost
      for (var i = 0; i < this.bodies.ghosts.length; i++) {
        drawGhosts(screen, this.bodies.ghosts[i]);
      }
    }
  };


  /* PLAYER
     ================================================================= */
  var Player = function(game, center, gameSize) {
    this.game = game;
    this.gameSize = gameSize;
    this.size = { x: 14, y: 14};
    this.center = { x: center.x + this.size.x/2, y: center.y + this.size.y/2 };
    this.color = '#fff848';
    this.mouth = { maxSize: 0.3, minSize: 0, currentSize: 0, speed: 0.02, isClosing: true };
    this.direction = { currentDir: '', nextDir: '' };
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    update: function(bodies) {

      // SET NEXT DIRECTION
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        if (this.direction.currentDir === '') {
          this.direction.currentDir = 'left';
          this.direction.nextDir = 'left';
        } else {
          this.direction.nextDir = 'left';
        }
      }
      if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        if (this.direction.currentDir === '') {
          this.direction.currentDir = 'right';
          this.direction.nextDir = 'right';
        } else {
          this.direction.nextDir = 'right';
        }
      }
      if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
        if (this.direction.currentDir === '') {
          this.direction.currentDir = 'up';
          this.direction.nextDir = 'up';
        } else {
          this.direction.nextDir = 'up';
        }
      }
      if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
        if (this.direction.currentDir === '') {
          this.direction.currentDir = 'down';
        } else {
          this.direction.nextDir = 'down';
        }
      }


      function moveForward(pm) {
        if (pm.direction.currentDir === 'left') {
          if (pm.center.x >= pm.size.x/2){
            pm.center.x -= 1;
          } else {
            pm.center.x = pm.gameSize.x;
          }
        }
        if (pm.direction.currentDir === 'right') {
          if (pm.center.x <= pm.gameSize.x - pm.size.x/2){
            pm.center.x += 1;
          } else {
            pm.center.x = 0;
          }
        }
        if (pm.direction.currentDir === 'up') {
          pm.center.y -= 1;
        }
        if (pm.direction.currentDir === 'down') {
          pm.center.y += 1;
        }
      }


      if(this.direction.nextDir !== this.direction.currentDir){
        // GO NEXT DIR
        if (this.direction.nextDir === 'left') {
          if (this.center.x >= this.size.x/2){
            this.center.x -= 1;
          } else {
            this.center.x = this.gameSize.x;
          }
        }
        if (this.direction.nextDir === 'right') {
          if (this.center.x <= this.gameSize.x - this.size.x/2){
            this.center.x += 1;
          } else {
            this.center.x = 0;
          }
        }
        if (this.direction.nextDir === 'up') {
          this.center.y -= 1;
        }
        if (this.direction.nextDir === 'down') {
          this.center.y += 1;
        }

        // TEST COLLISION NEXT DIR
        for (var i = 0; i < bodies.walls.length; i++) {
          var testcoliteWall = colliding(bodies.player[0], bodies.walls[i]);
          if (testcoliteWall){
            if (this.direction.nextDir === 'left') {
              this.center.x += 1;
            } else if (this.direction.nextDir === 'right') {
              this.center.x -= 1;
            } else if (this.direction.nextDir === 'up') {
              this.center.y += 1;
            }  else if (this.direction.nextDir === 'down') {
              this.center.y -= 1;
            }
            moveForward(this);
          } else {
            this.direction.currentDir = this.direction.nextDir;
            this.direction.nextDir = '';
          }
        }

      } else {
        moveForward(this);
      }


      //COLLISION
      for (var i = 0; i < bodies.walls.length; i++) {
        var coliteWall = colliding(bodies.player[0], bodies.walls[i]);
        if (coliteWall){
          if (this.direction.currentDir === 'left') {
            this.center.x += 1;
          } else if (this.direction.currentDir === 'right') {
            this.center.x -= 1;
          } else if (this.direction.currentDir === 'up') {
            this.center.y += 1;
          }  else if (this.direction.currentDir === 'down') {
            this.center.y -= 1;
          }
        }
      }

    }
  };


  /* GHOST
     ================================================================= */
  var Ghost =  function(game, center) {
    this.game = game;
    this.size = { x: 14, y: 14 };
    this.color = '#ff00ff';
    this.eyes = { minPos: 3, maxPos: 5, currentPos: 3, speed: 0.02, isGlancing: true };
    this.center = { x: center.x + this.size.x/2, y: center.y + this.size.y/2 };
    this.mode = 'normal'; // fear / normal / dead
  };

  Ghost.prototype = {
    update: function() {

    }
  };



  /* WALLS
     ================================================================= */
  var Wall =  function(game, center) {
    this.game = game;
    this.size = { x: 14, y: 14 };
    this.color = '#004bbe';
    this.center = { x: center.x + this.size.x/2, y: center.y + this.size.y/2 };
  };

  Wall.prototype = {
    update: function() {

    }
  };


  /* PILLS
    ================================================================= */
  var Pill =  function(game, center) {
    this.game = game;
    this.size = { x: 3, y: 3 };
    this.color = '#ffffff';
    this.center = { x: center.x + 15/2, y: center.y + 15/2 };
  };

  Pill.prototype = {
    update: function() {

    }
  };


  /* SUPER PILLS
    ================================================================= */
  var SuperPill =  function(game, center) {
    this.game = game;
    this.size = { x: 5, y: 5 };
    this.color = '#ffffff';
    this.center = { x: center.x + 15/2, y: center.y + 15/2 };
  };

  SuperPill.prototype = {
    update: function() {

    }
  };



  /* MAP
    ================================================================= */
  var createMap = function(game, gameSize) {
    var mapElements = {},
        pills = [],
        superPills = [],
        walls = [],
        player = [],
        ghosts = [];

    /* Legend
       0: Walls
       1: Pills
       2: Super pills
       3: Pacman
       4: Ghost
       5: Empty
    */

    var map =  [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,0],
      [0,1,0,1,1,1,0,0,1,1,0,0,1,1,1,0,1,0],
      [0,1,0,0,1,0,1,1,1,1,1,1,0,1,0,0,1,0],
      [0,1,1,0,1,1,1,0,5,5,0,1,1,1,0,1,1,0],
      [0,0,1,0,0,1,0,5,5,4,5,0,1,0,0,1,0,0],
      [3,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1],
      [0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0],
      [0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0],
      [0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,0],
      [0,1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1,0],
      [0,2,1,1,0,0,1,1,1,1,1,1,0,0,1,1,2,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    // var map =  [
    //   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    //   [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0]
    // ];

    var x = 0;
    var y = 0;

    for(var i = 0; i < map.length; i++) {
      for(var j = 0; j < map[i].length; j++) {
          y = i * 15;
          x = j * 15;
        if (map[i][j] === 0 ){
          walls.push(new Wall(game, { x: x, y: y}));
        }
        if (map[i][j] === 1 ){
          pills.push(new Pill(game, { x: x, y: y}));
        }
        if (map[i][j] === 2 ){
          superPills.push(new SuperPill(game, { x: x, y: y}));
        }
        if (map[i][j] === 3 ){
          player.push(new Player(game, { x: x, y: y}, gameSize));
        }
        if (map[i][j] === 4 ){
          ghosts.push(new Ghost(game, { x: x, y: y}, gameSize));
        }
      }
    }
    mapElements.walls = walls;
    mapElements.pills = pills;
    mapElements.superPills = superPills;
    mapElements.player = player;
    mapElements.ghosts = ghosts;
    return mapElements;
  };


  /* KEYBOARDER
     ================================================================= */
  var Keyboarder = function() {
    var keyState = {};
    var self = this;

    window.addEventListener('keydown', function(e) {
      for (var key in self.KEYS) {
        keyState[self.KEYS[key]] = false;
      }
      keyState[e.keyCode] = true;
    });

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 };
  };



  /* DRAW
     ================================================================= */
  var drawRect = function(screen, body) {
    screen.fillStyle = body.color;
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                    body.size.x, body.size.y);
  };

  var drawPills = function(screen, body) {
    screen.beginPath();
    screen.arc(body.center.x, body.center.y, body.size.x/2, 0, Math.PI*2, true);
    screen.closePath();
    screen.fillStyle = body.color;
    screen.fill();
  };

  var drawPacman = function(screen, body, direction) {
    screen.fillStyle = body.color;
    screen.beginPath();

    //Mouth logic
    if (body.mouth.currentSize <= body.mouth.minSize) {
      body.mouth.isClosing = false;
    }
    if (body.mouth.currentSize >= body.mouth.maxSize) {
      body.mouth.isClosing = true;
    }
    if ( body.mouth.isClosing === true ) {
      body.mouth.currentSize -= body.mouth.speed;
    } else {
      body.mouth.currentSize += body.mouth.speed;
    }

    //direction logic
    if(direction === ''){
      screen.arc(body.center.x, body.center.y, body.size.x/2, 2*Math.PI, false);
    }
    if (direction === 'right'){
      screen.arc(body.center.x, body.center.y, body.size.x/2, Math.PI * body.mouth.currentSize, Math.PI * (2 - body.mouth.currentSize), false);
    }
    if (direction === 'down'){
      screen.arc(body.center.x, body.center.y, body.size.x/2, Math.PI * (body.mouth.currentSize + 0.5), Math.PI * ((2 - body.mouth.currentSize) + 0.5), false);
    }
    if (direction === 'left'){
      screen.arc(body.center.x, body.center.y, body.size.x/2, Math.PI * (body.mouth.currentSize + 1), Math.PI * ((2 - body.mouth.currentSize) + 1), false);
    }
    if (direction === 'up'){
      screen.arc(body.center.x, body.center.y, body.size.x/2, Math.PI * (body.mouth.currentSize + 1.5), Math.PI * ((2 - body.mouth.currentSize) + 1.5), false);
    }

    screen.lineTo(body.center.x, body.center.y);
    screen.closePath();
    screen.fill();
  };

  var drawGhosts = function(screen, body) {
    var ghostRefX = body.center.x - body.size.x/2;
    var ghostRefY = body.center.y - body.size.y/2;
    screen.beginPath();
    screen.moveTo(ghostRefX + (body.size.x/6)*6, ghostRefY + (body.size.y/6)*5);
    screen.lineTo(ghostRefX + body.size.x, ghostRefY + (body.size.y/2));
    screen.arc(body.center.x, body.center.y, body.size.x/2, 0, Math.PI, true);
    screen.lineTo(ghostRefX, ghostRefY + (body.size.y/6)*5);
    screen.moveTo(ghostRefX + (body.size.x/6)*2, ghostRefY + (body.size.y/6)*5);
    screen.arc(ghostRefX + (body.size.x/6), ghostRefY + (body.size.y/6)*5, (body.size.y/6), 0, Math.PI,false);
    screen.moveTo(ghostRefX + (body.size.x/6)*4, ghostRefY + (body.size.y/6)*5);
    screen.arc(ghostRefX + (body.size.x/6)*3, ghostRefY + (body.size.y/6)*5,(body.size.y/6), 0, Math.PI,false);
    screen.moveTo(ghostRefX + (body.size.x/6)*6, ghostRefY + (body.size.y/6)*5);
    screen.arc(ghostRefX + (body.size.x/6)*5, ghostRefY + (body.size.y/6)*5, (body.size.y/6), 0, Math.PI,false);


    // Ghost Modes
    if(body.mode === 'normal') {
      screen.fillStyle = body.color;
      screen.fill();
      body.eyes.speed = 0.02;
    }

    if(body.mode === 'fear') {
      screen.strokeStyle = body.color;
      screen.stroke();
      body.eyes.speed = 0.1;
    }

    if(body.mode === 'dead') {
      body.eyes.speed = 0.1;
    }



    // Eyes logic
    if (body.eyes.currentPos <= body.eyes.minPos) {
      body.eyes.isClosing = false;
    }
    if (body.eyes.currentPos >= body.eyes.maxPos) {
      body.eyes.isClosing = true;
    }
    if ( body.eyes.isClosing === true ) {
      body.eyes.currentPos -= body.eyes.speed;
    } else {
      body.eyes.currentPos += body.eyes.speed;
    }

    // Left eye
    screen.beginPath();
    screen.arc(ghostRefX + 4, ghostRefY + (body.size.y/4)*2, 3, 0, 2*Math.PI, true);
    screen.fillStyle = '#ffffff';
    screen.fill();
    // Left eye pupille
    screen.beginPath();
    screen.arc(ghostRefX + body.eyes.currentPos, ghostRefY + (body.size.y/4)*2, 1.5, 0, 2*Math.PI, true);
    screen.fillStyle = '#0000ff';
    screen.fill();
    // Right eye
    screen.beginPath();
    screen.arc(ghostRefX + 10, ghostRefY + (body.size.y/4)*2, 3, 0, 2*Math.PI, true);
    screen.fillStyle = '#ffffff';
    screen.fill();
    // Right eye
    screen.beginPath();
    screen.arc(ghostRefX + body.eyes.currentPos +6, ghostRefY + (body.size.y/4)*2, 1.5, 0, 2*Math.PI, true);
    screen.fillStyle = '#0000ff';
    screen.fill();
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