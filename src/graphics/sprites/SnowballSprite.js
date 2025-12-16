import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Hand-painted snowball sprite with shadows and texture
 */
export class SnowballSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate snowball texture at specific size
     */
    generate(radius) {
        const key = `snowball_${radius}`;
        const size = radius * 3;

        return this.createTexture(key, size, size, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // 1. Radial gradient for depth and shading
            const gradient = ctx.createRadialGradient(
                centerX - radius * 0.3, 
                centerY - radius * 0.3, 
                0,
                centerX, 
                centerY, 
                radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.6, PALETTE.snowWhiteHex);
            gradient.addColorStop(1, PALETTE.snowShadowHex);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Subtle texture overlay (snow sparkles)
            const numSparkles = Math.floor(radius / 2);
            for (let i = 0; i < numSparkles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * radius * 0.8;
                const tx = centerX + Math.cos(angle) * dist;
                const ty = centerY + Math.sin(angle) * dist;
                
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                const sparkleSize = 1 + Math.random() * 2;
                ctx.fillRect(tx, ty, sparkleSize, sparkleSize);
            }

            // 3. Subtle highlight on top-left
            const highlight = ctx.createRadialGradient(
                centerX - radius * 0.4,
                centerY - radius * 0.4,
                0,
                centerX - radius * 0.4,
                centerY - radius * 0.4,
                radius * 0.5
            );
            highlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = highlight;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

export default SnowballSprite;

