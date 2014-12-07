"use strict";

//>>LREditor.Behaviour.name: TextBestScore

var TextBestScore = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

TextBestScore.prototype = Object.create(LR.Behaviour.prototype);
TextBestScore.prototype.constructor = TextBestScore;

TextBestScore.prototype.create = function(_args) {
    this.entity.align = 'left';
};

TextBestScore.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("UpdateBestScore", this.onUpdateBestScore, this);
    }

    this.bestScore = "00000";

    this.entity.text = this.bestScore;
};

TextBestScore.prototype.onUpdateBestScore = function(_args){  
    if (_args != null) {
        if (_args.score != null) {
            if (parseInt(this.bestScore) < parseInt(_args.score)) {
                this.bestScore = _args.score;
                this.entity.text = this.bestScore;
            }
        }
    }
};
