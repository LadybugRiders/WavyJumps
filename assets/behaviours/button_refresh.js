"use strict";

//>>LREditor.Behaviour.name: ButtonRefresh

var ButtonRefresh = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

ButtonRefresh.prototype = Object.create(LR.Behaviour.Button.prototype);
ButtonRefresh.prototype.constructor = ButtonRefresh;

ButtonRefresh.prototype.create = function(_args) {
};

ButtonRefresh.prototype.onClick = function() {
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.dispatch("Refresh", this.onGameOver, this);
    }
};

ButtonRefresh.prototype.onInputOver = function() {
    this.entity.angle = 180;
};

ButtonRefresh.prototype.onInputOut = function() {
    this.entity.angle = 0;
};
