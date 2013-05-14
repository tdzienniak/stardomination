this.sd = this.sd || {};
sd.screens = sd.screens || {};

sd.screens["game-screen"] = (function () {
    var stage,
        coll = sd.Collisions,
        balls = [],
        edges = [],
        collisions = [],
        bullets = [],
        fpsCounter,
        energyIndicator,
        mousePosition,
        overtime = 0,
        ship,
        backgrounds = [],
        maxFrameSkip = 5,
        skipedFrames = 0,
        shipDirection = new sd.Vector([0,0]),
        accelerate = false,
        accelerationAngle,
        gameEvents = {},
        inputFlags = {},
        enemy;

    function init () {

        stage = new createjs.Stage('mainCanvas');

        //mousePosition = document.getElementById('mousePosition');

        ship = new sd.Ship(400, 300, 40, [40,30], 1);
        //mouseStage.addChild(ship);
        /*bitmap = new createjs.Bitmap("img/back.jpg");
        bitmap.x -= 200;
        bitmap.y -= 200;*/

        /* kontenery z tłem i cząsteczkami */
        var halfStageX = stage.canvas.width / 2,
            halfStageY = stage.canvas.height / 2;

        backgrounds.push(
            //new sd.Background("img/back.jpg", -0.8, halfStageX, halfStageY),
            new sd.Background("img/spaceNear.png", -0.2, halfStageX, halfStageY),
            new sd.Background("img/spaceMiddle.png", -0.4, halfStageX, halfStageY),
            new sd.Background("img/spaceFar.png", -0.6, halfStageX, halfStageY)
        );
        
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
        
        backgrounds.forEach(function (background, index, backgrounds) {
            stage.addChild(background);
        });

        balls.forEach(function (ball, index, balls) {
            stage.addChild(ball);
            //ball.cache(ball.x - ball.radius, ball.y - ball.radius, 2*ball.radius, 2*ball.radius);
        });

        edges.forEach(function (edge, index, edges) {
            stage.addChild(edge);
        });

        stage.addChild(ship);
        
        ship.addEventListener("tick", ship.tick);

        enemy = new sd.Enemy(500, 300, 10, "white", [50, -80], 1);
        stage.addChild(enemy);
        enemy.addEventListener("tick", enemy.tick);
        
        createjs.Ticker.addEventListener('tick', loop);
        createjs.Ticker.setFPS('60');
        //createjs.Ticker.useRAF = true;

        fpsCounter = document.getElementById('fps');
        energyIndicator = document.getElementById('shipEnergy');

        sd.Input.bind("w", [fireShipWeapon(ship, "front")], false);
        sd.Input.bind("p", [togglePause], true);

        document.addEventListener("keydown", function (event) {
            if (sd.Input.isImmediateEvent(event.keyCode)) {
                sd.Input.trigger(event.keyCode, true, this);
            } else {
                sd.Input.setFlag(event.keyCode, true, this);
            }
        });

        document.addEventListener("keyup", function (event) {
            sd.Input.setFlag(event.keyCode, false);
        });
    }

    function loop (event) {
        //console.log(event.delta);
        if (event.paused)
            return;

        overtime = event.delta - 1000 / createjs.Ticker.getFPS();
        event.delta = 1000 / createjs.Ticker.getFPS();
        
        sd.Input.dispatchEvents({delta: event.delta});
        /*      
        if (event.delta > 1000 / createjs.Ticker.getFPS() + 50) {
            console.log('Przed:' + event.delta);
            event.delta = 1000/createjs.Ticker.getFPS();
            console.log('Po: ' + event.delta);
        }
        */
        fpsCounter.textContent = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
        energyIndicator.textContent = Math.round(ship.energy) + "/" + ship.maxEnergy;

        for (var i = 0, len = balls.length; i < len; i += 1) {
            if ((balls[i].x + stage.x > stage.canvas.width + balls[i].radius) ||
                (balls[i].y + stage.y > stage.canvas.height + balls[i].radius)) {
                balls[i].visible = false;
            } else {
                balls[i].visible = true;
            }
            
            var shipDistance = coll.distanceBetweenPoints([balls[i].x, balls[i].y], [ship.x, ship.y]);
            if (shipDistance <= (balls[i].radius + ship.radius)) {
                collisions.push([balls[i], ship]);
                //console.log('Jest kolizja!');
            }

            for (var j = i + 1; j < len; j += 1) {
                var distance = coll.distanceBetweenPoints([balls[i].x, balls[i].y], [balls[j].x, balls[j].y]);
                if (distance <= (balls[i].radius + balls[j].radius)) {
                    collisions.push([balls[i], balls[j]]);
                    //console.log('Jest kolizja!');
                }
            }

            for (var j = 0, bulletsLen = bullets.length; j < bulletsLen; j += 1) {
                var distance = coll.distanceBetweenPoints([balls[i].x, balls[i].y], [bullets[j].x, bullets[j].y]);
                //console.log(bullets[j]);
                if (distance <= (balls[i].radius + bullets[j].radius)) {
                    //console.log("kolizja!");
                    //createjs.Ticker.setPaused(true);
                    stage.removeChild(balls[i], bullets[j]);
                    bullets.splice(j, 1);
                    balls.splice(i, 1);
                }
            }

            for (var j = 0, edgesLen = edges.length; j < edgesLen; j += 1) {
                var distance = coll.distanceToEdge([balls[i].x, balls[i].y], edges[j]);

                if (distance < balls[i].radius) {
                    collisions.push([edges[j], balls[i]]);
                }
            }
        }

        for (var i = 0, len = edges.length; i < len; i += 1) {
            var shipDistance = coll.distanceToEdge([ship.x, ship.y], edges[i]);

            if (shipDistance < ship.radius) {
                collisions.push([edges[i], ship]);
            }
        }

        for (var i = 0, len = collisions.length; i < len; i += 1) {
            collisions[i][0].onCollision(collisions[i][1], {stage: stage});
            //collisions.splice(i, 1);
        }

        collisions = [];

        balls.forEach(function (ball, index, balls) {
            ball.move(event.delta);
        });

        bullets.forEach(function (bullet, bulletIndex, bullets) {
            if ( ! bullet.canLive(event.delta)) {
                stage.removeChild(bullet);
                bullets.splice(bulletIndex, 1);

                return;
            }

            bullet.move(event.delta);
        })

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

        //stage.x -= event.delta / 1000 * ship.velocity.x;
        //stage.y -= event.delta / 1000 * ship.velocity.y;
        stage.x = -ship.x + stage.canvas.width / 2;
        stage.y = -ship.y + stage.canvas.height / 2;;

        moveBackground(ship.velocity, event.delta);

        stage.update(event.delta, shipDirection.angle);
    }

    function moveBackground (velocity, delta) {
        backgrounds.forEach(function (background, index, backgrounds) {
            background.move(velocity, delta);
        });
    }

    function fireShipWeapon(ship, weapon) {
        var weapon = weapon,
            ship = ship;
        return function (event) {
            var _bullets;
            _bullets = ship.fire(weapon, event);

            if (_bullets) {
                _bullets.forEach(function (bullet, index, array) {
                    bullets.push(bullet);
                    stage.addChild(bullet);
                }, this)
                //console.log(bullets);
            }
        };
    }

    function togglePause() {
        var paused = createjs.Ticker.getPaused();
        createjs.Ticker.setPaused( ! paused);
    }

    return {
        init: init
    };
})();