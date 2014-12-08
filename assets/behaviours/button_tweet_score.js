"use strict";

//>>LREditor.Behaviour.name: ButtonTweetScore

var ButtonTweetScore = function(_gameobject) {
    LR.Behaviour.Button.call(this, _gameobject);
};

ButtonTweetScore.prototype = Object.create(LR.Behaviour.Button.prototype);
ButtonTweetScore.prototype.constructor = ButtonTweetScore;

ButtonTweetScore.prototype.create = function(_data) {
    this.textBestScore = null;
    this.textBestScoreBehaviour = null;

    // get the best score
    if (_data) {
        if (_data.best_score) {
            this.textBestScore = _data.best_score;
            this.textBestScoreBehaviour = this.textBestScore.getBehaviour(TextBestScore);
            if (this.textBestScoreBehaviour == null) {
                console.warn("WavesManager: Behaviour Player not found");
            }
        } else {
            console.warn("WavesManager: Player not found");
        }
    } else {
        console.warn("WavesManager: No data");
    }

    this.speed = 0.01;

    this.angleMin = -8;
    this.angleMax = 8;
};

ButtonTweetScore.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }

    this.reset();
};

ButtonTweetScore.prototype.reset = function(){  
    this.angle = 0;

    this.active = false;
};

ButtonTweetScore.prototype.update = function() {
    var dt = this.go.game.time.elapsed;

    if (this.active == true) {
        this.entity.angle += this.speed * dt;
        if (this.entity.angle < this.angleMin) {
            this.entity.angle = this.angleMin;
            this.speed *= -1;
        }

        if (this.entity.angle > this.angleMax) {
            this.entity.angle = this.angleMax;
            this.speed *= -1;
        }
    }
}

ButtonTweetScore.prototype.onClick = function() {
    this.entity.angle = 0;

    var url = "http://twitter.com/share?text=So much fun playing WaveJumps! Try it!"
                + "&url=http://tinyurl.com/ktabosc&hashtags=WavyJumps,LadybugRiders";
    if (this.textBestScoreBehaviour != null) {
        url = "http://twitter.com/share?text=My best score on WavyJumps is "
                    + parseInt(this.textBestScoreBehaviour.bestScore)
                    + ". Can you beat it?!&url=http://tinyurl.com/ktabosc&hashtags=WavyJumps,LadybugRiders";
    }

    var width  = 575,
        height = 400,
        left   = (window.innerWidth  - width) * 0.5,
        top    = (window.innerHeight - height) * 0.5,
        url    = url,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);
};

ButtonTweetScore.prototype.onInputOver = function() {
    this.entity.alpha = 0.5;

    this.inputOver = true;
};

ButtonTweetScore.prototype.onInputOut = function() {
    this.entity.alpha = 1;

    this.inputOver = false;
};

ButtonTweetScore.prototype.onGameOver = function() {
    this.active = true;
};

ButtonTweetScore.prototype.onRefresh = function() {
    this.reset();
};

