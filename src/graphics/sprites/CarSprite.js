import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Generates hand-painted car sprites
 */
export class CarSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate all car variations
     */
    generateAll() {
        this.generateRedCar();
        this.generateBlueCar();
        this.generateYellowCar();
    }

    /**
     * Generate red car sprite
     */
    generateRedCar() {
        const key = 'car_red';
        const width = 160;
        const height = 100;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Car body (scaled 2x)
            ctx.fillStyle = PALETTE.redBright;
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.fill();

            // Car roof/cabin
            ctx.fillStyle = PALETTE.redBright;
            ctx.beginPath();
            ctx.moveTo(centerX - 30, centerY - 16);
            ctx.lineTo(centerX - 20, centerY - 36);
            ctx.lineTo(centerX + 20, centerY - 36);
            ctx.lineTo(centerX + 30, centerY - 16);
            ctx.closePath();
            ctx.fill();

            // Windows
            ctx.fillStyle = '#87CEEB';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(centerX - 24, centerY - 18);
            ctx.lineTo(centerX - 16, centerY - 32);
            ctx.lineTo(centerX + 16, centerY - 32);
            ctx.lineTo(centerX + 24, centerY - 18);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Wheels (2x size)
            ctx.fillStyle = PALETTE.black;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.fill();

            // Wheel rims
            ctx.fillStyle = PALETTE.brownMedium;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.fill();

            // Headlights (2x size)
            ctx.fillStyle = '#FFFF99';
            ctx.fillRect(centerX + 56, centerY - 10, 8, 6);
            ctx.fillRect(centerX + 56, centerY + 4, 8, 6);

            // Outline for depth
            ctx.strokeStyle = PALETTE.black;
            ctx.lineWidth = 2.5;
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.stroke();
        });
    }

    /**
     * Generate blue car sprite
     */
    generateBlueCar() {
        const key = 'car_blue';
        const width = 160;
        const height = 100;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Car body (scaled 2x)
            ctx.fillStyle = '#4169E1';
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.fill();

            // Car roof/cabin
            ctx.fillStyle = '#4169E1';
            ctx.beginPath();
            ctx.moveTo(centerX - 30, centerY - 16);
            ctx.lineTo(centerX - 20, centerY - 36);
            ctx.lineTo(centerX + 20, centerY - 36);
            ctx.lineTo(centerX + 30, centerY - 16);
            ctx.closePath();
            ctx.fill();

            // Windows
            ctx.fillStyle = '#87CEEB';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(centerX - 24, centerY - 18);
            ctx.lineTo(centerX - 16, centerY - 32);
            ctx.lineTo(centerX + 16, centerY - 32);
            ctx.lineTo(centerX + 24, centerY - 18);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Wheels (2x size)
            ctx.fillStyle = PALETTE.black;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.fill();

            // Wheel rims
            ctx.fillStyle = PALETTE.brownMedium;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.fill();

            // Headlights (2x size)
            ctx.fillStyle = '#FFFF99';
            ctx.fillRect(centerX + 56, centerY - 10, 8, 6);
            ctx.fillRect(centerX + 56, centerY + 4, 8, 6);

            // Outline
            ctx.strokeStyle = PALETTE.black;
            ctx.lineWidth = 2.5;
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.stroke();
        });
    }

    /**
     * Generate yellow car sprite
     */
    generateYellowCar() {
        const key = 'car_yellow';
        const width = 160;
        const height = 100;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Car body (scaled 2x)
            ctx.fillStyle = '#FFD700';
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.fill();

            // Car roof/cabin
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(centerX - 30, centerY - 16);
            ctx.lineTo(centerX - 20, centerY - 36);
            ctx.lineTo(centerX + 20, centerY - 36);
            ctx.lineTo(centerX + 30, centerY - 16);
            ctx.closePath();
            ctx.fill();

            // Windows
            ctx.fillStyle = '#87CEEB';
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(centerX - 24, centerY - 18);
            ctx.lineTo(centerX - 16, centerY - 32);
            ctx.lineTo(centerX + 16, centerY - 32);
            ctx.lineTo(centerX + 24, centerY - 18);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Wheels (2x size)
            ctx.fillStyle = PALETTE.black;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 12, 0, Math.PI * 2);
            ctx.fill();

            // Wheel rims
            ctx.fillStyle = PALETTE.brownMedium;
            ctx.beginPath();
            ctx.arc(centerX - 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.arc(centerX + 36, centerY + 16, 6, 0, Math.PI * 2);
            ctx.fill();

            // Headlights (2x size)
            ctx.fillStyle = '#FFFF99';
            ctx.fillRect(centerX + 56, centerY - 10, 8, 6);
            ctx.fillRect(centerX + 56, centerY + 4, 8, 6);

            // Outline
            ctx.strokeStyle = PALETTE.black;
            ctx.lineWidth = 2.5;
            this.drawRoundRect(ctx, centerX - 60, centerY - 16, 120, 32, 8);
            ctx.stroke();
        });
    }
}

export default CarSprite;

