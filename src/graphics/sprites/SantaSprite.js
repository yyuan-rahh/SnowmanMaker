import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Santa in a sled sprite
 */
export class SantaSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate Santa in sled sprite
     */
    generate() {
        const key = 'santa_sled';
        const width = 120;
        const height = 80;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;

            // Sled (sleigh)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.moveTo(centerX - 40, 60);
            ctx.lineTo(centerX - 50, 70);
            ctx.lineTo(centerX + 50, 70);
            ctx.lineTo(centerX + 40, 60);
            ctx.closePath();
            ctx.fill();

            // Sled runners
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX - 40, 72, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX + 40, 72, 5, 0, Math.PI * 2);
            ctx.stroke();

            // Santa's body
            ctx.fillStyle = '#DC143C'; // Red suit
            ctx.beginPath();
            ctx.arc(centerX, 45, 18, 0, Math.PI * 2);
            ctx.fill();

            // Santa's head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, 28, 12, 0, Math.PI * 2);
            ctx.fill();

            // Santa's hat
            ctx.fillStyle = '#DC143C';
            ctx.beginPath();
            ctx.moveTo(centerX - 10, 22);
            ctx.lineTo(centerX + 15, 10);
            ctx.lineTo(centerX, 28);
            ctx.closePath();
            ctx.fill();

            // Hat pom-pom
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(centerX + 15, 10, 4, 0, Math.PI * 2);
            ctx.fill();

            // Beard
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(centerX, 32, 8, 0, Math.PI);
            ctx.fill();

            // Eyes
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(centerX - 3, 26, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 3, 26, 2, 0, Math.PI * 2);
            ctx.fill();

            // Belt
            ctx.fillStyle = 'black';
            ctx.fillRect(centerX - 18, 42, 36, 4);
            
            // Belt buckle
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.fillRect(centerX - 4, 40, 8, 8);

            // Arms
            ctx.strokeStyle = '#DC143C';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            // Left arm
            ctx.beginPath();
            ctx.moveTo(centerX - 15, 40);
            ctx.lineTo(centerX - 25, 35);
            ctx.stroke();
            // Right arm
            ctx.beginPath();
            ctx.moveTo(centerX + 15, 40);
            ctx.lineTo(centerX + 25, 35);
            ctx.stroke();

            // Magic sparkles around Santa
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 35;
                const sx = centerX + Math.cos(angle) * dist;
                const sy = 40 + Math.sin(angle) * dist;
                
                ctx.fillStyle = PALETTE.sparkleYellowHex;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        });
    }
}

export default SantaSprite;

