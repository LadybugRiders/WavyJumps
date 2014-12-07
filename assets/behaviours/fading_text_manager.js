"use strict";
//>>LREditor.Behaviour.name: FadingTextManager
//>>LREditor.Behaviour.params : {}
var FadingTextManager = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

FadingTextManager.prototype = Object.create(LR.Behaviour.prototype);
FadingTextManager.prototype.constructor = FadingTextManager;

FadingTextManager.prototype.create = function( _data ){
};

FadingTextManager.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("ShowText", this.onShowText, this);
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }

    this.reset();
};

FadingTextManager.prototype.reset = function(){  
    this.childrenBehaviours = new Array();

    var children = this.entity.children;
    for (var i=0; i<this.entity.children.length; ++i) {
        var child = children[i];
        // get behavior
        var behaviorBonus = child.go.getBehaviour(FadingText);
        if (behaviorBonus != null) {
            this.childrenBehaviours.push(behaviorBonus);

            // reset Behavior
            behaviorBonus.reset();
        }
    }
};

FadingTextManager.prototype.onShowText = function(_args) {
    if (_args != null) {
        if (_args.text != null && _args.duration != null) {
            this.spawn(_args.text, _args.duration);
        }
    }
};

FadingTextManager.prototype.spawn = function(_text, duration) {
    var i = 0;
    var found = false;
    while (i < this.childrenBehaviours.length && found == false) {
        var behavior = this.childrenBehaviours[i];
        if (behavior.active == false) {
            behavior.activate(_text, duration);

            found = true;
        }

        ++i;
    }
};

FadingTextManager.prototype.onGameOver = function() {
};

FadingTextManager.prototype.onRefresh = function() {
    this.reset();
};

