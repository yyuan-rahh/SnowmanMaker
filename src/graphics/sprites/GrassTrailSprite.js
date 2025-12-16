import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Brush-stroke style grass trail particles
 */
export class GrassTrailSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate grass trail texture
     * These should look like organic brush strokes, not perfect circles
     */
    generate() {
        const key = 'grass_trail';
        const size = 60;

        return this.createTexture(key, size, size, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Draw multiple overlapping irregular organic shapes
            const numBlobs = 5;
            
            ctx.globalAlpha = 0.6;
            
            for (let i = 0; i < numBlobs; i++) {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                const blobSize = 12 + Math.random() * 12;
                
                // Alternate between grass shades
                const colorChoice = Math.random();
                if (colorChoice < 0.4) {
                    ctx.fillStyle = PALETTE.grassDarkHex;
                } else if (colorChoice < 0.7) {
                    ctx.fillStyle = PALETTE.grassMediumHex;
                } else {
                    ctx.fillStyle = '#8AB066'; // In-between shade
                }
                
                // Draw organic blob shape
                ctx.beginPath();
                const points = 8;
                for (let j = 0; j <= points; j++) {
                    const angle = (j / points) * Math.PI * 2;
                    const variance = 0.7 + Math.random() * 0.6;
                    const r = blobSize * variance;
                    const x = centerX + offsetX + Math.cos(angle) * r;
                    const y = centerY + offsetY + Math.sin(angle) * r;
                    
                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
            }

            // Add some darker spots for texture
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 10; i++) {
                const offsetX = (Math.random() - 0.5) * 30;
                const offsetY = (Math.random() - 0.5) * 30;
                const spotSize = 2 + Math.random() * 3;
                
                ctx.fillStyle = PALETTE.grassDarkHex;
                ctx.beginPath();
                ctx.arc(centerX + offsetX, centerY + offsetY, spotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}

export default GrassTrailSprite;

