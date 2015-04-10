
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
