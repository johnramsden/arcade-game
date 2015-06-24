// Constants
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var MAX_SPEED = 250;    // Max speed in pixels
var MIN_SPEED = 50;     // Min speed in pixels
var OFFSET = 20;        // Offset to get center of square vertically
var NUM_ENEMIES = 5;    // Total number of Enemies
var CANVAS_WIDTH = 505;

// Helper functions
var randomBetweenInterval = function(start, end) {
    return Math.floor((Math.random() * (end-start+1)) + start);
}

// Input block number horizontal, far left is 0 and coordinate is returned
var blockCoordinatesX = function(blockX) {
    return blockX * BLOCK_WIDTH;
}
    
// Input block number vertical, top is 0 and coordinate is returned
var blockCoordinatesY = function(blockY) {
    return ((blockY) * BLOCK_HEIGHT) - OFFSET;
}
    // Enemies our player must avoid
var Enemy = function() {       
    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
    
    // Start random distance off screen up to a screen off
    this.x = this.randomStartPos();
    
    // In order to choose which row to start the enemy 
    // we choose a random row from 1 to 3 where 1 is 
    // top rock square and 3 is bottom rock square and
    // multiply by row height.
    this.y = this.randomRockRow();
    
    this.speed = this.randomSpeed();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if(this.x > CANVAS_WIDTH){ // Enemy at end of screen
        this.y = this.randomRockRow();
        this.speed = this.randomSpeed();
        this.x = -BLOCK_WIDTH; 
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

    // Returns a multiple of row height for rock textures
Enemy.prototype.randomRockRow = function() {
        return (randomBetweenInterval(1, 3) * BLOCK_HEIGHT) - OFFSET;
}
    
Enemy.prototype.randomSpeed = function() {
        return randomBetweenInterval(MIN_SPEED, MAX_SPEED);
}

Enemy.prototype.randomStartPos = function() {
        return -randomBetweenInterval(-CANVAS_WIDTH, CANVAS_WIDTH);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';
    
    this.x = blockCoordinatesX(2); // Start player in middle
    this.y = blockCoordinatesY(5); // Start player at bottom
}

Player.prototype.update = function(dt) {
    
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(allowedKeys) {
    if(allowedKeys === 'left' && (this.x != blockCoordinatesX(0))) {
        this.x -= BLOCK_WIDTH;
    } else if (allowedKeys === 'right' && (this.x != blockCoordinatesX(4))){
        this.x += BLOCK_WIDTH;
    } else if (allowedKeys === 'up' && (this.y != blockCoordinatesY(0))){
        this.y -= BLOCK_HEIGHT;
    } else if (allowedKeys === 'down' && (this.y != blockCoordinatesY(5))){
        this.y += BLOCK_HEIGHT;
    } else {
        console.log("AT END OF SCREEN, CANNOT MOVE FURTHER.")
    }
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
