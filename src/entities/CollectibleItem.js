import CONFIG from '../config.js';

/**
 * Collectible item entity
 */
export class CollectibleItem {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type; // 'carrot', 'coal', 'twig', 'hat'
        this.x = x;
        this.y = y;
        this.collected = false;
        
        // Get texture key based on type
        const textureKey = `item_${type}`;
        
        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, textureKey);
        this.sprite.setScale(1);
        
        // Store reference
        this.sprite.itemData = this;
        
        // Gentle bobbing animation
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 2000 + Math.random() * 1000;
        this.bobAmount = 3;
        
        // Size requirement for collection
        this.requiredSize = CONFIG.itemRequirements[type];
    }

    /**
     * Update item each frame
     */
    update(time) {
        if (!this.collected) {
            // Bobbing animation
            const bob = Math.sin((time / this.bobSpeed) + this.bobOffset) * this.bobAmount;
            this.sprite.y = this.y + bob;
            
            // Update depth
            this.sprite.setDepth(this.y * 10 + 5); // +5 to be slightly above ground
        }
    }

    /**
     * Check if snowball can collect this item
     */
    canCollect(snowballScale) {
        return !this.collected && snowballScale >= this.requiredSize;
    }

    /**
     * Collect the item
     */
    collect() {
        if (this.collected) return;
        
        this.collected = true;
        
        // Remove sprite
        this.sprite.destroy();
    }

    /**
     * Destroy item
     */
    destroy() {
        if (this.sprite && !this.sprite.scene) {
            this.sprite.destroy();
        }
    }

    /**
     * Get position
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
}

export default CollectibleItem;

