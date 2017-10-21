import Vector from './vector'

/**
 * @class Bullet
 * Class to represent a bullet shot from the main ship
 */
export default class Bullet {
    constructor(x, y, angle) {
        this.positionVector = new Vector(x, y);
        this.velocityVector = new Vector(Math.sin(angle) * 4, -Math.cos(angle) * 4);
        this.radius = 2;
        this.destroyed = false;
        // Bind class functions
        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }
    destroy() {
        this.destroyed = true;
    }
    update() {
        if (this.destroyed) return false;
        this.positionVector.add(this.velocityVector);
        if (this.positionVector.x < -5 || this.positionVector.x > 305 ||
            this.positionVector.y < -5 || this.positionVector.y > 305) {
            return false;
        } else {

            var rv = [];

            var column = Math.round(this.positionVector.x / 30)
            if (column < 0) column = 0;
            else if (column > 9) column = 9;
            rv.push(column.toString())
    
            var leftColumn = Math.round((this.positionVector.x - 2) / 30);
            if (leftColumn < 0) leftColumn = 0;
            else if (leftColumn > 9) leftColumn = 9;
            if (leftColumn != column) rv.push(leftColumn.toString())
    
            var rightColumn = Math.round((this.positionVector.x + 2) / 30);
            if (rightColumn < 0) rightColumn = 0;
            else if (rightColumn > 9) rightColumn = 9;
            if (rightColumn != column) rv.push(rightColumn.toString())
    
            return rv
        }
    }
    render(ctx) {
        ctx.save();
        ctx.fillStyle = 'lightblue';
        ctx.beginPath();
        ctx.arc(this.positionVector.x, this.positionVector.y, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.restore();
    }
}