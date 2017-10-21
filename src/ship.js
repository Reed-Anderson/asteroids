/* ship.js */
import Vector from './vector'

/* NOTE: all angles are in radians to facilitate the use of the Math library */

/**
 * @class ship
 * a class to represent a ship
 */
export default class Ship {
    constructor() {
        // Set class variables
        this.positionVector = new Vector(150, 150);
        this.velocityVector = new Vector(0, 0);
        this.accelerationVector = new Vector(0, 0);
        this.maxAcceleration = .03;
        this.rotationAngle = 0;
        this.accelerating = false;

        this.shiftCoolDown = 0;
        this.bulletCoolDown = 0;

        // Bind class functions
        this.randomizeLocation = this.randomizeLocation.bind(this);
        this.shootBullet = this.shootBullet.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }
    reset() {
        this.positionVector = new Vector(150, 150);
        this.velocityVector = new Vector(0, 0);
        this.rotationAngle = 0;
    }
    randomizeLocation() {
        if (this.shiftCoolDown <= 0) {
            this.positionVector = new Vector(Math.random() * 301, Math.random() * 301);
            this.shiftCoolDown = 120;
        }
    }
    shootBullet() {
        if (this.bulletCoolDown > 0) {
            return false;
        } else {
            this.bulletCoolDown = 20;
            return {
                x: this.positionVector.x + Math.sin(this.rotationAngle) * 3,
                y: this.positionVector.y - Math.cos(this.rotationAngle) * 3,
                angle: this.rotationAngle
            }
        }
    }
    update(left, right, up) {
        // Read input
        this.accelerating = false;
        if (left) {
            this.rotationAngle -= .06;
            if (this.rotationAngle < 0) this.rotationAngle += 2 * Math.PI;
        }
        if (right) {
            this.rotationAngle += .06;
            if (this.rotationAngle > 2 * Math.PI) this.rotationAngle -= 2 * Math.PI;
        }
        if (up) {
            this.accelerating = true;
            this.accelerationVector = new Vector(Math.sin(this.rotationAngle) * this.maxAcceleration,
                                                -Math.cos(this.rotationAngle) * this.maxAcceleration)
        } else {
            this.accelerationVector = new Vector(0, 0);
        }
        
        // Add acceleration to Velocity
        if (this.accelerationVector) {
            this.velocityVector.add(this.accelerationVector);
        }

        // Add velocity to position
        if (this.velocityVector) {
            this.positionVector.add(this.velocityVector);
        }

        // Wrap position
        if (this.positionVector.x < -5) this.positionVector.x = 300;
        else if (this.positionVector.x > 305) this.positionVector.x = 0;
        if (this.positionVector.y < -5) this.positionVector.y = 300;
        else if (this.positionVector.y > 305) this.positionVector.y = 0;

        // Decrement cooldowns
        if (this.shiftCoolDown > 0) {
            this.shiftCoolDown--;
        }
        if (this.bulletCoolDown) this.bulletCoolDown--;

        
        var rv = [];
        
        var column = Math.round(this.positionVector.x / 30)
        if (column < 0) column = 0;
        else if (column > 9) column = 9;
        rv.push(column.toString())

        var leftColumn = Math.round((this.positionVector.x - 7) / 30);
        if (leftColumn < 0) leftColumn = 0;
        else if (leftColumn > 9) leftColumn = 9;
        if (leftColumn != column) rv.push(leftColumn.toString())

        var rightColumn = Math.round((this.positionVector.x + 7) / 30);
        if (rightColumn < 0) rightColumn = 0;
        else if (rightColumn > 9) rightColumn = 9;
        if (rightColumn != column) rv.push(rightColumn.toString())

        return rv
    }
    render(ctx, immune) {
        var x = this.positionVector.x
        var y = this.positionVector.y
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotationAngle);
        ctx.translate(-x, -y);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x + 4, y + 7);
        ctx.lineTo(x - 4, y + 7);
        ctx.lineTo(x, y - 7);
        immune ? ctx.stroke() : ctx.fill();
        ctx.beginPath();
        if (this.accelerating) {
            ctx.strokeStyle = 'red';
            ctx.moveTo(x - 4.000, y + 7);
            ctx.lineTo(x - 2.666, y + 12);
            ctx.lineTo(x - 1.333, y + 9);
            ctx.lineTo(x , y + 15);
            ctx.lineTo(x + 1.333, y + 9);
            ctx.lineTo(x + 2.666, y + 12);
            ctx.lineTo(x + 4.000, y + 7);
            ctx.stroke();
        }
        ctx.restore();
    }
}