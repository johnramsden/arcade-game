// Game object for storing main game functions and variables
var Game = function () {
    // Constants
    this.BLOCK_WIDTH = 101;             // width of a single block
    this.BLOCK_HEIGHT = 83;             // height of a single block
    this.OFFSET = 20;                   // Offset to get center of square vertically
    this.STARTING_NUM_ENEMIES = 3;      // Starting number of Enemies
    this.CANVAS_WIDTH = 505;            // width of game canvas
    this.FULL_SCORE = 10000;            // Score for perfect run on level 1
    
    // Variables
    this.level = 1;                     // starting level
    this.totalScore = 0;
    this.score = this.FULL_SCORE;       // starting score for a run with no collisions
    this.maxSpeed = 100;                // Max speed in pixels
    this.minSpeed = 50;                 // Min speed in pixels
};

// Game methods:

// Method to start the game, takes a Player object and array of Enemies
Game.prototype.startGame = function(player, enemies){
    this.player = player;
    this.enemies = enemies;
    
    this.setupLevel();
    this.updateScore();
    this.updateLevelScore();
};

// Methhod for setting up a level
// Adds an enemy and increase speed every level
Game.prototype.setupLevel = function () {
    // Update level in HTML
    document.getElementById("level").innerHTML = "Level: " + this.level;
    // Increase the speed by 50 pixels
    this.maxSpeed += 50;
    // Add an Enemy every fourth level
    if (this.level % 4 === 0) {
        this.enemies.push(new Enemy(this));
    }
    // Each level the total score updates 
    this.totalScore += this.score;
    this.updateScore();
    // Each level the score you can get from the level is multiplied by the level number
    this.score = this.FULL_SCORE * this.level;
};

// Update the total score in HTML
Game.prototype.updateScore = function () {
    document.getElementById("score").innerHTML = "Total Score: " + this.totalScore;
};

// Update the level score in HTML
Game.prototype.updateLevelScore = function () {
    document.getElementById("levelScore").innerHTML = "Level Score: " + this.score;
};

// Enemy object, takes as a parameter the game object
var Enemy = function (game) { 
    this.game = game;                        // Game the Enemy will be in
    this.sprite = 'images/enemy-bug.png';   // The image/sprite for our enemies
    this.x = this.randomStartPos();         // Start random distance off screen up to a screen off
    this.y = this.randomRockRow();          // Put Enemy on a random row
    this.speed = this.randomSpeed();        // Give Enemy a random speed
};

// Enemy methods:

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += this.speed * dt;
    if (this.x > this.game.CANVAS_WIDTH) { // Enemy at end of screen
        this.y = this.randomRockRow();
        this.speed = this.randomSpeed();
        this.x = -this.game.BLOCK_WIDTH;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Returns a multiple of row height for rock textures
Enemy.prototype.randomRockRow = function () {
    return (this.randomBetweenInterval(1, 3) * this.game.BLOCK_HEIGHT) - this.game.OFFSET;
};

// GIve the Enemy a random speed
Enemy.prototype.randomSpeed = function () {
    return this.randomBetweenInterval(this.game.minSpeed, this.game.maxSpeed);
};

// Start the Enemy on a random point
Enemy.prototype.randomStartPos = function () {
    return -this.randomBetweenInterval(-this.game.CANVAS_WIDTH, this.game.CANVAS_WIDTH);
};

// Helper method, returns number between start and end parameters
Enemy.prototype.randomBetweenInterval = function (start, end) {
    return Math.floor((Math.random() * (end - start + 1)) + start);
};

// Player object, takes Game as parameter
var Player = function (game) {
    this.sprite = 'images/char-boy.png';    // The image/sprite for our player
    this.game = game;                       // Game player belongs to
    this.x = this.blockCoordinatesX(2);     // Start player in middle
    this.y = this.blockCoordinatesY(5);     // Start player at bottom
};

// Player methods

// Updates the player every tick
Player.prototype.update = function () {
    for (var i = 0; i < this.game.enemies.length; i++) {
        // CHecks if player is on the same row as Enemy
        if ((this.game.enemies[i].y === this.y)) { 
            // Check if enemy is in in vicinity as the player
            if ((this.x >= this.game.enemies[i].x - this.game.BLOCK_WIDTH) && 
                    (this.x <= (this.game.enemies[i].x + this.game.BLOCK_WIDTH))) {
                // If a collision has occured move player back to start position 
                this.x = this.blockCoordinatesX(2);
                this.y = this.blockCoordinatesY(5);
                this.game.score -= 500;         // Reduce score every collision
                this.game.updateLevelScore();   // Update current score
                console.log("COLLISION");
            }
        }
    }
    
    // If player gets to end start a new level
    if (this.y === this.blockCoordinatesY(0)) {
        this.game.level++;
        this.game.setupLevel();
        this.x = this.blockCoordinatesX(2); // Move player to middle
        this.y = this.blockCoordinatesY(5); // Move player to bottom
    }
};

// Draw the player
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle keyboard input, takes a key as input
// Moves player base on keyboard input if not at end of screen
Player.prototype.handleInput = function (allowedKeys) {
    if (allowedKeys === 'left' && (this.x != this.blockCoordinatesX(0))) {
        this.x -= this.game.BLOCK_WIDTH;
    } else if (allowedKeys === 'right' && (this.x != this.blockCoordinatesX(4))) {
        this.x += this.game.BLOCK_WIDTH;
    } else if (allowedKeys === 'up' && (this.y != this.blockCoordinatesY(0))) {
        this.y -= this.game.BLOCK_HEIGHT;
    } else if (allowedKeys === 'down' && (this.y != this.blockCoordinatesY(5))) {
        this.y += this.game.BLOCK_HEIGHT;
    } else {
        console.log("AT END OF SCREEN, CANNOT MOVE FURTHER.");
    }
};

// Input block number horizontal, far left is 0 and coordinate is returned
Player.prototype.blockCoordinatesX = function (blockX) {
    return blockX * this.game.BLOCK_WIDTH;
};

// Input block number vertical, top is 0 and coordinate is returned
Player.prototype.blockCoordinatesY = function (blockY) {
    return ((blockY) * this.game.BLOCK_HEIGHT) - this.game.OFFSET;
};

// Variable intantiation:
var game = new Game();
var player = new Player(game);
var allEnemies = [];
for (var i = 0; i < game.STARTING_NUM_ENEMIES; i++) {
    allEnemies.push(new Enemy(game));
}

// Start the game
game.startGame(player, allEnemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});