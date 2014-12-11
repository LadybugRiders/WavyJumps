"use strict";
//>>LREditor.Behaviour.name: WavesManager
//>>LREditor.Behaviour.params : {"player": null}
var WavesManager = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
};

WavesManager.prototype = Object.create(LR.Behaviour.prototype);
WavesManager.prototype.constructor = WavesManager;

WavesManager.prototype.create = function( _data ){
    // create Pollinator (not great here but you know...)
    this.go.game.plugins.Pollinator = new Phaser.Plugin.Pollinator();

    // set nb waves at start
    this.nbWavesAtStart = 1;

    // get the player
    if (_data) {
        if (_data.player) {
            this.player = _data.player;
            this.playerBehaviour = this.player.getBehaviour(Player);
            if (this.playerBehaviour == null) {
                console.warn("WavesManager: Behaviour Player not found");
            }
        } else {
            console.warn("WavesManager: Player not found");
        }
    } else {
        console.warn("WavesManager: No data");
    }
    
    // create the graphics area for wave rendering
    this.graphics = this.go.game.add.graphics(0, 0);

    this.isFirstTimeInUpdate = true;

    // reset the stuff
    this.reset();
};

WavesManager.prototype.start = function(){  
    // add graphics to its z
    this.go.entity.addChild(this.graphics);

    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }
};

WavesManager.prototype.reset = function(){  
    this.waves = new Array();
    this.activeWaves = new Array();
    this.inactiveWaves = new Array();

    for (var i = 0; i < this.nbWavesAtStart; i++) {
        this.waves.push(new Wave(this));
    };

    this.timerNewWave = 0;
    this.step = 5000; // number of ms before adding a new wave

    this.active = true;

    // Push Game > Launch Event
    _gaq.push(["_trackEvent", "Game", "Launch"]);
};

WavesManager.prototype.update = function() {
    if (this.isFirstTimeInUpdate == true) {
        if (this.go.game.plugins.Pollinator) {
            this.go.game.plugins.Pollinator.dispatch("ShowText", {text: "Move and Jump to catch Bonus", duration: 3500});
        }

        this.isFirstTimeInUpdate = false;
    }

    if (this.active == true) {
        var dt = this.go.game.time.elapsed;

        if (this.go.game.plugins.Pollinator) {
            this.go.game.plugins.Pollinator.dispatch("UpdateTimerScore", {timer_score: dt});
        }

        this.graphics.clear();
        this.activeWaves = new Array();
        this.inactiveWaves = new Array();

        for (var i=0; i<this.waves.length; ++i) {
            var wave = this.waves[i];

            wave.update(dt);

            if (wave.active) {
                this.activeWaves.push(wave);
            } else {
                if (wave.needReset == true) {
                    this.inactiveWaves.push(wave);
                }
            }
        }

        // check collisions with the player if he is on ground
        if (this.playerBehaviour != null) {
            if (this.playerBehaviour.onGround == true) {
                var i = 0;
                var gameOver = false;
                while (i<this.activeWaves.length && gameOver == false) {
                    var wave = this.activeWaves[i];
                    var collide = wave.collideWithEntity(this.player.entity);
                    if (collide) {
                        if (this.go.game.plugins.Pollinator) {
                            // force positioning here because waves have to know the correct
                            // player's position to reset
                            /*this.player.x = 0;
                            this.player.y = 0;*/
                            // dispatch the GameOver
                            this.go.game.plugins.Pollinator.dispatch("GameOver");
                        }

                        gameOver = true;
                    }

                    ++i;
                }
            }
        }

        // reset all inactive waves
        for (var i=0; i<this.inactiveWaves.length; ++i) {
            var wave = this.inactiveWaves[i];
            wave.reset();
        }

        // add a wave if necessary
        this.timerNewWave += dt;
        if (this.timerNewWave >= this.step) {
            this.waves.push(new Wave(this));

            this.timerNewWave = 0;
        }

        // draw waves
        for (var i=0; i<this.waves.length; ++i) {
            this.waves[i].render(this.graphics);
        }
    }
};

WavesManager.prototype.onGameOver = function() {
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.dispatch("ShowText", {text: "Game Over", duration: 2000});
    }
    this.active = false;
};

WavesManager.prototype.onRefresh = function() {
    this.reset();
};

