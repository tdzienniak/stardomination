//namespace
this.sd = this.sd || {};

/**
 * Static Collisions module.
 */
sd.Collisions = (function () {

    /**
     * Calculates distance between two points on the stage
     *
     * @param {array} pointA array representing point ([x, y])
     * @param {array} pointB array representing point ([x, y])
     * @return {number} distance between points
     */
    var distanceBetweenPoints = function (pointA, pointB) {
        var AB = new sd.Vector([pointA[0] - pointB[0], pointA[1] - pointB[1]]);
        return Math.sqrt(AB.dot(AB));
    };

    /**
     * Calculates distance to an edge
     *
     * @param {array} point array representing point ([x, y])
     * @param {object} edge Edge object
     * @return {number} distance to edge
     */
    var distanceToEdge = function (point, edge) {
        return Math.abs(new sd.Vector([point[0] - edge.fromX, point[1] - edge.fromY]).dot(edge.normal));
    };

    /**
     * Function calculates vectors,
     * by which two objects should be moved to perfectly intersect.
     * Implementation based on this link:
     * {@link http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php?page=2}
     *
     * @param {object} objA any object with x, y and radius properties (in most cases a circle),
     * it should have also previousPosition method.
     * @param {object} objB any object with x, y and radius properties (in most cases a circle),
     * it should have also previousPosition method.
     * @return {array} array of two vectors, first for objA, second for objB
     */
    var intersectObjObj = function (objA, objB) {
        var A0 = [objA.prevX, objA.prevY], //previous frame objA pos
            A1 = [objA.x, objA.y], //current frame objA pos
            B0 = [objB.prevX, objB.prevY], //previous frame objB pos
            B1 = [objB.x, objB.y], //current frame objB pos
            vA = new sd.Vector([A1[0] - A0[0], A1[1] - A0[1]]), //vector between A1 and A0
            vB = new sd.Vector([B1[0] - B0[0], B1[1] - B0[1]]), //vector beetwen B1 and B0
            AB = new sd.Vector([B0[0] - A0[0], B0[1] - A0[1]]),
            vAB = vB.substract(vA, true),
            rAB = objA.radius + objB.radius, //radius sum
            a = vAB.dot(vAB),
            b = 2 * vAB.dot(AB),
            c = AB.dot(AB) - rAB * rAB;

            var roots = quadraticFormula(a, b, c);

        if (roots) {
            var intersection = [];

            intersection.push(vA.scale(roots[0]));
            intersection.push(vB.scale(roots[0]));

            return intersection;
        } else {
            return false;
        }
    };

    /**
     * Function calculates vector, by which obj should be moved to perfectly "touch" the edge.
     * Implementation based on this:
     * @link http://www.gamasutra.com/view/feature/131790/simple_intersection_tests_for_games.php?page=2
     *
     * @param {object} edge Edge instance
     * @param {object} obj any object with x, y, prevX, prevY and radius properties
     * @return {object} instance of Vector of desired displacement of obj
     */
    var intersectEdgeObj = function (edge, obj) {
        var C0 = new sd.Vector([obj.prevX, obj.prevY]),
            C1 = new sd.Vector([obj.x, obj.y]),
            d0 = distanceToEdge([C0.x, C0.y], edge),
            d1 = distanceToEdge([C1.x, C1.y], edge),
            ui = (d0 - obj.radius)/(d0 - d1),
            Ci = C0.scale(1 - ui).add(C1.scale(ui), true);

            return Ci;
    };

    /**
     * Function calculates new velocities of objects after bounce.
     * Objects should be circle-like (x, y, radius) and have property velocity, which is instance of Vector
     * and mass property. Based on:
     * @link http://www.gamasutra.com/view/feature/131424/pool_hall_lessons_fast_accurate_.php?page=3
     * 
     * @param {object} objA, objB
     * @return {array} array of vector of new velocities of objects 
     */
    var bounceObj = function (objA, objB) {
        //finding normlized vector between obj's centers
        var vN = new sd.Vector([objA.x - objB.x, objA.y - objB.y]);
        vN.normalize();

        //finding components of velocities along vN
        var vNA = objA.velocity.dot(vN, true),
            vNB = objB.velocity.dot(vN, true);

        var optimized = (2 * (vNA - vNB)) / (objA.mass + objB.mass);

        //calculating new velocities
        var vAPrim = objA.velocity.substract(vN.scale(optimized * objA.mass, true), true),
            vBPrim = objB.velocity.add(vN.scale(optimized * objB.mass, true), true);

        return [vAPrim, vBPrim];
    };

    /**
     * 
     */
    var bounceFromEdge = function (edge, obj) {
        obj.velocity.reverseBoth();

        var dot = obj.velocity.dot(edge.normal),
            refX = 2 * edge.normal.x * dot - obj.velocity.x, //reflection velocity X
            refY = 2 * edge.normal.y * dot - obj.velocity.y; //reflection velocity Y

        return new sd.Vector([refX, refY]);
    };

    /* Private helper functions */ 

    /**
     * Solves quadratic equation.
     * a, b, c - are standard real parameters.
     *
     * @return {array} array of equation roots (if any exists), where first is the lesser root
     * @return {boolean} false if there are no solutions
     */
    var quadraticFormula = function (a, b, c) {
        var r1,
            r2,
            delta = b * b - 4 * a * c;

        if (delta >= 0) {
            var sqrtDelta = Math.sqrt(delta);
            r1 = (-b + sqrtDelta) / (2 * a);
            r2 = (-b - sqrtDelta) / (2 * a);

            return (r1 <= r2) ? [r1, r2] : [r2, r1];
        } else {
            return false;
        }
    };

    return {
        distanceBetweenPoints: distanceBetweenPoints,
        distanceToEdge: distanceToEdge,
        intersectObjObj: intersectObjObj,
        intersectEdgeObj: intersectEdgeObj,
        bounceObj: bounceObj,
        bounceFromEdge: bounceFromEdge
    };
})();