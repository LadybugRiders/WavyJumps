"use strict";
//>>LREditor.Behaviour.name: BonusManager
//>>LREditor.Behaviour.params : {}
var BonusManager = function(_gameobject) {  
    LR.Behaviour.call(this,_gameobject);
};

BonusManager.prototype = Object.create(LR.Behaviour.prototype);
BonusManager.prototype.constructor = BonusManager;

BonusManager.prototype.create = function( _data ){
    this.players = new Array();
    this.playerBehaviours = new Array();

    // get the player
    if (_data) {
        if (_data.players) {
            // for each player, store player info
            var nbChildren = _data.players.entity.children.length;
            for (var i=0; i<nbChildren; ++i) {
                this.players.push(_data.players.entity.children[i].gameobject);
                var playerBehaviour = this.players[i].getBehaviour(Player);
                this.playerBehaviours.push(playerBehaviour);
            }
        } else {
            console.warn("BonusManager: Player not found");
        }
    } else {
        console.warn("BonusManager: No data");
    }

    this.stepStart = 1500; //ms
    this.step = 5000; //ms
};

BonusManager.prototype.start = function(){  
    // add listener to Pollinator
    if (this.go.game.plugins.Pollinator) {
        this.go.game.plugins.Pollinator.on("GameOver", this.onGameOver, this);
        this.go.game.plugins.Pollinator.on("Refresh", this.onRefresh, this);
    }

    this.reset();
};

BonusManager.prototype.reset = function(){  
    this.childrenBehaviours = new Array();

    this.isFirstBonusSpwaned = false;
    this.timer = 0;

    var children = this.entity.children;
    for (var i=0; i<this.entity.children.length; ++i) {
        var child = children[i];
        // get behavior bonus
        var behaviorBonus = child.go.getBehaviour(Bonus);
        if (behaviorBonus != null) {
            this.childrenBehaviours.push(behaviorBonus);

            // reset Behavior Bonus
            behaviorBonus.reset();
            behaviorBonus.players = this.players;
            behaviorBonus.playerBehaviours = this.playerBehaviours;
        }
    }

    this.active = true;
};

BonusManager.prototype.update = function() {
    if (this.active == true) {
        var dt = this.go.game.time.elapsed;

        this.timer += dt;

        if (this.isFirstBonusSpwaned == true) {
            if (this.timer > this.step) {
                this.spawnBonus();

                this.timer = 0;
            }
        } else {
            if (this.timer > this.stepStart) {
                this.isFirstBonusSpwaned = true;

                this.spawnBonus();

                this.timer = 0;
            }
        }
    }
};

BonusManager.prototype.spawnBonus = function() {
    var i = 0;
    var found = false;
    while (i < this.childrenBehaviours.length && found == false) {
        var behavior = this.childrenBehaviours[i];
        if (behavior.active == false) {
            behavior.activate();

            found = true;
        }

        ++i;
    }
};

BonusManager.prototype.onGameOver = function() {
    this.active = false;
};

BonusManager.prototype.onRefresh = function() {
    this.reset();
};

