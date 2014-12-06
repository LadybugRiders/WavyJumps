"use strict";
//>>LREditor.Behaviour.name: WavesManager
//>>LREditor.Behaviour.params : {"player": null}
var WavesManager = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
};

WavesManager.prototype = Object.create(LR.Behaviour.prototype);
WavesManager.prototype.constructor = WavesManager;

WavesManager.prototype.create = function( _data ){
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

    this.nbWavesAtStart = 1;

    this.graphics = this.go.game.add.graphics(0, 0);

    this.waves = new Array();
    this.activeWaves = new Array();
    this.inactiveWaves = new Array();

    this.timer = 0;
    this.step = 5000; // 10s before adding a new wave

    this.go.game.plugins.Pollinator = new Phaser.Plugin.Pollinator();

    this.active = true;
};

WavesManager.prototype.start = function(){  
    // add graphics to its z
    this.go.entity.addChild(this.graphics);

    for (var i = 0; i < this.nbWavesAtStart; i++) {
        this.waves.push(new Wave(this));
    };

    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
    }
};

WavesManager.prototype.update = function() {
    if (this.active == true) {
        var dt = this.go.game.time.elapsed;

        this.graphics.clear();
        this.activeWaves = new Array();
        this.inactiveWaves = new Array();

        for (var i=0; i<this.waves.length; ++i) {
            var wave = this.waves[i];

            wave.update(dt);

            if (wave.active) {
                this.activeWaves.push(wave);
            } else {
                this.inactiveWaves.push(wave);
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
        this.timer += dt;
        if (this.timer >= this.step) {
            this.waves.push(new Wave(this));

            this.timer = 0;
        }

        // draw waves
        for (var i=0; i<this.waves.length; ++i) {
            this.waves[i].render(this.graphics);
        }
    }
};

WavesManager.prototype.onGameOver = function() {
    this.active = false;
};

//////////
// WAVE //
//////////

var Wave = function(_manager) {
    this.manager = _manager;
    var game = this.manager.go.game;
    var halfWidth = game.camera.width * 0.5;

    this.radiusMin = 10;
    this.radiusMax = halfWidth;

    this.lineWidthMin = 4;
    this.lineWidthMax = 10;

    this.alphaMin = 0;
    this.alphaMax = 1;

    this.speedMin = 0.05;
    this.speedMax = 0.10;

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


