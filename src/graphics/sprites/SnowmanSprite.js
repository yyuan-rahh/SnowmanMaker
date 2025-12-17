import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Snowman sprite - 3-tiered snowman with all collected items
 */
export class SnowmanSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate complete snowman sprite with all items
     */
    generateSnowman(inventory) {
        const key = 'snowman_complete';
        const width = 200;
        const height = 300;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 10;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 80, 20, 0.3);

            // === BOTTOM SNOWBALL (Largest) ===
            const bottomRadius = 50;
            const bottomY = baseY - 20;
            
            // Bottom snowball body
            ctx.fillStyle = PALETTE.snowWhiteHex;
            ctx.beginPath();
            ctx.arc(centerX, bottomY, bottomRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Bottom snowball shading
            const bottomGradient = ctx.createRadialGradient(
                centerX - 15, bottomY - 15, 0,
                centerX, bottomY, bottomRadius
            );
            bottomGradient.addColorStop(0, PALETTE.snowWhiteHex);
            bottomGradient.addColorStop(1, '#E0E0E0');
            ctx.fillStyle = bottomGradient;
            ctx.beginPath();
            ctx.arc(centerX, bottomY, bottomRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Bottom snowball highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(centerX - 15, bottomY - 15, 15, 0, Math.PI * 2);
            ctx.fill();

            // === MIDDLE SNOWBALL ===
            const middleRadius = 35;
            const middleY = bottomY - bottomRadius - middleRadius - 5;
            
            // Middle snowball body
            ctx.fillStyle = PALETTE.snowWhiteHex;
            ctx.beginPath();
            ctx.arc(centerX, middleY, middleRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Middle snowball shading
            const middleGradient = ctx.createRadialGradient(
                centerX - 10, middleY - 10, 0,
                centerX, middleY, middleRadius
            );
            middleGradient.addColorStop(0, PALETTE.snowWhiteHex);
            middleGradient.addColorStop(1, '#E0E0E0');
            ctx.fillStyle = middleGradient;
            ctx.beginPath();
            ctx.arc(centerX, middleY, middleRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Middle snowball highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(centerX - 10, middleY - 10, 12, 0, Math.PI * 2);
            ctx.fill();

            // === TOP SNOWBALL (Smallest) ===
            const topRadius = 25;
            const topY = middleY - middleRadius - topRadius - 5;
            
            // Top snowball body
            ctx.fillStyle = PALETTE.snowWhiteHex;
            ctx.beginPath();
            ctx.arc(centerX, topY, topRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Top snowball shading
            const topGradient = ctx.createRadialGradient(
                centerX - 8, topY - 8, 0,
                centerX, topY, topRadius
            );
            topGradient.addColorStop(0, PALETTE.snowWhiteHex);
            topGradient.addColorStop(1, '#E0E0E0');
            ctx.fillStyle = topGradient;
            ctx.beginPath();
            ctx.arc(centerX, topY, topRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Top snowball highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(centerX - 8, topY - 8, 10, 0, Math.PI * 2);
            ctx.fill();

            // === COAL BUTTONS (on middle snowball) ===
            if (inventory.coal >= 6) {
                ctx.fillStyle = PALETTE.coalBlackHex;
                // 3 buttons down the middle
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(centerX, middleY - 15 + i * 15, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // === COAL EYES (on top snowball) ===
            if (inventory.coal >= 2) {
                ctx.fillStyle = PALETTE.coalBlackHex;
                // Left eye
                ctx.beginPath();
                ctx.arc(centerX - 8, topY - 5, 3, 0, Math.PI * 2);
                ctx.fill();
                // Right eye
                ctx.beginPath();
                ctx.arc(centerX + 8, topY - 5, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            // === COAL SMILE (on top snowball) ===
            if (inventory.coal >= 3) {
                ctx.fillStyle = PALETTE.coalBlackHex;
                ctx.strokeStyle = PALETTE.coalBlackHex;
                ctx.lineWidth = 2;
                ctx.beginPath();
                // Smile arc
                ctx.arc(centerX, topY + 3, 8, 0.3, Math.PI - 0.3);
                ctx.stroke();
                
                // Smile dots (5 dots)
                for (let i = 0; i < 5; i++) {
                    const angle = 0.3 + (i / 4) * (Math.PI - 0.6);
                    const dotX = centerX + Math.cos(angle) * 8;
                    const dotY = topY + 3 + Math.sin(angle) * 8;
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // === CARROT NOSE ===
            if (inventory.carrot >= 1) {
                ctx.fillStyle = PALETTE.carrotOrangeHex;
                // Carrot nose (triangle pointing right)
                ctx.beginPath();
                ctx.moveTo(centerX + 2, topY);
                ctx.lineTo(centerX + 12, topY - 3);
                ctx.lineTo(centerX + 12, topY + 3);
                ctx.closePath();
                ctx.fill();
                
                // Carrot highlight
                ctx.fillStyle = '#FFB84D';
                ctx.beginPath();
                ctx.moveTo(centerX + 4, topY);
                ctx.lineTo(centerX + 10, topY - 2);
                ctx.lineTo(centerX + 10, topY + 2);
                ctx.closePath();
                ctx.fill();
            }

            // === TWIG ARMS ===
            if (inventory.twig >= 2) {
                ctx.strokeStyle = '#8B4513'; // Brown twig color
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                
                // Left arm (pointing up-left)
                ctx.beginPath();
                ctx.moveTo(centerX - middleRadius, middleY - 10);
                ctx.lineTo(centerX - middleRadius - 25, middleY - 30);
                ctx.lineTo(centerX - middleRadius - 30, middleY - 35);
                ctx.stroke();
                
                // Right arm (pointing up-right)
                ctx.beginPath();
                ctx.moveTo(centerX + middleRadius, middleY - 10);
                ctx.lineTo(centerX + middleRadius + 25, middleY - 30);
                ctx.lineTo(centerX + middleRadius + 30, middleY - 35);
                ctx.stroke();
            }

            // === HAT ===
            if (inventory.hat >= 1) {
                const hatY = topY - topRadius - 5;
                
                // Hat brim
                ctx.fillStyle = PALETTE.black;
                ctx.beginPath();
                ctx.ellipse(centerX, hatY, 30, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Hat top
                ctx.fillStyle = PALETTE.black;
                ctx.fillRect(centerX - 12, hatY - 20, 24, 20);
                
                // Hat band
                ctx.fillStyle = '#FFD700'; // Gold band
                ctx.fillRect(centerX - 12, hatY - 8, 24, 4);
            }

            // === SCARF ===
            if (inventory.scarf >= 1) {
                const scarfY = middleY + middleRadius - 5;
                
                // Scarf body
                ctx.fillStyle = '#D94A4A'; // Red scarf
                ctx.fillRect(centerX - 30, scarfY, 60, 8);
                
                // Scarf ends hanging down
                ctx.fillRect(centerX - 30, scarfY + 8, 12, 15);
                ctx.fillRect(centerX + 18, scarfY + 8, 12, 15);
                
                // Scarf stripes
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(centerX - 25, scarfY + 2, 50, 2);
                ctx.fillRect(centerX - 25, scarfY + 6, 50, 2);
            }

            // Outline for depth
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            // Bottom
            ctx.beginPath();
            ctx.arc(centerX, bottomY, bottomRadius, 0, Math.PI * 2);
            ctx.stroke();
            // Middle
            ctx.beginPath();
            ctx.arc(centerX, middleY, middleRadius, 0, Math.PI * 2);
            ctx.stroke();
            // Top
            ctx.beginPath();
            ctx.arc(centerX, topY, topRadius, 0, Math.PI * 2);
            ctx.stroke();
        });
    }
}

export default SnowmanSprite;

