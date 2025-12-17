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
     * Generate detailed pine tree with snow, ornaments, and texture
     */
    generate() {
        const key = 'tree_pine';
        const width = 180;
        const height = 200;

        return this.createTexture(key, width, height, (ctx, w, h) => {
            const centerX = w / 2;
            const baseY = h - 15;

            // Shadow beneath tree
            this.drawSoftShadow(ctx, centerX, baseY + 5, 70, 25, 0.3);

            // Trunk with more detail
            const trunkWidth = 20;
            const trunkHeight = 55;
            
            // Trunk base (darker)
            ctx.fillStyle = PALETTE.brownDark;
            ctx.fillRect(centerX - trunkWidth/2, baseY - trunkHeight, trunkWidth, trunkHeight);
            
            // Trunk highlight (lighter side)
            ctx.fillStyle = PALETTE.brownMedium;
            ctx.fillRect(centerX - trunkWidth/2, baseY - trunkHeight, trunkWidth/3, trunkHeight);
            
            // Trunk texture lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 6; i++) {
                const ty = baseY - trunkHeight + i * 10;
                ctx.beginPath();
                ctx.moveTo(centerX - trunkWidth/2, ty);
                ctx.lineTo(centerX + trunkWidth/2, ty);
                ctx.stroke();
            }

            // More layered branches (7 layers for fuller tree)
            const layers = [
                { y: baseY - 20, width: 130, height: 35 },
                { y: baseY - 45, width: 115, height: 32 },
                { y: baseY - 68, width: 100, height: 30 },
                { y: baseY - 88, width: 85, height: 28 },
                { y: baseY - 106, width: 70, height: 25 },
                { y: baseY - 122, width: 55, height: 22 },
                { y: baseY - 136, width: 40, height: 20 }
            ];

            layers.forEach((layer, index) => {
                // Alternate green shades for depth
                const greenShades = [PALETTE.treeBaseHex, PALETTE.bushDarkHex, PALETTE.treeHighlightHex];
                ctx.fillStyle = greenShades[index % 3];
                ctx.globalAlpha = 0.95;
                
                // Main branch triangle
                ctx.beginPath();
                ctx.moveTo(centerX, layer.y - layer.height);
                ctx.lineTo(centerX - layer.width/2, layer.y);
                ctx.lineTo(centerX + layer.width/2, layer.y);
                ctx.closePath();
                ctx.fill();

                // Bushy pine needle texture (right side only)
                ctx.globalAlpha = 0.85;
                const numNeedles = 15;
                for (let i = 0; i < numNeedles; i++) {
                    const progress = i / numNeedles;

                    // Right side needles only
                    const rightX = centerX + (progress * layer.width/2);
                    const rightY = layer.y - layer.height + (progress * layer.height);
                    ctx.beginPath();
                    ctx.moveTo(rightX, rightY);
                    ctx.lineTo(rightX + 6 + Math.random() * 4, rightY + 4);
                    ctx.lineTo(rightX, rightY + 8);
                    ctx.fill();
                }

                // Snow caps on branches
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.ellipse(centerX, layer.y - layer.height + 5, layer.width/3, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Small snowflakes on branches
                ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 3; i++) {
                    const sx = centerX - layer.width/4 + Math.random() * layer.width/2;
                    const sy = layer.y - layer.height/2 + Math.random() * layer.height/2;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Cute ornaments (small colored circles) on lower branches
                if (index < 4) {
                    ctx.globalAlpha = 1;
                    const ornamentColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8ED4'];
                    for (let i = 0; i < 2; i++) {
                        const ox = centerX - layer.width/3 + Math.random() * (layer.width * 2/3);
                        const oy = layer.y - layer.height/2 + Math.random() * layer.height/2;
                        ctx.fillStyle = ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
                        ctx.beginPath();
                        ctx.arc(ox, oy, 4, 0, Math.PI * 2);
                        ctx.fill();
                        // Ornament shine
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                        ctx.beginPath();
                        ctx.arc(ox - 1, oy - 1, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });

            // Star on top
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FFD700';
            const starX = centerX;
            const starY = layers[layers.length - 1].y - layers[layers.length - 1].height - 5;
            this.drawStar(ctx, starX, starY, 5, 8, 4);
            
            // Star shine
            ctx.fillStyle = '#FFFFE0';
            ctx.beginPath();
            ctx.arc(starX, starY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = 1;
        });
    }

    /**
     * Draw a star shape
     */
    drawStar(ctx, x, y, points, outerRadius, innerRadius) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
}

export default TreeSprite;

