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
     * Generate carrot sprite (inverted triangle with green leaves on top)
     */
    generateCarrot() {
        const key = 'item_carrot';
        const size = 45;

        return this.createTexture(key, size, size + 15, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 20, 8, 0.2);

            // Green leaves at the top (bushy cluster)
            ctx.fillStyle = PALETTE.carrotGreenHex;
            
            // Multiple leaf shapes
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const leafX = centerX + Math.cos(angle) * 8;
                const leafY = h - 35 + Math.sin(angle) * 6;
                
                // Leaf shape (elongated oval)
                ctx.save();
                ctx.translate(leafX, leafY);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                // Leaf vein
                ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, h - 35);
                ctx.lineTo(leafX, leafY);
                ctx.stroke();
            }

            // Central leaf cluster
            ctx.fillStyle = PALETTE.carrotGreenHex;
            ctx.beginPath();
            ctx.arc(centerX, h - 35, 6, 0, Math.PI * 2);
            ctx.fill();

            // Inverted triangle carrot body (wide at top, point at bottom)
            ctx.fillStyle = PALETTE.carrotOrangeHex;
            ctx.beginPath();
            ctx.moveTo(centerX - 12, h - 35);  // Top-left (wide part)
            ctx.lineTo(centerX + 12, h - 35);  // Top-right (wide part)
            ctx.lineTo(centerX, baseY - 2);    // Bottom point
            ctx.closePath();
            ctx.fill();

            // Carrot texture lines (horizontal)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const y = h - 32 + i * 5;
                const width = 12 - (i * 2.4); // Gets narrower toward bottom
                ctx.beginPath();
                ctx.moveTo(centerX - width, y);
                ctx.lineTo(centerX + width, y);
                ctx.stroke();
            }

            // Highlight on carrot
            const gradient = ctx.createLinearGradient(centerX - 8, h - 35, centerX - 2, h - 35);
            gradient.addColorStop(0, 'rgba(255, 200, 100, 0.4)');
            gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(centerX - 10, h - 35);
            ctx.lineTo(centerX - 5, h - 35);
            ctx.lineTo(centerX - 3, baseY - 2);
            ctx.closePath();
            ctx.fill();
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

