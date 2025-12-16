import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Collectible item sprites: carrot, coal, twigs, hat
 */
export class ItemSprites extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate carrot sprite
     */
    generateCarrot() {
        const key = 'item_carrot';
        const size = 40;

        return this.createTexture(key, size, size + 10, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 20, 8, 0.2);

            // Carrot body (triangular with curve)
            ctx.fillStyle = PALETTE.carrotOrangeHex;
            ctx.beginPath();
            ctx.moveTo(centerX, baseY - 25);  // Top
            ctx.quadraticCurveTo(centerX + 8, baseY - 12, centerX + 6, baseY);  // Right
            ctx.lineTo(centerX - 6, baseY);  // Bottom
            ctx.quadraticCurveTo(centerX - 8, baseY - 12, centerX, baseY - 25);  // Left
            ctx.closePath();
            ctx.fill();

            // Carrot lines/texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const y = baseY - 5 - i * 5;
                ctx.beginPath();
                ctx.moveTo(centerX - 4, y);
                ctx.lineTo(centerX + 4, y);
                ctx.stroke();
            }

            // Green leafy top
            ctx.fillStyle = PALETTE.carrotGreenHex;
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI - Math.PI / 2;
                const leafLength = 8 + Math.random() * 4;
                ctx.beginPath();
                ctx.moveTo(centerX, baseY - 24);
                ctx.lineTo(centerX + Math.cos(angle) * leafLength, baseY - 24 - Math.sin(angle) * leafLength);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    /**
     * Generate coal sprite
     */
    generateCoal() {
        const key = 'item_coal';
        const size = 30;

        return this.createTexture(key, size, size, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Shadow
            this.drawSoftShadow(ctx, centerX, centerY + 8, 18, 6, 0.2);

            // Irregular coal shape
            ctx.fillStyle = PALETTE.coalBlackHex;
            this.drawOrganicCircle(ctx, centerX, centerY, 10, 8);
            ctx.fill();

            // Shine highlight
            const gradient = ctx.createRadialGradient(
                centerX - 3, centerY - 3, 0,
                centerX - 3, centerY - 3, 8
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Generate twig/stick sprite
     */
    generateTwig() {
        const key = 'item_twig';
        const width = 50;
        const height = 20;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const startX = 5;
            const startY = h / 2;
            const endX = w - 5;
            const endY = h / 2;

            // Shadow
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.strokeStyle = PALETTE.shadowColor;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(startX, startY + 3);
            ctx.lineTo(endX, endY + 3);
            ctx.stroke();
            ctx.restore();

            // Main stick
            ctx.strokeStyle = PALETTE.twigBrownHex;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            // Slight curve with irregularities
            const midX = w / 2;
            ctx.quadraticCurveTo(midX, startY - 2, endX, endY);
            ctx.stroke();

            // Small branch stubs
            ctx.lineWidth = 2;
            // Stub 1
            ctx.beginPath();
            ctx.moveTo(startX + 12, startY);
            ctx.lineTo(startX + 8, startY - 6);
            ctx.stroke();
            
            // Stub 2
            ctx.beginPath();
            ctx.moveTo(startX + 28, startY);
            ctx.lineTo(startX + 30, startY + 5);
            ctx.stroke();

            // Texture lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const x = startX + 10 + i * 6;
                ctx.beginPath();
                ctx.moveTo(x, startY - 2);
                ctx.lineTo(x + 2, startY + 2);
                ctx.stroke();
            }
        });
    }

    /**
     * Generate top hat sprite
     */
    generateHat() {
        const key = 'item_hat';
        const width = 50;
        const height = 45;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY + 2, 40, 12, 0.2);

            // Hat brim (ellipse)
            ctx.fillStyle = PALETTE.hatBlackHex;
            ctx.beginPath();
            ctx.ellipse(centerX, baseY, 20, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Hat body (rounded rectangle)
            const hatWidth = 24;
            const hatHeight = 28;
            ctx.fillStyle = PALETTE.hatBrownHex;
            this.drawRoundRect(ctx, centerX - hatWidth/2, baseY - hatHeight, hatWidth, hatHeight, 2);
            ctx.fill();

            // Hat band
            ctx.fillStyle = PALETTE.hatBlackHex;
            ctx.fillRect(centerX - hatWidth/2, baseY - 10, hatWidth, 4);

            // Add highlight on hat
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.drawRoundRect(ctx, centerX - hatWidth/2 + 2, baseY - hatHeight + 2, 8, hatHeight - 4, 2);
            ctx.fill();

            // Texture
            this.addTextureNoise(ctx, centerX - hatWidth/2, baseY - hatHeight, hatWidth, hatHeight, 0.05);
        });
    }

    /**
     * Generate all item sprites
     */
    generateAll() {
        this.generateCarrot();
        this.generateCoal();
        this.generateTwig();
        this.generateHat();
    }
}

export default ItemSprites;

