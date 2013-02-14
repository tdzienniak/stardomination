/**
 * Star Domination - a space-shooter browser game.
 *
 * @author Tymoteusz Dzienniak
 */

//namespace
this.sd = this.sd || {};

/**
 * Static Game module. Contains crucial functions:
 * init - initialize game
 * loop - game loop with all heavy logic and rendering
 */
sd.Game = (function () {
	var stage,
		coll = sd.Collisions,
        mouseStage,
        balls = [],
        edges = [],
        collisions = [],
        fpsCounter,
        mousePosition,
        overtime = 0,
        ship,
        bitmap,
        maxFrameSkip = 5,
        skipedFrames = 0,
        shipDirection = new sd.Vector([0,0]),
        accelerate = false,
        accelerationAngle;

    var init = function () {
        stage = new createjs.Stage('mainCanvas');

        mouseStage = new createjs.Stage('mouseTest');
        mousePosition = document.getElementById('mousePosition');

        ship = new sd.Ship(400, 300, 40, [40,30], 1);
        //mouseStage.addChild(ship);
        bitmap = new createjs.Bitmap("img/back.jpg");
        bitmap.x -= 200;
        bitmap.y -= 200;
        
        stage.addEventListener("stagemousemove", function (event) {
            var localCoords = stage.globalToLocal(event.stageX, event.stageY);
            shipDirection = new sd.Vector([localCoords.x - ship.x, localCoords.y - ship.y]);

            if (accelerate) {
                accelerationAngle = shipDirection.angle;
            }
        });

        stage.addEventListener("stagemousedown", function (event) {
            accelerate = true;
            //ship.engine.visible = true;
            var localCoords = stage.globalToLocal(event.stageX, event.stageY);
            accelerationAngle = new sd.Vector([localCoords.x - ship.x, localCoords.y - ship.y]).angle;
        });

        stage.addEventListener("stagemouseup", function (event) {
            accelerate = false;
            //ship.engine.visible = false;
        });


        balls.push(
            new sd.Ball(500, 300, 10, "red", [-80, -80], 1), 
            new sd.Ball(300, 300, 10, "blue", [30, 60], 1), 
            new sd.Ball(40, 330, 10, "green", [30, 60], 1),
            new sd.Ball(300, 30, 10, "yellow", [50, 100], 2),
            new sd.Ball(250, 40, 10, "yellow", [70, -60], 2),
            new sd.Ball(100, 70, 15, "pink", [-80, 90], 4),
            new sd.Ball(300, 200, 15, "pink", [-70, 20], 3),
            new sd.Ball(100, 200, 10, "pink", [-80, 20], 3),
            new sd.Ball(700, 200, 10, "pink", [-70, 20], 1));

        edges.push(
            //new Edge([0, 150], [90, 0], "green"),
            new sd.Edge([0, 0], [800, 0], "green"),
            new sd.Edge([800, 0], [800, 600], "blue"),
            new sd.Edge([800, 600], [0, 600], "yellow"),
            new sd.Edge([0, 600], [0, 0], "pink"));

        stage.addChild(bitmap, ship);

        balls.forEach(function (ball, index, balls) {
            stage.addChild(ball);
            ball.cache(ball.x - ball.radius, ball.y - ball.radius, 2*ball.radius, 2*ball.radius);
        });

        edges.forEach(function (edge, index, edges) {
            stage.addChild(edge);
        });

        ship.addEventListener("tick", ship.tick);
        
        createjs.Ticker.addEventListener('tick', loop);
        createjs.Ticker.setFPS('60');

        fpsCounter = document.getElementById('fps');
    }

	var loop = function (event) {
        //console.log(event.delta);
        if (event.paused)
            return;

        overtime = event.delta - 1000 / createjs.Ticker.getFPS();
        event.delta = 1000 / createjs.Ticker.getFPS();
/*
        if (event.delta > 1000 / createjs.Ticker.getFPS() + 50) {
            console.log('Przed:' + event.delta);
            event.delta = 1000/createjs.Ticker.getFPS();
            console.log('Po: ' + event.delta);
        }
*/
        fpsCounter.textContent = Math.round(createjs.Ticker.getMeasuredFPS());

        balls.forEach(function (ballA, indexA, balls) {
            //jeśli obiekt nie znjduje się w polu widzenia to nie rysuje go
            if ((ballA.x + stage.x > stage.canvas.width + ballA.radius) ||
                (ballA.y + stage.y > stage.canvas.height + ballA.radius)) {
                ballA.visible = false;
            } else {
                ballA.visible = true;
            }

            var shipDistance = coll.distanceBetweenPoints([ballA.x, ballA.y], [ship.x, ship.y]);
            if (shipDistance <= (ballA.radius + ship.radius)) {
                collisions.push([ballA, ship]);
                //console.log('Jest kolizja!');
            }

            balls.forEach(function (ballB, indexB, array) {
                if (indexB > indexA) {
                    var distance = coll.distanceBetweenPoints([ballA.x, ballA.y], [ballB.x, ballB.y]);
                    if (distance <= (ballA.radius + ballB.radius)) {
                        collisions.push([ballA, ballB]);
                        //console.log('Jest kolizja!');
                    }
                }
            });
        });

        edges.forEach(function (edge, index1, edges) {
            var shipDistance = coll.distanceToEdge([ship.x, ship.y], edge);

            if (shipDistance < ship.radius) {
                collisions.push([edge, ship]);
            }

            balls.forEach(function (ball, index2, balls) {
                var distance = coll.distanceToEdge([ball.x, ball.y], edge);

                if (distance < ball.radius) {
                    collisions.push([edge, ball]);
                }               
            });
        });

        collisions.forEach(function (object, index, collisions) {
            object[0].onCollision(object[1], {stage: stage});
            delete collisions[index];
        });

        balls.forEach(function (ball, index, balls) {
            ball.move(event.delta);
        });

        if (accelerate) {
            ship.accelerate(accelerationAngle);
            console.log('Przyspieszaj!');
        }

        ship.move(event.delta, stage);

        if (overtime > event.delta) {
            console.log(overtime + ' Skiped rendering!');
            overtime -= event.delta;
            return;
        }

        //ship.rotate(shipDirection.angle, event.delta);
        //console.log(ship);
        //mouseStage.update(event.delta, shipDirection.angle);

        stage.x -= event.delta / 1000 * ship.velocity.x;
        stage.y -= event.delta / 1000 * ship.velocity.y;

        stage.update(event.delta, shipDirection.angle);
    }

	return {
		init: init,
		loop: loop
	};
})();