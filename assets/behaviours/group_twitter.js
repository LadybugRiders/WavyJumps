"use strict";
//>>LREditor.Behaviour.name: GroupTwitter
//>>LREditor.Behaviour.params : {}
var GroupTwitter = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

GroupTwitter.prototype = Object.create(LR.Behaviour.prototype);
GroupTwitter.prototype.constructor = GroupTwitter;

GroupTwitter.prototype.create = function( _data ){
    this.speed = 0.001;
};

GroupTwitter.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }

    this.reset();
};

GroupTwitter.prototype.reset = function(){  
    var cameraWidth = this.go.game.camera.width;
    var cameraHeight = this.go.game.camera.height;
    this.x = cameraWidth * 2;
    this.y = cameraHeight * 2;

    this.entity.alpha = 0;

    this.active = false;
};

GroupTwitter.prototype.update = function() {

    if (this.active == true) {
        var dt = this.go.game.time.elapsed;

        this.entity.alpha += this.speed * dt;
        if (this.entity.alpha > 1) this.entity.alpha = 1;
    }
    
};

GroupTwitter.prototype.onGameOver = function() {
    this.x = 0;
    this.y = 0;

    this.active = true;
};

GroupTwitter.prototype.onRefresh = function() {
    this.reset();
};
