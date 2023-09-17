/**
 * @returns the angle (in degrees) from the X axis to a point.
 * @param y A numeric expression representing the cartesian y-coordinate.
 * @param x A numeric expression representing the cartesian x-coordinate.
 */
function atan2(y: number, x: number) {
    return Math.atan2(y, x) / Math.PI * 180;
}

export { atan2 }