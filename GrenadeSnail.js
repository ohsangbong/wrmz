// ======
// GrenadeSnail
// ======

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function GrenadeSnail(descr) {
    // Common inherited setup logic from Entity
    this.setup(descr);
  
    this.ammo = 10;
    this.scalablePower = true;
    
    this.sprite = g_sprites.GrenadeSnail;
    this.weaponSprite = this.sprite;

    this.width = this.sprite.width; 
    this.height = this.sprite.height; 
    this.weaponSprite.offsetX = 5;
    this.weaponSprite.offsetY = 5;
}

GrenadeSnail.prototype = new Weapon();

// HACKED-IN AUDIO (no preloading)
GrenadeSnail.prototype.impactSound = new Audio(
    "sounds/grenadeImpact.wav");
    GrenadeSnail.prototype.fireSound = new Audio(
    "sounds/grenadeExploding.wav");
    
// Initial, inheritable, default values
GrenadeSnail.prototype.name = 'GrenadeSnail';
GrenadeSnail.prototype.damageRadius = 50;
GrenadeSnail.prototype.countdown = 5;

GrenadeSnail.prototype.update = function (du) {
    spatialManager.unregister(this);

    entityManager._map[0].focusOn(this.cx, this.cy)
    
    this.countdown -= du/SECS_TO_NOMINALS;

    // explode when the countdown ends
    if(this.countdown < 0) {
        this.fireSound.play();
        this.damageMap();
        this.damageWorms();
        return entityManager.KILL_ME_NOW;
    }

    this.move(du);
    
    spatialManager.register(this);

};

GrenadeSnail.prototype.move = function (du) {

    this.velY += this.computeGravity() * du;

    var nextX = this.cx + this.velX * du;
    var nextY = this.cy + this.velY * du; 
    
    // Check if it has landed on the map
    var mapHit = entityManager._map[0].circleCollidesWithMap(nextX, nextY, 1);
    if(mapHit) {
        // only play the impact sound once 
        if(this.velX != 0 && this.velY != 0) this.impactSound.play();
        
        // make the grenade stop moving
        this.velX = 0;
        this.velY = 0;
    }

    // Apply changes in position
    this.cx = this.cx + this.velX * du;
    this.cy = this.cy + this.velY * du;
};


var NOMINAL_GRAVITY = 0.2;

GrenadeSnail.prototype.computeGravity = function () {
    return NOMINAL_GRAVITY;
};

GrenadeSnail.prototype.fire = function(cx, cy, rotation, power) {
    // unit vector components in the distance of 'rotation'
    var dX = Math.sin(rotation);
    var dY = -Math.cos(rotation);

    // Calculate the velocity, and fire weapon
    this.velX = dX*power*10;
    this.velY = dY*power*10;

    entityManager.fireWeapon(
        cx + dX, cy + dY,
        this.velX, this.velY,
        rotation,
        this.name);

    this.ammo--;
    entityManager._timer = this.countdown + 3;
};

GrenadeSnail.prototype.render = function(ctx) {
    Weapon.prototype.render.call(this, ctx);
    Weapon.prototype.renderCountdown.call(this, ctx);
};