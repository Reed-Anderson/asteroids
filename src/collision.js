import Vector from './vector'

export function checkAllCollisions(xGrid) {
    
    var rv = [];
    xGrid.forEach(column => {
        if (column.length < 2) return;
        for (var i = 0; i < column.length - 1; i++) {
            for (var j = i + 1; j < column.length; j++) {
                if (column[i].type === 'asteroid') {
                    if (column[j].type === 'asteroid') {
                        if (checkCircleCollision(column[i].obj, column[j].obj)) {
                            rv.push({
                                type: 'asteroids',
                                itemOne: column[i].obj,
                                itemTwo: column[j].obj
                            })
                        }
                    } else if (column[j].type === 'bullet') {
                        if (checkCircleCollision(column[i].obj, column[j].obj)) {
                            rv.push({
                                type: 'bulletAsteroid',
                                itemOne: column[j].obj,
                                itemTwo: column[i].obj
                            })
                        }
                    } else if (column[j].type === 'ship') {
                        if (checkShipCollision(column[j].obj, column[i].obj)) {
                            rv.push({
                                type: 'shipAsteroid',
                                itemOne: column[j].obj,
                                itemTwo: column[i].obj
                            })
                        }
                    }
                } else if (column[i].type === 'ship') {
                    if (column[j].type === 'asteroid') {
                        if (checkShipCollision(column[i].obj, column[j].obj)) {
                            rv.push({
                                type: 'shipAsteroid',
                                itemOne: column[i].obj,
                                itemTwo: column[j].obj
                            })
                        }
                    }
                } else if (column[i].type === 'bullet') {
                    if (column[j].type === 'asteroid') {
                        if (checkCircleCollision(column[i].obj, column[j].obj)) {
                            rv.push({
                                type: 'bulletAsteroid',
                                itemOne: column[i].obj,
                                itemTwo: column[j].obj
                            })
                        }
                    }
                }
            }
        }
    })
    
    return rv;
    
    
    // // brute force for now
    // var rv = []
    // for (var i = 0; i < asteroids.length - 1; i++) {
    //     for (var j = i + 1; j < asteroids.length; j++) {
    //         if (checkCircleCollision(asteroids[i], asteroids[j])) {
    //             rv.push({
    //                 type: 'asteroids',
    //                 itemOne: asteroids[i],
    //                 itemTwo: asteroids[j]
    //             })
    //         }
    //     }
    // }
    // for (var k = 0; k < bullets.length; k++) {
    //     for (var l = 0; l < asteroids.length; l++) {
    //         if (checkCircleCollision(bullets[k], asteroids[l])) {
    //             rv.push({
    //                 type: 'bulletAsteroid',
    //                 itemOne: bullets[k],
    //                 itemTwo: asteroids[l]
    //             })
    //         }
    //     }
    // }
    // for (var m = 0; m < asteroids.length; m++) {
    //     if (checkShipCollision(ship, asteroids[m])) {
    //         rv.push({
    //             type: 'shipAsteroid',
    //             itemOne: ship,
    //             itemTwo: asteroids[m]
    //         })
    //     }
    // }
    // return rv;
}

export function checkCircleCollision(circleOne, circleTwo) {
    var distanceSquared =
        Math.pow(circleOne.positionVector.x - circleTwo.positionVector.x, 2) +
        Math.pow(circleOne.positionVector.y - circleTwo.positionVector.y, 2);
    var rv = distanceSquared < Math.pow(circleOne.radius + circleTwo.radius, 2);
    return rv;
}

export function circlePointCollision(circle, point) {
    var distanceSquared =
        Math.pow(circle.positionVector.x - point.x, 2) +
        Math.pow(circle.positionVector.y - point.y, 2);
    return distanceSquared < Math.pow(circle.radius, 2)
}

export function checkShipCollision(ship, circle) {
    var points = [
        { x: ship.positionVector.x, y: ship.positionVector.y },
        { x: ship.positionVector.x, y: ship.positionVector.y - 7 },
        { x: ship.positionVector.x - 4, y: ship.positionVector.y + 7 },
        { x: ship.positionVector.x + 4, y: ship.positionVector.y + 7 },
        { x: ship.positionVector.x - 2, y: ship.positionVector.y },
        { x: ship.positionVector.x + 2, y: ship.positionVector.y },
        { x: ship.positionVector.x, y: ship.positionVector.y + 7 },
    ]
    var rv = false;
    points.forEach(p => {
        if (circlePointCollision(circle, p)) {
            rv = true;
        }
    })
    return rv;
}

export function simpleAsteroidCollision(asteroidOne, asteroidTwo) {
    var ma = Math.PI * Math.pow(asteroidOne.radius, 2);
    var mb = Math.PI * Math.pow(asteroidTwo.radius, 2);
    var vaix = asteroidOne.velocityVector.x
    var vbix = asteroidTwo.velocityVector.x
    var vaiy = asteroidOne.velocityVector.y
    var vbiy = asteroidTwo.velocityVector.y

    var vafx = (((ma - mb) / (ma + mb)) * vaix)
        + (((mb + mb) / (ma + mb)) * vbix)

    var vbfx = (((ma + ma) / (ma + mb)) * vaix)
        + (((mb - ma) / (ma + mb)) * vbix)

    var vafy = (((ma - mb) / (ma + mb)) * vaiy)
        + (((mb + mb) / (ma + mb)) * vbiy)

    var vbfy = (((ma + ma) / (ma + mb)) * vaiy)
        + (((mb - ma) / (ma + mb)) * vbiy)
    
    asteroidOne.velocityVector = new Vector(vafx, vafy);
    asteroidTwo.velocityVector = new Vector(vbfx, vbfy);
}

export function existingCollisions(array, newAsteroid) {
    array.forEach(a => {
        if (checkCircleCollision(a, newAsteroid)) {
            return true;
        }
    })
    return false;
}