/**
 * @class Vector
 * A class to represent a vector
 */
export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @function add
     * Add a vector to the first one
     * @param { Vector } secondVector 
     */
    add(secondVector) {
        this.x += secondVector.x;
        this.y += secondVector.y;
    }
}