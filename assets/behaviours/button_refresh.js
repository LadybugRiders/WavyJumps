"use strict";

//>>LREditor.Behaviour.name: ButtonRefresh

var ButtonRefresh = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

ButtonRefresh.prototype = Object.create(LR.Behaviour.Button.prototype);
ButtonRefresh.prototype.constructor = ButtonRefresh;

ButtonRefresh.prototype.create = function(_args) {
    this.speed = 0.1;

    this.inputOver = false;
};

ButtonRefresh.prototype.update = function() {
    var dt = this.go.game.time.elapsed;

    if (this.inputOver == true) {
        this.entity.angle += this.speed * dt;
    }
}

ButtonRefresh.prototype.onClick = function() {
    this.entity.angle = 0;

    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.dispatch("Refresh", this.onGameOver, this);
    }
};

ButtonRefresh.prototype.onInputOver = function() {
    this.entity.alpha = 0.5;

    this.inputOver = true;
};

ButtonRefresh.prototype.onInputOut = function() {
    this.entity.alpha = 1;

    this.inputOver = false;
};
