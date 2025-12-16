import PALETTE from './ColorPalette.js';

/**
 * Base sprite renderer using Canvas API
 * Generates hand-painted style sprites with organic shapes
 */
export class SpriteRenderer {
    constructor(scene) {
        this.scene = scene;
        this.cache = new Map(); // Cache generated textures
    }

    /**
     * Create a texture from a canvas drawing function
     */
    createTexture(key, width, height, drawFunc) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Clear with transparency
        ctx.clearRect(0, 0, width, height);

        // Call the drawing function with proper context
        drawFunc.call(this, ctx, width, height);

        // Add texture to Phaser
        if (!this.scene.textures.exists(key)) {
            this.scene.textures.addCanvas(key, canvas);
        }

        this.cache.set(key, key);
        return key;
    }

    /**
     * Helper: Draw organic circle (not perfect)
     */
    drawOrganicCircle(ctx, x, y, radius, segments = 32) {
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const variance = 0.9 + Math.random() * 0.2; // Random variation
            const r = radius * variance;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
    }

    /**
     * Helper: Draw soft shadow
     */
    drawSoftShadow(ctx, x, y, width, height, opacity = 0.15) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = PALETTE.shadowColor;
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Helper: Add texture noise
     */
    addTextureNoise(ctx, x, y, width, height, density = 0.1) {
        const numDots = Math.floor(width * height * density / 100);
        for (let i = 0; i < numDots; i++) {
            const px = x + Math.random() * width;
            const py = y + Math.random() * height;
            const alpha = 0.1 + Math.random() * 0.2;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(px, py, 1 + Math.random(), 1 + Math.random());
        }
        ctx.globalAlpha = 1;
    }

    /**
     * Helper: Draw layered shape for depth
     */
    drawLayered(ctx, drawFunc, layers = 3, offsetScale = 2) {
        for (let i = layers - 1; i >= 0; i--) {
            const offset = i * offsetScale;
            const alpha = 1 - (i * 0.15);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(offset, offset);
            drawFunc(ctx);
            ctx.restore();
        }
    }

    /**
     * Helper: Draw rounded rectangle (compatible with older browsers)
     */
    drawRoundRect(ctx, x, y, width, height, radius) {
        if (typeof ctx.roundRect === 'function') {
            // Use native if available
            ctx.roundRect(x, y, width, height, radius);
        } else {
            // Fallback for older browsers
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

export default SpriteRenderer;

