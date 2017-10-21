import Vector from './vector'

/**
 * @class Asteroid
 * a class to represent an asteroid
 */
export default class Asteroid {
    constructor(x, y, xSpeed, ySpeed, size) {
        this.positionVector = new Vector(x, y);
        this.velocityVector = new Vector(xSpeed, ySpeed);
        this.radius = size;
        this.destroyed = false;

        this.break = this.break.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }
    break() {
        this.destroyed = true;
        if (this.radius > 8) {
            this.radius /= 2;
            return this;
        } else {
            return false;
        }
    }
    clone() {
        var rv = new Asteroid();
        //rv.positionVector = new ()
    }
    update() {
        if (this.destroyed) return false
        this.positionVector.add(this.velocityVector);
        if (this.positionVector.x < -5) {
            this.positionVector.x = 300;
        } else if (this.positionVector.x > 305) {
            this.positionVector.x = 0;
        }
        if (this.positionVector.y < -5) {
            this.positionVector.y = 300;
        } else if (this.positionVector.y > 305) {
            this.positionVector.y = 0;
        }

        
        var rv = [];

        var column = Math.round(this.positionVector.x / 30)
        if (column < 0) column = 0;
        else if (column > 9) column = 9;
        rv.push(column.toString())

        var leftColumn = Math.round((this.positionVector.x - this.radius) / 30);
        if (leftColumn < 0) leftColumn = 0;
        else if (leftColumn > 9) leftColumn = 9;
        if (leftColumn != column) rv.push(leftColumn.toString())

        var rightColumn = Math.round((this.positionVector.x + this.radius) / 30);
        if (rightColumn < 0) rightColumn = 0;
        else if (rightColumn > 9) rightColumn = 9;
        if (rightColumn != column) rv.push(rightColumn.toString())

        return rv
    }
    render(ctx) {
        ctx.save();
        ctx.strokeStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.positionVector.x, this.positionVector.y, this.radius, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.restore();
    }
}