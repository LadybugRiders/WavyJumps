"use strict";
//>>LREditor.Behaviour.name: Player
//>>LREditor.Behaviour.params : {}
var Player = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

Player.prototype = Object.create(LR.Behaviour.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function( _data ){
    this.direction = new Phaser.Point();

    this.scaleMin = 0.5;
    this.scaleMax = 1;

    this.timeInAirMax = 400; // in ms
    this.timeInGroundMin = 50; // in ms

    this.reset();
};

Player.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }
};

Player.prototype.reset = function(){  
    this.speed = 0.25;

    this.entity.scale.setTo(this.scaleMin, this.scaleMin);

    this.onGround = true;
    this.timeInAir = 0;
    this.timeInGround = 0;

    this.active = true;
};

Player.prototype.update = function() {

    var dt = this.go.game.time.elapsed;

    if (this.active == true) {
        var game = this.go.game;

        this.updatePosition(dt);

        // if player is on ground
        if (this.onGround == true) {
            // if he is on ground long enough
            if (this.timeInGround > this.timeInGroundMin) {
                // if the player want to jump
                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.entity.scale.setTo(this.scaleMin, this.scaleMin);
                    this.timeInAir = 0;
                    this.onGround = false;
                }
            } else {
                this.timeInGround += dt;
                if (this.timeInGround > 10000) this.timeInGround = 10000; // prevent too big timer
            }
        } else {
            // if the player has to land
            if (this.timeInAir >= this.timeInAirMax) {
                this.entity.scale.setTo(this.scaleMin, this.scaleMin);
                this.timeInGround = 0;
                this.onGround = true;
            } else {
                this.timeInAir += dt;

                // update scaling
                var ratio = this.timeInAir / this.timeInAirMax;
                if (ratio > 1) ratio = 1;
                var doubleDeltaScale = (this.scaleMax - this.scaleMin) * 2;
                var newScale = this.scaleMin + doubleDeltaScale * Math.sin(ratio);
                if (ratio > 0.5) {
                    newScale = this.scaleMin + doubleDeltaScale * (1 - Math.sin(ratio));
                }
                this.entity.scale.setTo(newScale, newScale);
            }
        }
    }
};

Player.prototype.updatePosition = function(_dt) {
    var game = this.go.game;

    this.direction.setTo(0, 0);

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.direction.x -= 1;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.direction.x += 1;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.direction.y -= 1;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.direction.y += 1;
    }

    this.direction.normalize();

    var halfWidth = this.go.game.camera.width * 0.5;
    this.entity.x += this.direction.x * this.speed * _dt;
    if (this.entity.x - this.entity.width * 0.5 < -halfWidth)
        this.entity.x = -halfWidth + this.entity.width * 0.5;
    else
        if (this.entity.x + this.entity.width * 0.5 > halfWidth)
            this.entity.x = halfWidth - this.entity.width * 0.5;

    var halfHeight = this.go.game.camera.height * 0.5;
    this.entity.y += this.direction.y * this.speed * _dt;
    if (this.entity.y - this.entity.height * 0.5 < -halfHeight + 62) // 62 for the header
        this.entity.y = -halfHeight + 62 + this.entity.height * 0.5; // 62 for the header
    else
        if (this.entity.y + this.entity.height * 0.5 > halfHeight)
            this.entity.y = halfHeight - this.entity.height * 0.5;
};

Player.prototype.onGameOver = function() {
    this.active = false;
};

Player.prototype.onRefresh = function() {
    this.reset();
};


