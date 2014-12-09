"use strict";
//>>LREditor.Behaviour.name: Bonus
//>>LREditor.Behaviour.params : {}
var Bonus = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

Bonus.prototype = Object.create(LR.Behaviour.prototype);
Bonus.prototype.constructor = Bonus;

Bonus.prototype.create = function( _data ){
    this.bonusValue = 500;
    this.toEntity = new Phaser.Point();

    this.player = null;
    this.playerBehaviour = null;
};

Bonus.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
    }

    this.reset();
};

Bonus.prototype.reset = function(){  
    var rnd = this.go.game.rnd;
    var cameraWidth = this.go.game.camera.width;
    var cameraHeight = this.go.game.camera.height;
    this.x = cameraWidth * 2;
    this.y = cameraHeight * 2;

    var offsetX =  this.entity.width;
    this.spawnX = cameraWidth * -0.5 + offsetX + rnd.integerInRange(0, cameraWidth - offsetX - this.entity.width);

    var offsetY =  this.entity.height + 62; // 62 for the header
    this.spawnY = cameraHeight * -0.5 + offsetY + rnd.integerInRange(0, cameraHeight - offsetY - this.entity.height);

    this.entity.animations.play('idle');

    this.active = false;
};

Bonus.prototype.update = function() {
    if (this.active == true) {
        // check collision with player
        if (this.playerBehaviour != null) {
            if (this.playerBehaviour.onGround == true) {
                if (this.collideWithEntity(this.player) == true) {
                    if (this.go.game.plugins.Pollinator) {
                        // add bonus to score
                        this.go.game.plugins.Pollinator.dispatch("UpdateBonusScore", {bonus_score: this.bonusValue});
                        var text = "+" + this.bonusValue;
                        this.go.game.plugins.Pollinator.dispatch("ShowText", {text: text, duration: 1000});

                        this.go.game.sound.play('sound_bonus', 0.2);
                    }

                    // reset
                    this.reset();
                }
            }
        }
    }
};

Bonus.prototype.activate = function() {
    if (this.active == false) {
        this.x = this.spawnX;
        this.y = this.spawnY;

        this.entity.animations.play('play');

        this.active = true;
    }
};

Bonus.prototype.collideWithEntity = function(_entity) {
    var collide = false;

    this.toEntity.setTo(
        _entity.x - this.entity.x,
        _entity.y - this.entity.y
        );

    var radius = this.entity.width * 0.5;
    var radiusEntity = _entity.width * 0.5;
    var radiusSum = radius + radiusEntity;

    var distanceToEntity = this.toEntity.getMagnitude();
    if (distanceToEntity < radiusSum) {
        collide = true;
    }

    return collide;
};

Bonus.prototype.onGameOver = function() {
    this.entity.animations.play('idle');
    this.active = false;
};
