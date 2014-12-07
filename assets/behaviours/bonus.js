"use strict";
//>>LREditor.Behaviour.name: Bonus
//>>LREditor.Behaviour.params : {}
var Bonus = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

Bonus.prototype = Object.create(LR.Behaviour.prototype);
Bonus.prototype.constructor = Bonus;

Bonus.prototype.create = function( _data ){
    this.reset();
};

Bonus.prototype.start = function(){  
};

Bonus.prototype.reset = function(){  
    this.x = 0;
    this.y = 0;

    this.speed = 0.25;

    this.entity.scale.setTo(this.scaleMin, this.scaleMin);

    this.onGround = true;
    this.timeInAir = 0;
    this.timeInGround = 0;

    this.entity.animations.play('play');

    this.active = true;
};

Bonus.prototype.update = function() {
    // check collision with player
    if (this.player != null) {
        
    }
};

