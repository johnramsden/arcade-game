// Constants
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var MAX_SPEED = 100;    // Max speed in pixels
var OFFSET = 20;        // Offset to have bug in center of square
var NUM_ENEMIES = 10;   // Total number of Enemies
    
    // Enemies our player must avoid
var Enemy = function() {
   
    // Returns a multiple of row height for rock textures
    var randomRockRow = function() {
        return (Math.floor((Math.random() * 3) + 1) * BLOCK_HEIGHT) - OFFSET;
    }
    
    var randomSpeed = function() {
        return Math.floor((Math.random() * MAX_SPEED) + 1);
    }
       
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    // Start off screen
    this.x = -BLOCK_WIDTH;
    
    // In order to choose which row to start the enemy 
    // we choose a random row from 1 to 3 where 1 is 
    // top rock square and 3 is bottom rock square and
    // multiply by row height.
    this.y = randomRockRow();
    
    this.speed = randomSpeed();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    console.log("Enemy location: " + this.x);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    
}

Player.prototype.update = function(dt) {
    
}

Player.prototype.render = function() {
    
}

Player.prototype.handleInput = function(allowedKeys) {
    
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
// Add numEnemies
for(var i = 0; i<NUM_ENEMIES; i++) {
    allEnemies.push(new Enemy());
}

var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
