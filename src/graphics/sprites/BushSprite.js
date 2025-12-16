import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Fluffy, organic bush clusters for room walls
 */
export class BushSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate single bush cluster
     */
    generate(width = 80, height = 60) {
        const key = `bush_${width}x${height}`;

        return this.createTexture(key, width + 20, height + 20, (ctx, w, h) => {
            const offsetX = 10;
            const offsetY = 10;

            // Shadow first
            this.drawSoftShadow(ctx, offsetX + width/2, offsetY + height + 5, width * 0.8, height * 0.3, 0.2);

            // Multiple overlapping circles for fluffy, organic look
            const numCircles = 10 + Math.floor(Math.random() * 6);
            
            for (let i = 0; i < numCircles; i++) {
                const cx = offsetX + Math.random() * width;
                const cy = offsetY + Math.random() * height;
                const radius = 15 + Math.random() * 18;
                
                // Alternate between bush shades
                ctx.fillStyle = i % 2 === 0 ? PALETTE.bushDarkHex : PALETTE.bushLightHex;
                ctx.globalAlpha = 0.75 + Math.random() * 0.25;
                
                // Draw organic circle
                this.drawOrganicCircle(ctx, cx, cy, radius, 16);
                ctx.fill();
            }

            // Add darker texture spots for depth
            ctx.globalAlpha = 1;
            const numSpots = 25;
            for (let i = 0; i < numSpots; i++) {
                const tx = offsetX + Math.random() * width;
                const ty = offsetY + Math.random() * height;
                const spotSize = 2 + Math.random() * 3;
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.globalAlpha = 0.3 + Math.random() * 0.3;
                ctx.beginPath();
                ctx.arc(tx, ty, spotSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // Add some lighter highlights
            ctx.globalAlpha = 1;
            for (let i = 0; i < 8; i++) {
                const tx = offsetX + Math.random() * width;
                const ty = offsetY + Math.random() * height;
                const highlightSize = 3 + Math.random() * 4;
                
                ctx.fillStyle = PALETTE.grassLightHex;
                ctx.globalAlpha = 0.2 + Math.random() * 0.2;
                ctx.beginPath();
                ctx.arc(tx, ty, highlightSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}

export default BushSprite;

