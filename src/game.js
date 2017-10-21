import Ship from './ship'
import Asteroid from './asteroid'
import Bullet from './bullet'
import ShootSound from './sound/shoot.wav'
import Explosion from './sound/explosion.wav'
import { checkAllCollisions, existingCollisions, simpleAsteroidCollision } from './collision'

/**
 * @class Game
 * A class to represent the game
 */
export default class Game {
    constructor() {
        // Create the back buffer canvas
        this.backBufferCanvas = document.createElement('canvas');
        this.backBufferCanvas.width = 300;
        this.backBufferCanvas.height = 300;
        this.backBufferContext = this.backBufferCanvas.getContext('2d');

        // Create the screen buffer canvas
        this.screenBufferCanvas = document.createElement('canvas');
        this.screenBufferCanvas.id = 'domCanvas';
        this.screenBufferCanvas.width = 300;
        this.screenBufferCanvas.height = 300;
        document.body.appendChild(this.screenBufferCanvas);
        this.screenBufferContext = this.screenBufferCanvas.getContext('2d');

        // Create the instructions
        var p = document.createElement('p');
        p.innerText = 'Welcome to Asteroids.'
        document.body.appendChild(p);
        p = document.createElement('p');
        p.innerText = 'Use the arrow keys to move the ship, and the space bar to shoot.'
        document.body.appendChild(p);
        p = document.createElement('p');
        p.innerText = 'Use the shift key to teleport to a random location.'
        document.body.appendChild(p);
        p = document.createElement('p');
        p.innerText = 'Destroy all the asteroids to advance to the next level.'
        document.body.appendChild(p);
        p = document.createElement('p');
        p.innerText = 'Be careful! Getting hit by an asteroid will cost you a life.'
        document.body.appendChild(p);
        p = document.createElement('p');
        p.innerText = 'After losing three lives the game will be over.'
        document.body.appendChild(p);

        // Hold other classes
        this.ship = new Ship();
        this.asteroids = [];
        this.bullets = [];
        
        // Create game variables
        this.level = 0;
        this.score = 0;
        this.lives = 3;
        this.over = false;
        this.inputLeft = false;
        this.inputRight = false;
        this.inputUp = false;
        this.immunityCooldown = 0;
        this.grid = []

        // handle key events
        this.handleKeyDown = this.handleKeyDown.bind(this);
        document.onkeydown = this.handleKeyDown;
        this.handleKeyUp = this.handleKeyUp.bind(this);
        document.onkeyup = this.handleKeyUp;

        // Bind functions
        this.nextLevel = this.nextLevel.bind(this);
        this.loop = this.loop.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.loseLife = this.loseLife.bind(this);

        this.nextLevel();
        this.interval = setInterval(this.loop, 15);
    }
    handleKeyDown(event) {
        event.preventDefault();
        switch(event.key) {
          case 'a':
          case 'ArrowLeft':
            this.inputLeft = true;
            break;
          case 'd':
          case 'ArrowRight':
            this.inputRight = true;
            break;
          case 'w':
          case 'ArrowUp':
            this.inputUp = true;
            break;
        }
    }
    handleKeyUp(event) {
        event.preventDefault();
        switch(event.key) {
            case 'a':
            case 'ArrowLeft':
              this.inputLeft = false;
              break;
            case 'd':
            case 'ArrowRight':
              this.inputRight = false;
              break;
            case 'w':
            case 'ArrowUp':
              this.inputUp = false;
              break;
            case 'Shift':
              this.ship.randomizeLocation();
              break;
            case ' ':
                var bullet = this.ship.shootBullet();
                if (bullet) {
                    this.bullets.push(new Bullet(bullet.x, bullet.y, bullet.angle));
                    this.playSound(ShootSound);
                }
          }
    }
    playSound(sound) {
        var audio = new Audio(sound);
        audio.play();
    }
    nextLevel() {
        this.immunityCooldown = 180;
        this.level++;
        this.asteroids = [];

        var minMax = function(min, max) {
            do {
                var rv = Math.random() * max;
            } while (rv < min)
            return rv;
        }

        var numAsteroids = 9 + this.level * 1
        for (var i = 0; i < numAsteroids; i++) {
            do {
                let x = minMax(i * 300 / numAsteroids, (i + 1) * 300 / numAsteroids);
                let y = Math.random() * 300;
                let xSpeed = Math.random() > .5 ? minMax(.25, .75) : -minMax(.25, .75)
                let ySpeed = Math.random() > .5 ? minMax(.25, .75) : -minMax(.25, .75)
                let radius = minMax(4, 16);
                var a = new Asteroid(x, y, xSpeed, ySpeed, radius);
            } while (existingCollisions(this.asteroids, a))
            this.asteroids.push(a);
        }
    }
    loseLife() {
        this.lives--;
        if (this.lives <= 0) this.over = true;
        this.immunityCooldown = 180;
        this.playSound(Explosion);
    }
    handleCollisions(collisions) {
        collisions.forEach(col => {
            if (col.type === 'asteroids') {
                simpleAsteroidCollision(col.itemOne, col.itemTwo);
            } else if (col.type === 'bulletAsteroid') {
                col.itemOne.destroy();
                this.score += 20 * this.level;
                var replacementAsteroids = col.itemTwo.break()
                if (replacementAsteroids) {
                    this.asteroids.push(new Asteroid(replacementAsteroids.positionVector.x - 10, replacementAsteroids.positionVector.y - 10,
                        replacementAsteroids.velocityVector.y, -replacementAsteroids.velocityVector.x, replacementAsteroids.radius))
                    this.asteroids.push(new Asteroid(replacementAsteroids.positionVector.x + 10, replacementAsteroids.positionVector.y + 10,
                        -replacementAsteroids.velocityVector.y, replacementAsteroids.velocityVector.x, replacementAsteroids.radius))
                }
            } else if (col.type === 'shipAsteroid') {
                if (!this.immunityCooldown) {
                    this.loseLife();
                    this.ship.reset();
                }
            }
        })
    }
    loop() {
        this.update();
        this.render();
    }
    update() {
        if (!this.over) {
            if (this.asteroids.length == 0) this.nextLevel();
            var xGrid = [];
            for (var i = 0; i < 10; i++) xGrid[i] = [];
            var columns = this.ship.update(this.inputLeft, this.inputRight, this.inputUp);
            if (columns) {
                columns.forEach(c => {
                    xGrid[c].push({
                        type: 'ship',
                        obj: this.ship
                    })
                })
            }
            this.asteroids = this.asteroids.filter(asteroid => {
                columns = asteroid.update();
                if (columns) {
                    columns.forEach(c => {
                        xGrid[c].push({
                            type: 'asteroid',
                            obj: asteroid
                        })
                    })
                }
                return columns;
            })
            this.bullets = this.bullets.filter(bullet => {
                columns = bullet.update();
                if (columns) {
                    columns.forEach(c => {
                        xGrid[c].push({
                            type: 'bullet',
                            obj: bullet
                        })
                    })
                }
                return columns;
            })
            var collisions = checkAllCollisions(xGrid);
            this.handleCollisions(collisions);
            if (this.immunityCooldown) this.immunityCooldown--;
        }
    }
    render() {
        if (!this.over) {
            // create the background
            this.backBufferContext.fillStyle = '#333';
            this.backBufferContext.fillRect(0, 0, 300, 300);
            // draw game variables
            this.backBufferContext.fillStyle = 'white';
            this.backBufferContext.font = "10px Verdana";
            this.backBufferContext.fillText(this.score + ' Points', 10, 290);
            this.backBufferContext.fillText(this.lives + ' Lives', 255, 290);
            this.backBufferContext.fillText('Level ' + this.level, 135, 15);
            // render the asteroids
            this.asteroids.forEach(asteroid => asteroid.render(this.backBufferContext));
            // render the bullets
            this.bullets.forEach(bullet => bullet.render(this.backBufferContext));
            // render the ship
            this.ship.render(this.backBufferContext, this.immunityCooldown);
        } else {
            this.backBufferContext.fillStyle = '#333';
            this.backBufferContext.fillRect(0,0,300,300);
            this.backBufferContext.fillStyle = 'white';
            this.backBufferContext.font = "10px Verdana";
            this.backBufferContext.fillText('Game Over. Total Points - ' + this.score, 80, 65);
            this.backBufferContext.fillText('Click here to play again.', 87, 120);
            var canvas = document.getElementById('domCanvas');
            canvas.onclick = function() {
                window.location = window.location;
            }
        }
        this.screenBufferContext.drawImage(this.backBufferCanvas, 0, 0);
    }
}