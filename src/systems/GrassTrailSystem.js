import CONFIG from '../config.js';

/**
 * Grass trail system - creates permanent brush-stroke trails behind moving snowballs
 */
export class GrassTrailSystem {
    constructor(scene) {
        this.scene = scene;
        this.trails = []; // Permanent trails - never removed
    }

    /**
     * Spawn trail particle at position
     */
    spawnTrail(x, y) {
        // Create permanent trail sprite
        const trail = this.scene.add.sprite(x, y, 'grass_trail');
        trail.setAlpha(0.6);
        trail.setDepth(-9000); // Above terrain (-10000), below everything else
        trail.setScale(0.8 + Math.random() * 0.4);
        trail.setRotation(Math.random() * Math.PI * 2);

        const trailData = {
            sprite: trail
        };

        this.trails.push(trailData);
    }

    /**
     * Update all trails (permanent trails don't need updates)
     */
    update() {
        // Trails are permanent, no need to update them
        // They maintain their position and appearance
    }

    /**
     * Check if enough time has passed to spawn new trail
     */
    shouldSpawnTrail(snowball) {
        if (!snowball.isMoving()) return false;
        
        const currentTime = this.scene.time.now;
        if (currentTime - snowball.lastTrailTime > CONFIG.trail.spawnInterval) {
            snowball.lastTrailTime = currentTime;
            return true;
        }
        return false;
    }

    /**
     * Clear all trails
     */
    clear() {
        this.trails.forEach(trail => {
            if (trail.sprite) {
                trail.sprite.destroy();
            }
        });
        this.trails = [];
    }

    /**
     * Destroy system
     */
    destroy() {
        this.clear();
    }
}

export default GrassTrailSystem;

