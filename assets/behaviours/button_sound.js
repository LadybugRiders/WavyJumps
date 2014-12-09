"use strict";

//>>LREditor.Behaviour.name: ButtonSound

var ButtonSound = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

ButtonSound.prototype = Object.create(LR.Behaviour.Button.prototype);
ButtonSound.prototype.constructor = ButtonSound;

ButtonSound.prototype.create = function(_args) {
    this.inputOver = false;
};

ButtonSound.prototype.update = function() {
}

ButtonSound.prototype.onClick = function() {
    this.go.game.sound.mute = !this.go.game.sound.mute;
};

ButtonSound.prototype.onInputOver = function() {
    this.entity.alpha = 0.5;

    this.inputOver = true;
};

ButtonSound.prototype.onInputOut = function() {
    this.entity.alpha = 1;

    this.inputOver = false;
};
