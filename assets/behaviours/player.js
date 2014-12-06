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

    this.timeInAirMax = 300; // in ms
};

Player.prototype.start = function(){  
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
    }

    this.reset();
};

Player.prototype.reset = function(){  
    this.speed = 0.25;

    this.entity.scale.setTo(this.scaleMin, this.scaleMin);

    this.onGround = true;
    this.timeInAir = 0;

    this.active = true;
};

Player.prototype.update = function() {

    var dt = this.go.game.time.elapsed;

    if (this.active == true) {
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
        this.entity.x += this.direction.x * this.speed * dt;
        if (this.entity.x - this.entity.width * 0.5 < -halfWidth)
            this.entity.x = -halfWidth + this.entity.width * 0.5;
        else
            if (this.entity.x + this.entity.width * 0.5 > halfWidth)
                this.entity.x = halfWidth - this.entity.width * 0.5;

        var halfHeight = this.go.game.camera.height * 0.5;
        this.entity.y += this.direction.y * this.speed * dt;
        if (this.entity.y - this.entity.height * 0.5 < -halfHeight + 62) // 62 for the header
            this.entity.y = -halfHeight + 62 + this.entity.height * 0.5; // 62 for the header
        else
            if (this.entity.y + this.entity.height * 0.5 > halfHeight)
                this.entity.y = halfHeight - this.entity.height * 0.5;

        if (this.onGround == true) {
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.entity.scale.setTo(this.scaleMax, this.scaleMax);
                this.timeInAir = 0;
                this.onGround = false;
            }
        } else {
            if (this.timeInAir >= this.timeInAirMax) {
                this.entity.scale.setTo(this.scaleMin, this.scaleMin);
                this.onGround = true;
            } else {
                this.timeInAir += dt;
            }
        }
    }
};

Player.prototype.onGameOver = function() {
    this.active = false;
};


