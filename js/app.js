// Constants
var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var OFFSET = 20;                // Offset to get center of square vertically
var STARTING_NUM_ENEMIES = 3;   // Starting number of Enemies
var CANVAS_WIDTH = 505;
var FULL_SCORE = 10000;         // Score for perfect run on level 1
var START_MAX_SPEED = 100;
var START_MIN_SPEED = 50;

// Game object
var Game = function () {
    this.maxSpeed = START_MAX_SPEED;    // Max speed in pixels
    this.minSpeed = START_MIN_SPEED;    // Min speed in pixels
    this.level = 1;
    this.totalScore = 0;
    this.score = FULL_SCORE;            // Score for a run with no collisions

    // Enemies our player must avoid
    var Enemy = function () {       
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
    };

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    Enemy.prototype.update = function (dt) {
        this.x += this.speed * dt;
        if (this.x > CANVAS_WIDTH) { // Enemy at end of screen
            this.y = Game.randomRockRow();
            this.speed = Game.randomSpeed();
            this.x = -BLOCK_WIDTH;
        }
    };

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Static function that returns a multiple of row height for rock textures
    Enemy.prototype.randomRockRow = function () {
        return (Game.randomBetweenInterval(1, 3) * BLOCK_HEIGHT) - OFFSET;
    };

    // Returns a speed between Games minSpeed and maxSpeed
    Enemy.prototype.randomSpeed = function () {
        return Game.randomBetweenInterval(this.minSpeed, this.maxSpeed);
    };

    // Returns a position within Games -CANVAS_WIDTH and CANVAS_WIDTH
    Enemy.prototype.randomStartPos = function () {
        return -Game.randomBetweenInterval(-CANVAS_WIDTH, CANVAS_WIDTH);
    };


    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    var Player = function () {
        // The image/sprite for our player
        this.sprite = 'images/char-boy.png';

        this.x = Game.blockCoordinatesX(2); // Start player in middle
        this.y = Game.blockCoordinatesY(5); // Start player at bottom
    };

    Player.prototype.update = function () {
        for (var i = 0; i < allEnemies.length; i++) {
            if ((allEnemies[i].y === this.y)) { 
                // If player is on the same row as enemy check if enemy is in in vicinity
                if ((this.x >= allEnemies[i].x - BLOCK_WIDTH) && (this.x <= (allEnemies[i].x + BLOCK_WIDTH))) {
                    this.x = Game.blockCoordinatesX(2); // Move player to middle
                    this.y = Game.blockCoordinatesY(5); // Move player to bottom
                    console.log("COLLISION");
                    Game.score -= 500; // Reduce score every collision
                    this.setupLevelScore(Game.score);
                }
            }
        }
    
        // If player gets to end start a new level
        if (this.y === this.blockCoordinatesY(0)) {
            this.setupLevel(++Game.level);
            this.x = Game.blockCoordinatesX(2); // Move player to middle
            this.y = Game.blockCoordinatesY(5); // Move player to bottom
        }
    };

    Player.prototype.render = function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    Player.prototype.handleInput = function (allowedKeys) {
        if (allowedKeys === 'left' && (this.x != Game.blockCoordinatesX(0))) {
            this.x -= BLOCK_WIDTH;
        } else if (allowedKeys === 'right' && (this.x != Game.blockCoordinatesX(4))) {
            this.x += BLOCK_WIDTH;
        } else if (allowedKeys === 'up' && (this.y != Game.blockCoordinatesY(0))) {
            this.y -= BLOCK_HEIGHT;
        } else if (allowedKeys === 'down' && (this.y != Game.blockCoordinatesY(5))) {
            this.y += BLOCK_HEIGHT;
        } else {
            console.log("AT END OF SCREEN, CANNOT MOVE FURTHER.")
        }
    };
};

// Static function to get a random number between start and end
Game.randomBetweenInterval = function (start, end) {
    return Math.floor((Math.random() * (end - start + 1)) + start);
};

// Static function to get block coordinate
// Input block number in horizontal, far left is 0 and coordinate is returned
Game.blockCoordinatesX = function (blockX) {
    return blockX * BLOCK_WIDTH;
};

// Static function to get block coordinate
// Input block number vertical, top is 0 and coordinate is returned
Game.blockCoordinatesY = function (blockY) {
    return ((blockY) * BLOCK_HEIGHT) - OFFSET;
};

// Add an enemy and increase speed every level
Game.prototype.setupLevel = function () {
    document.getElementById("level").innerHTML = "Level: " + this.level;
    this.maxSpeed += 50;
    // Add a new enemy every fourth level
    if (this.level % 4 === 0) {
        allEnemies.push(new Game.Enemy());
    }
    console.log("Level: " + this.level + ", Number of enemies: " + allEnemies.length);
    this.totalScore += this.score;
    this.setupScore();
    this.score = FULL_SCORE * this.level;
};

// Sets up scoreboard with your total score
Game.prototype.setupScore = function () {
    document.getElementById("score").innerHTML = "Total Score: " + this.score;
};

// Sets up scoreboard with your score for current level
Game.prototype.setupLevelScore = function () {
    document.getElementById("levelScore").innerHTML = "Level Score: " + this.score;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var game = new Game();
game.setupLevel();
game.setupScore();
game.setupLevelScore();

var allEnemies = [];
// Add numEnemies
for (var i = 0; i < STARTING_NUM_ENEMIES; i++) {
    allEnemies.push(new game.Enemy());
}

var player = new game.Player();


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