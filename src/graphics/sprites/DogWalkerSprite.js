import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Dog walker sprite - person with scarf walking a dog
 */
export class DogWalkerSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate person with scarf walking - Frame 1
     */
    generatePerson() {
        const key = 'person_with_scarf';
        const width = 50;
        const height = 90;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 40, 12, 0.2);

            // Legs (walking position - one forward, one back)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            // Back leg
            ctx.fillRect(centerX - 8, baseY - 30, 8, 30);
            // Front leg
            ctx.fillRect(centerX + 2, baseY - 28, 8, 28);

            // Shoes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.fillRect(centerX - 10, baseY - 5, 12, 5);
            ctx.fillRect(centerX + 0, baseY - 3, 12, 3);

            // Body (coat)
            ctx.fillStyle = '#4A6FA5'; // Blue coat
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 40, 14, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Arms
            ctx.fillStyle = '#4A6FA5';
            // Left arm (holding leash)
            ctx.beginPath();
            ctx.arc(centerX - 10, baseY - 38, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 13, baseY - 38, 5, 12);
            // Right arm (swinging)
            ctx.beginPath();
            ctx.arc(centerX + 10, baseY - 40, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX + 9, baseY - 40, 5, 15);

            // Head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 10, 0, Math.PI * 2);
            ctx.fill();

            // Simple face
            // Eyes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX - 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Smile
            ctx.strokeStyle = PALETTE.coalBlackHex;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 5, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // Scarf (wrapped around neck)
            ctx.fillStyle = '#D94A4A'; // Red scarf
            // Scarf around neck
            ctx.fillRect(centerX - 12, baseY - 52, 24, 6);
            // Scarf hanging down
            ctx.fillRect(centerX - 10, baseY - 48, 5, 12);
            ctx.fillRect(centerX + 5, baseY - 48, 5, 10);
            
            // Scarf stripes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(centerX - 10, baseY - 50, 5, 2);
            ctx.fillRect(centerX + 5, baseY - 46, 5, 2);

            // Hair
            ctx.fillStyle = '#6B5346';
            ctx.beginPath();
            ctx.arc(centerX - 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX, baseY - 67, 8, 0, Math.PI);
            ctx.fill();
        });
    }

    /**
     * Generate dog sprite
     */
    generateDog() {
        const key = 'dog';
        const width = 45;
        const height = 40;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 35, 10, 0.2);

            // Dog body (golden retriever color)
            ctx.fillStyle = '#D4A574';
            
            // Back legs
            ctx.fillRect(centerX - 10, baseY - 12, 5, 12);
            ctx.fillRect(centerX - 3, baseY - 12, 5, 12);
            
            // Body
            ctx.beginPath();
            ctx.ellipse(centerX + 3, baseY - 16, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Front legs
            ctx.fillRect(centerX + 8, baseY - 10, 4, 10);
            ctx.fillRect(centerX + 14, baseY - 10, 4, 10);
            
            // Head
            ctx.beginPath();
            ctx.ellipse(centerX + 15, baseY - 20, 7, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Ears
            ctx.beginPath();
            ctx.ellipse(centerX + 12, baseY - 22, 3, 5, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(centerX + 18, baseY - 22, 3, 5, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Nose
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX + 19, baseY - 19, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye
            ctx.beginPath();
            ctx.arc(centerX + 17, baseY - 21, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Tail (curved up)
            ctx.fillStyle = '#D4A574';
            ctx.beginPath();
            ctx.arc(centerX - 8, baseY - 18, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 10, baseY - 18, 5, 8);
        });
    }

    /**
     * Generate leash connecting person and dog
     */
    generateLeash() {
        const key = 'leash';
        const width = 80;
        const height = 10;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            // Simple brown leash line
            ctx.strokeStyle = '#6B5346';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        });
    }

    /**
     * Generate person with scarf walking - Frame 2 (opposite leg forward)
     */
    generatePerson2() {
        const key = 'person_with_scarf_2';
        const width = 50;
        const height = 90;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 40, 12, 0.2);

            // Legs (walking position - opposite of frame 1)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            // Back leg (right)
            ctx.fillRect(centerX + 2, baseY - 30, 8, 30);
            // Front leg (left)
            ctx.fillRect(centerX - 8, baseY - 28, 8, 28);

            // Shoes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.fillRect(centerX + 0, baseY - 5, 12, 5);
            ctx.fillRect(centerX - 10, baseY - 3, 12, 3);

            // Body (coat)
            ctx.fillStyle = '#4A6FA5'; // Blue coat
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 40, 14, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Arms (opposite swing)
            ctx.fillStyle = '#4A6FA5';
            // Left arm (swinging back)
            ctx.beginPath();
            ctx.arc(centerX - 10, baseY - 40, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 13, baseY - 40, 5, 15);
            // Right arm (forward with leash)
            ctx.beginPath();
            ctx.arc(centerX + 10, baseY - 38, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX + 9, baseY - 38, 5, 12);

            // Head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 10, 0, Math.PI * 2);
            ctx.fill();

            // Simple face
            // Eyes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX - 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Smile
            ctx.strokeStyle = PALETTE.coalBlackHex;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 5, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // Scarf (wrapped around neck)
            ctx.fillStyle = '#D94A4A'; // Red scarf
            // Scarf around neck
            ctx.fillRect(centerX - 12, baseY - 52, 24, 6);
            // Scarf hanging down
            ctx.fillRect(centerX - 10, baseY - 48, 5, 12);
            ctx.fillRect(centerX + 5, baseY - 48, 5, 10);
            
            // Scarf stripes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(centerX - 10, baseY - 50, 5, 2);
            ctx.fillRect(centerX + 5, baseY - 46, 5, 2);

            // Hair
            ctx.fillStyle = '#6B5346';
            ctx.beginPath();
            ctx.arc(centerX - 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX, baseY - 67, 8, 0, Math.PI);
            ctx.fill();
        });
    }

    /**
     * Generate scarf item (collectible)
     */
    generateScarf() {
        const key = 'item_scarf';
        const width = 60;
        const height = 50;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const centerY = h / 2;

            // Shadow
            this.drawSoftShadow(ctx, centerX, h - 5, 50, 15, 0.2);

            // Scarf body (red, flowing shape)
            ctx.fillStyle = '#D94A4A';
            
            // Main scarf body
            ctx.beginPath();
            ctx.moveTo(centerX - 20, centerY - 10);
            ctx.quadraticCurveTo(centerX - 15, centerY - 15, centerX, centerY - 12);
            ctx.quadraticCurveTo(centerX + 15, centerY - 9, centerX + 20, centerY - 5);
            ctx.quadraticCurveTo(centerX + 18, centerY + 5, centerX + 15, centerY + 10);
            ctx.quadraticCurveTo(centerX, centerY + 8, centerX - 15, centerY + 12);
            ctx.quadraticCurveTo(centerX - 18, centerY + 5, centerX - 20, centerY - 10);
            ctx.closePath();
            ctx.fill();

            // Scarf stripes
            ctx.fillStyle = '#FFFFFF';
            for (let i = 0; i < 3; i++) {
                const x = centerX - 15 + i * 15;
                const y = centerY - 8 + i * 5;
                ctx.fillRect(x, y, 8, 3);
            }

            // Fringe on ends
            ctx.fillStyle = '#D94A4A';
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(centerX - 22 + i * 3, centerY - 8, 2, 10);
                ctx.fillRect(centerX + 12 + i * 3, centerY + 2, 2, 10);
            }
        });
    }

    /**
     * Generate person WITHOUT scarf (after scarf is stolen)
     */
    generatePersonNoScarf() {
        const key = 'person_no_scarf';
        const width = 50;
        const height = 90;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 40, 12, 0.2);

            // Legs (walking position - one forward, one back)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            // Back leg
            ctx.fillRect(centerX - 8, baseY - 30, 8, 30);
            // Front leg
            ctx.fillRect(centerX + 2, baseY - 28, 8, 28);

            // Shoes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.fillRect(centerX - 10, baseY - 5, 12, 5);
            ctx.fillRect(centerX + 0, baseY - 3, 12, 3);

            // Body (coat)
            ctx.fillStyle = '#4A6FA5'; // Blue coat
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 40, 14, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Arms
            ctx.fillStyle = '#4A6FA5';
            // Left arm (holding leash)
            ctx.beginPath();
            ctx.arc(centerX - 10, baseY - 38, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 13, baseY - 38, 5, 12);
            // Right arm (swinging)
            ctx.beginPath();
            ctx.arc(centerX + 10, baseY - 40, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX + 9, baseY - 40, 5, 15);

            // Head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 10, 0, Math.PI * 2);
            ctx.fill();

            // Simple face
            // Eyes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX - 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Frown (angry that scarf was stolen)
            ctx.strokeStyle = PALETTE.coalBlackHex;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 54, 5, Math.PI + 0.2, Math.PI * 2 - 0.2);
            ctx.stroke();

            // NO SCARF - it was stolen!

            // Hair
            ctx.fillStyle = '#6B5346';
            ctx.beginPath();
            ctx.arc(centerX - 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX, baseY - 67, 8, 0, Math.PI);
            ctx.fill();
        });
    }

    /**
     * Generate person WITHOUT scarf - Frame 2 (opposite leg forward)
     */
    generatePersonNoScarf2() {
        const key = 'person_no_scarf_2';
        const width = 50;
        const height = 90;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 5;

            // Shadow
            this.drawSoftShadow(ctx, centerX, baseY, 40, 12, 0.2);

            // Legs (walking position - opposite of frame 1)
            ctx.fillStyle = PALETTE.clothingBrownHex;
            // Back leg (right)
            ctx.fillRect(centerX + 2, baseY - 30, 8, 30);
            // Front leg (left)
            ctx.fillRect(centerX - 8, baseY - 28, 8, 28);

            // Shoes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.fillRect(centerX + 0, baseY - 5, 12, 5);
            ctx.fillRect(centerX - 10, baseY - 3, 12, 3);

            // Body (coat)
            ctx.fillStyle = '#4A6FA5'; // Blue coat
            ctx.beginPath();
            ctx.ellipse(centerX, baseY - 40, 14, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            // Arms (opposite swing)
            ctx.fillStyle = '#4A6FA5';
            // Left arm (swinging back)
            ctx.beginPath();
            ctx.arc(centerX - 10, baseY - 40, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX - 13, baseY - 40, 5, 15);
            // Right arm (forward with leash)
            ctx.beginPath();
            ctx.arc(centerX + 10, baseY - 38, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(centerX + 9, baseY - 38, 5, 12);

            // Head
            ctx.fillStyle = PALETTE.skinBeigeHex;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 58, 10, 0, Math.PI * 2);
            ctx.fill();

            // Simple face
            // Eyes
            ctx.fillStyle = PALETTE.coalBlackHex;
            ctx.beginPath();
            ctx.arc(centerX - 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 3, baseY - 60, 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Frown (angry that scarf was stolen)
            ctx.strokeStyle = PALETTE.coalBlackHex;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, baseY - 54, 5, Math.PI + 0.2, Math.PI * 2 - 0.2);
            ctx.stroke();

            // NO SCARF - it was stolen!

            // Hair
            ctx.fillStyle = '#6B5346';
            ctx.beginPath();
            ctx.arc(centerX - 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + 7, baseY - 64, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX, baseY - 67, 8, 0, Math.PI);
            ctx.fill();
        });
    }

    /**
     * Generate all dog walker sprites
     */
    generateAll() {
        this.generatePerson();
        this.generatePerson2();
        this.generatePersonNoScarf();
        this.generatePersonNoScarf2();
        this.generateDog();
        this.generateLeash();
        this.generateScarf();
    }
}

export default DogWalkerSprite;
