"use strict";
//>>LREditor.Behaviour.name: WavesManager
//>>LREditor.Behaviour.params : {}
var WavesManager = function(_gameobject) {	
	LR.Behaviour.call(this,_gameobject);
};

WavesManager.prototype = Object.create(LR.Behaviour.prototype);
WavesManager.prototype.constructor = WavesManager;

WavesManager.prototype.create = function( _data ){
    console.log("Create");

    this.graphics = this.go.game.add.graphics(0, 0);
    this.waves = new Array();

    this.waves.push(new Wave());
    this.waves.push(new Wave(100, 100));
};

WavesManager.prototype.start = function(){  
    console.log("Start");
};

WavesManager.prototype.update = function() {

    this.graphics.clear();

    for (var i=0; i<this.waves.length; ++i) {
        this.waves[i].update();
    }

    for (var i=0; i<this.waves.length; ++i) {
        this.waves[i].render(this.graphics);
    }
};

//////////
// WAVE //
//////////

var Wave = function(_x, _y, _radius) {
    this.x = 0; if (_x) this.x = _x;
    this.y = 0; if (_y) this.y = _y;

    this.radius = 20; if (_radius) this._radius = __radius;
    this.radiusMin = 10;
    this.radiusMax = 100;

    this.lineWidthMin = 1;
    this.lineWidthMax = 10;
    this.lineWidth = this.lineWidthMin;
    this.color = 0xd36705;
    this.alpha = 1;

    this.speed = 1;
};

Wave.prototype.update = function() {
    this.radius += this.speed;

    if (this.radius <= this.radiusMin) {
        this.radius = this.radiusMin;
    } else {
        if (this.radius >= this.radiusMax) {
            this.radius = this.radiusMax;
        }
    }
};

Wave.prototype.render = function(_graphics) {
    _graphics.lineStyle(this.lineWidth, this.color, this.alpha);
    
    // draw a shape
    _graphics.drawCircle(this.x, this.y, this.radius);
};



