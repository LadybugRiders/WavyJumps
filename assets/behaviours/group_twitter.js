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
};

GroupTwitter.prototype.update = function() {
};

GroupTwitter.prototype.onGameOver = function() {
};

GroupTwitter.prototype.onGameOver = function() {
    this.x = 0;
    this.y = 0;
};

GroupTwitter.prototype.onRefresh = function() {
    this.reset();
};