//////////
// WAVE //
//////////

var Wave = function(_manager) {
    this.manager = _manager;
    var game = this.manager.go.game;
    var halfWidth = game.camera.width * 0.5;

    this.radiusMin = 30;
    this.radiusMax = halfWidth;

    this.lineWidthMin = 4;
    this.lineWidthMax = 10;

    this.alphaMin = 0;
    this.alphaMax = 1;

    this.speedMin = 0.05;
    this.speedMax = 0.10;

    this.speedFading = 0.002;

    this.toPlayer = new Phaser.Point();
    
    this.reset();
};

Wave.prototype.reset = function() {
    var game = this.manager.go.game;

    var halfWidth = game.camera.width * 0.5;
    var halfHeight = game.camera.height * 0.5;

    // set position
    this.x = game.rnd.integerInRange(-halfWidth, halfWidth);
    this.y = game.rnd.integerInRange(-halfHeight, halfHeight);

    // set type
    if (game.rnd.realInRange(0, 1) < 0.5) {
        this.type = 0;
    } else {
        this.type = 1;
    }

    // set line width
    this.lineWidth = this.lineWidthMin;

    // set alpha
    this.alpha = this.alphaMax;

    //set speed
    this.speed = (this.speedMax + this.speedMin) * 0.5;

    // adjust radius, speed and color depending on type
    if (this.type == 0) {
        this.radius = this.radiusMin;
        this.color = 0xd36705;
    } else {
        this.radius = this.radiusMax;
        this.speed *= -1;
        this.color = 0x33a3c1;
    }
    
    // check if the circle isn't to close to the player, replace it otherwise
    if (this.manager.player != null) {
        var player = this.manager.player;
        this.toPlayer.setTo(
            player.x - this.x,
            player.y - this.y
            );

        // /!\ NEED TO REWORK FOR BLUE CIRCLES
        if (this.toPlayer.getMagnitude() < (this.radius * 0.5 + 100)) {
            var offset = this.radius * 0.5 + 100;
            this.toPlayer.setTo(
                game.rnd.realInRange(0.1, 1),
                game.rnd.realInRange(0.1, 1)
                );
            this.toPlayer.normalize();

            var sign = game.rnd.realInRange(-1, 1);
            if (game.rnd.realInRange(-1, 1) < 0) {
                this.toPlayer.x *= -1;
            }

            if (game.rnd.realInRange(-1, 1) < 0) {
                this.toPlayer.y *= -1;
            }

            this.x = player.x + this.toPlayer.x * offset;
            this.y = player.y + this.toPlayer.y * offset;
        }
    }

    // doesn't need to be reseted anymore
    this.needReset = false;

    // set active
    this.active = true;
}

Wave.prototype.update = function(_dt) {
    if (this.active) {
        this.radius += this.speed * _dt;

        if (this.radius <= this.radiusMin) {
            this.radius = this.radiusMin;
            this.active = false;
        } else {
            if (this.radius >= this.radiusMax) {
                this.radius = this.radiusMax;
                this.active = false;
            }
        }
    } else {
        if (this.needReset == false) {
            this.alpha -= this.speedFading * _dt;

            if (this.alpha <= 0) {
                this.alpha = 0;
                this.needReset = true;
            }
        }
    }
};

Wave.prototype.render = function(_graphics) {
    _graphics.lineStyle(this.lineWidth, this.color, this.alpha);
    
    // draw a shape
    _graphics.drawCircle(this.x, this.y, this.radius);
};

Wave.prototype.collideWithEntity = function(_entity) {
    var collide = false;

    this.toPlayer.setTo(
        _entity.x - this.x,
        _entity.y - this.y
        );

    var radiusEntity = _entity.width * 0.5;
    var halfLineWidth = this.lineWidth * 0.5;
    var radiusMin = this.radius * 0.5 - halfLineWidth;
    var radiusMax = this.radius * 0.5 + halfLineWidth;
    var radiusSumMin = radiusMin - radiusEntity;
    var radiusSumMax = radiusMax + radiusEntity;

    var distanceToPlayer = this.toPlayer.getMagnitude();
    if (distanceToPlayer < radiusSumMax && distanceToPlayer > radiusSumMin) {
        collide = true;
    }

    return collide;
};


