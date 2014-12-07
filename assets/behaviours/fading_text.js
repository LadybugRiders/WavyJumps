"use strict";
//>>LREditor.Behaviour.name: FadingText
//>>LREditor.Behaviour.params : {}
var FadingText = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

FadingText.prototype = Object.create(LR.Behaviour.prototype);
FadingText.prototype.constructor = FadingText;

FadingText.prototype.create = function( _data ){
    this.entity.align = 'center';
    this.speed = 0.001;

    this.entity.getLocalBounds();
};

FadingText.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
    }

    this.reset();
};

FadingText.prototype.reset = function(){  
    var cameraWidth = this.go.game.camera.width;
    var cameraHeight = this.go.game.camera.height;

    this.x = cameraWidth * 2;
    this.y = cameraHeight * 2;

    this.spawnX = 0;
    this.spawnY = 150;

    this.entity.alpha = 0;

    this.timer = 0;

    this.nbTickActive = 0;

    this.active = false;
};

FadingText.prototype.update = function() {
    if (this.active == true) {
        if (this.nbTickActive == 0) {
            this.x = this.spawnX - (this.entity.getLocalBounds().width * 0.5);
            this.entity.alpha = 0;
            this.nbTickActive++;
        } else if (this.nbTickActive == 1){
            this.entity.alpha = 1;
            this.nbTickActive++;
        } else {
            var dt = this.go.game.time.elapsed;

            this.timer += dt;
            if (this.timer > this.duration) {
                this.reset();
            } else {
                this.entity.y -= 50 * this.speed * dt;
                this.entity.alpha -= this.speed * dt;
                if (this.entity.alpha < 0) this.entity.alpha = 0;
            }
        }
    }
};

FadingText.prototype.activate = function(_text, _duration) {
    if (this.active == false) {
        this.x = this.spawnX - (this.entity.getLocalBounds().width * 0.5);
        this.y = this.spawnY;

        this.entity.setText(_text);
        this.duration = _duration;

        this.speed = 1 / this.duration;

        this.active = true;
    }
};

FadingText.prototype.onGameOver = function() {
};
