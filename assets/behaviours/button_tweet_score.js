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
};

ButtonTweetScore.prototype.update = function() {
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
        left   = (this.go.game.camera.width  - width) * 0.5,
        top    = (this.go.game.camera.height - height) * 0.5,
        url    = url,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;
    
    window.open(url, 'twitter', opts);

    console.log("OK");
};

