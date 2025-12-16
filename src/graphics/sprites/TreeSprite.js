import PALETTE from '../ColorPalette.js';
import { SpriteRenderer } from '../SpriteRenderer.js';

/**
 * Layered pine tree with triangular sections
 */
export class TreeSprite extends SpriteRenderer {
    constructor(scene) {
        super(scene);
    }

    /**
     * Generate pine tree with layered triangles
     */
    generate() {
        const key = 'tree_pine';
        const width = 160;
        const height = 180;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 20;

            // Shadow beneath tree
            this.drawSoftShadow(ctx, centerX, baseY + 5, 60, 20, 0.25);

            // Trunk
            const trunkWidth = 16;
            const trunkHeight = 50;
            ctx.fillStyle = PALETTE.treeTrunkHex;
            ctx.fillRect(centerX - trunkWidth/2, baseY - trunkHeight, trunkWidth, trunkHeight);
            
            // Add trunk texture
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            for (let i = 0; i < 5; i++) {
                const ty = baseY - trunkHeight + Math.random() * trunkHeight;
                const tx = centerX - trunkWidth/2 + Math.random() * trunkWidth;
                ctx.fillRect(tx, ty, 2, 3 + Math.random() * 3);
            }

            // Layered triangle sections (bottom to top)
            const layers = [
                { y: baseY - 25, width: 120, color: PALETTE.treeBaseHex },
                { y: baseY - 55, width: 100, color: PALETTE.bushDarkHex },
                { y: baseY - 80, width: 85, color: PALETTE.treeBaseHex },
                { y: baseY - 105, width: 65, color: PALETTE.treeHighlightHex },
                { y: baseY - 125, width: 45, color: PALETTE.bushDarkHex }
            ];

            layers.forEach((layer, index) => {
                ctx.fillStyle = layer.color;
                ctx.globalAlpha = 0.9;
                
                // Main triangle
                ctx.beginPath();
                ctx.moveTo(centerX, layer.y - 30);                    // Top point
                ctx.lineTo(centerX - layer.width/2, layer.y);         // Bottom left
                ctx.lineTo(centerX + layer.width/2, layer.y);         // Bottom right
                ctx.closePath();
                ctx.fill();

                // Add jagged edges with small triangles for pine needle texture
                ctx.globalAlpha = 0.8;
                const numJaggies = 12;
                for (let i = 0; i < numJaggies; i++) {
                    const progress = i / numJaggies;
                    
                    // Left side jaggies
                    const leftX = centerX - layer.width/2 + (progress * layer.width/2);
                    const leftY = layer.y - 30 + (progress * 30);
                    ctx.beginPath();
                    ctx.moveTo(leftX, leftY);
                    ctx.lineTo(leftX - 5 - Math.random() * 3, leftY + 3);
                    ctx.lineTo(leftX, leftY + 6);
                    ctx.fill();

                    // Right side jaggies
                    const rightX = centerX + (progress * layer.width/2);
                    const rightY = layer.y - 30 + (progress * 30);
                    ctx.beginPath();
                    ctx.moveTo(rightX, rightY);
                    ctx.lineTo(rightX + 5 + Math.random() * 3, rightY + 3);
                    ctx.lineTo(rightX, rightY + 6);
                    ctx.fill();
                }

                // Add darker spots for texture/depth
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                const numSpots = 8;
                for (let i = 0; i < numSpots; i++) {
                    const spotX = centerX - layer.width/4 + Math.random() * layer.width/2;
                    const spotY = layer.y - 25 + Math.random() * 20;
                    ctx.beginPath();
                    ctx.arc(spotX, spotY, 2 + Math.random() * 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            ctx.globalAlpha = 1;
        });
    }
}

export default TreeSprite;

