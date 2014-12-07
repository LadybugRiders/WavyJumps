"use strict";

//>>LREditor.Behaviour.name: TextScore

var TextScore = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

TextScore.prototype = Object.create(LR.Behaviour.prototype);
TextScore.prototype.constructor = TextScore;

TextScore.prototype.create = function(_args) {
    this.entity.align = 'right';
};

TextScore.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("UpdateTimerScore", this.onUpdateTimerScore, this);
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }

    this.initialText = this.entity.text;

    this.reset();
};

TextScore.prototype.reset = function(){  
    this.entity.text = this.initialText;

    this.timerScore = 0;
    this.bonusScore = 0;

    this.active = true;
};

TextScore.prototype.update = function(){  
    if (this.active == true) {
        var score = "" + (Math.floor(this.timerScore * 0.01) + this.bonusScore);
        var nbNumbers = score.length;
        if (nbNumbers < 5) {
            for (var i=0; i<(5 - nbNumbers); ++i) {
                score = "0" + score;
            }
        }
        this.entity.text = score;   
    }
};

TextScore.prototype.onUpdateTimerScore = function(_args) {
    if (this.active == true && _args != null) {
        if (_args.timer_score != null) {
            this.timerScore = _args.timer_score;
        }
    }
};

TextScore.prototype.onGameOver = function(_args) {
    this.active = false;

    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.dispatch("UpdateBestScore", {score: this.entity.text});
    }
};

TextScore.prototype.onRefresh = function() {
    this.reset();
};
