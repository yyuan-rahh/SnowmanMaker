import CONFIG from '../config.js';
import { SnowballSprite } from '../graphics/sprites/SnowballSprite.js';

/**
 * Snowball entity with rolling physics and growth mechanics
 */
export class Snowball {
    constructor(scene, x, y, id) {
        this.scene = scene;
        this.id = id;
        this.startX = x;
        this.startY = y;
        
        // Create sprite generator
        this.spriteGen = new SnowballSprite(scene);
        
        // Snowball properties
        this.radius = CONFIG.snowball.startRadius;
        this.scale = 1.0;
        this.distanceTraveled = 0;
        this.rotation = 0;
        
        // Generate initial texture
        const textureKey = this.spriteGen.generate(this.radius);
        
        // Create shadow sprite (doesn't rotate)
        const shadowWidth = this.radius * 2.2;
        const shadowHeight = this.radius * 0.5;
        this.shadow = scene.add.ellipse(x, y + this.radius * 0.7, shadowWidth, shadowHeight, 0x000000, 0.15);
        this.shadow.setDepth(y * 10 - 2); // Below everything
        
        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, textureKey);
        this.sprite.setScale(1);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDrag(CONFIG.snowball.friction * 1000);
        
        // Set circular physics body
        this.sprite.body.setCircle(this.radius);
        this.sprite.body.setOffset(
            (this.sprite.width - this.radius * 2) / 2,
            (this.sprite.height - this.radius * 2) / 2
        );
        
        // Custom properties
        this.sprite.snowballData = this;
        this.isActive = false;
        
        // Trail tracking
        this.lastTrailTime = 0;
        this.lastPosition = { x, y };
    }

    /**
     * Set whether this snowball is player-controlled
     */
    setActive(active) {
        this.isActive = active;
        if (active) {
            this.sprite.setTint(0xffffff);
        } else {
            this.sprite.setTint(0xcccccc);
        }
    }

    /**
     * Update snowball each frame
     */
    update(time, delta) {
        // Calculate distance traveled this frame
        const dx = this.sprite.x - this.lastPosition.x;
        const dy = this.sprite.y - this.lastPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0.1) {
            this.distanceTraveled += distance;
            
            // Rolling rotation (no slip condition)
            const rotationDelta = distance / this.radius;
            this.rotation += rotationDelta;
            this.sprite.setRotation(this.rotation);
            
            // Grow the snowball
            this.grow();
        }
        
        // Update shadow position and size (follows snowball but doesn't rotate)
        const shadowWidth = this.radius * 2.2;
        const shadowHeight = this.radius * 0.5;
        this.shadow.setPosition(this.sprite.x, this.sprite.y + this.radius * 0.7);
        this.shadow.setSize(shadowWidth, shadowHeight);
        this.shadow.setDepth(this.sprite.y * 10 - 2); // Always below
        
        // Update depth for isometric layering
        this.sprite.setDepth(this.sprite.y * 10);
        
        // Store last position
        this.lastPosition.x = this.sprite.x;
        this.lastPosition.y = this.sprite.y;
    }

    /**
     * Grow the snowball based on distance traveled
     */
    grow() {
        const newScale = 1.0 + (this.distanceTraveled * CONFIG.snowball.growthRate);
        
        // Cap at max size
        const maxScale = CONFIG.snowball.maxRadius / CONFIG.snowball.startRadius;
        this.scale = Math.min(newScale, maxScale);
        
        this.radius = CONFIG.snowball.startRadius * this.scale;
        
        // Update sprite scale
        this.sprite.setScale(this.scale);
        
        // Update physics body size for proper collision detection
        // This allows snowball to pass through gaps when small enough
        const bodyRadius = this.radius;
        this.sprite.body.setCircle(bodyRadius / this.scale); // Divide by scale since sprite is scaled
        this.sprite.body.setOffset(
            (this.sprite.width - bodyRadius * 2 / this.scale) / 2,
            (this.sprite.height - bodyRadius * 2 / this.scale) / 2
        );
    }

    /**
     * Handle movement input
     */
    handleInput(cursors, wasd) {
        if (!this.isActive) return;
        
        const speed = CONFIG.snowball.speed;
        let velocityX = 0;
        let velocityY = 0;
        
        // Check keyboard input
        if (cursors.left.isDown || wasd.a.isDown) {
            velocityX = -speed;
        } else if (cursors.right.isDown || wasd.d.isDown) {
            velocityX = speed;
        }
        
        if (cursors.up.isDown || wasd.w.isDown) {
            velocityY = -speed;
        } else if (cursors.down.isDown || wasd.s.isDown) {
            velocityY = speed;
        }
        
        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }
        
        this.sprite.setVelocity(velocityX, velocityY);
    }

    /**
     * Get snowball position
     */
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }

    /**
     * Get current size/scale
     */
    getScale() {
        return this.scale;
    }

    /**
     * Check if snowball is moving
     */
    isMoving() {
        const vel = this.sprite.body.velocity;
        return Math.abs(vel.x) > 1 || Math.abs(vel.y) > 1;
    }

    /**
     * Destroy snowball
     */
    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.shadow) {
            this.shadow.destroy();
        }
    }
}

export default Snowball;

