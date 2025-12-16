import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Character sprite - man sitting on bench
 */
export class CharacterSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate bench sprite
     */
    generateBench() {
        const key = 'bench';
        const width = 80;
        const height = 50;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 70, 15, 0.2);

            // Bench legs
            ctx.fillStyle = PALETTE.benchDarkHex;
            ctx.fillRect(centerX - 25, baseY - 15, 6, 15);
            ctx.fillRect(centerX + 19, baseY - 15, 6, 15);

            // Bench seat
            ctx.fillStyle = PALETTE.benchWoodHex;
            this.drawRoundRect(ctx, centerX - 30, baseY - 20, 60, 8, 2);
            ctx.fill();

            // Bench back
            ctx.fillRect(centerX - 28, baseY - 40, 4, 22);
            ctx.fillRect(centerX + 24, baseY - 40, 4, 22);
            this.drawRoundRect(ctx, centerX - 30, baseY - 42, 60, 6, 2);
            ctx.fill();

            // Wood texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(centerX - 28, baseY - 18 + i * 2);
                ctx.lineTo(centerX + 28, baseY - 18 + i * 2);
                ctx.stroke();
            }
        });
    }

    /**
     * Generate man sitting on bench
     */
    generateMan() {
        const key = 'man_sitting';
        const width = 60;
        const height = 80;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 10;

            // Legs (sitting position)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            ctx.fillRect(centerX - 12, baseY - 20, 10, 18);
            ctx.fillRect(centerX + 2, baseY - 20, 10, 18);

            // Body
            ctx.fillStyle = PALETTE.clothingBrownHex;
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 30, 16, 20, 0, 0, Math.PI * 2);
            ctx.fill();

            // Arms (resting on lap)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            // Left arm
            ctx.beginPath();
            ctx.arc(centerX - 12, baseY - 28, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 15, baseY - 28, 6, 15);
            // Right arm
            ctx.beginPath();
            ctx.arc(centerX + 12, baseY - 28, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX + 9, baseY - 28, 6, 15);

            // Head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 48, 12, 0, Math.PI * 2);
            ctx.fill();

            // Simple face
            // Eyes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX - 4, baseY - 50, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 4, baseY - 50, 2, 0, Math.PI * 2);
            ctx.fill();

            // Smile
            ctx.strokeStyle = PALETTE.coalBlackHex;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 48, 6, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // Hat on head
            const hatSize = 16;
            // Hat brim
            ctx.fillStyle = PALETTE.hatBlackHex;
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 58, hatSize * 0.8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Hat body
            ctx.fillStyle = PALETTE.hatBrownHex;
            this.drawRoundRect(ctx, centerX - hatSize/2, baseY - 75, hatSize, 18, 2);
            ctx.fill();

            // Hat band
            ctx.fillStyle = PALETTE.hatBlackHex;
            ctx.fillRect(centerX - hatSize/2, baseY - 62, hatSize, 3);
        });
    }

    /**
     * Generate all character sprites
     */
    generateAll() {
        this.generateBench();
        this.generateMan();
    }
}

export default CharacterSprite;

