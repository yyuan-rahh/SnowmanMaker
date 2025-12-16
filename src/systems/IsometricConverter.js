import CONFIG from '../config.js';

/**
 * Isometric coordinate conversion and depth sorting
 */
export class IsometricConverter {
    constructor() {
        this.tileWidth = CONFIG.iso.tileWidth;
        this.tileHeight = CONFIG.iso.tileHeight;
    }

    /**
     * Convert cartesian (world) coordinates to isometric screen coordinates
     */
    cartToIso(cartX, cartY) {
        const isoX = (cartX - cartY) * (this.tileWidth / 2);
        const isoY = (cartX + cartY) * (this.tileHeight / 2);
        return { x: isoX, y: isoY };
    }

    /**
     * Convert isometric screen coordinates to cartesian (world) coordinates
     */
    isoToCart(isoX, isoY) {
        const cartX = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
        const cartY = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
        return { x: cartX, y: cartY };
    }

    /**
     * Get depth value for sorting (objects with higher Y should be drawn later/in front)
     */
    getDepth(cartX, cartY) {
        // In isometric view, depth is primarily determined by Y position
        // Objects further down (higher Y) should be drawn on top
        return cartY * 10 + cartX * 0.1;
    }

    /**
     * Sort game objects by depth for proper layering
     */
    sortByDepth(objects) {
        return objects.sort((a, b) => {
            const depthA = this.getDepth(a.x, a.y);
            const depthB = this.getDepth(b.x, b.y);
            return depthA - depthB;
        });
    }

    /**
     * Apply depth to a Phaser game object
     */
    applyDepth(gameObject) {
        const depth = this.getDepth(gameObject.x, gameObject.y);
        gameObject.setDepth(depth);
    }
}

export default IsometricConverter;

