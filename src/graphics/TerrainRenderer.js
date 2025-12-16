import PALETTE from './ColorPalette.js';

/**
 * Terrain renderer for background and organic grass patches
 */
export class TerrainRenderer {
    constructor(scene) {
        this.scene = scene;
        this.grassPatches = [];
    }

    /**
     * Generate organic grass patch shapes
     */
    generateGrassPatches(numPatches = 15) {
        const patches = [];
        const worldWidth = 6000;
        const worldHeight = 6000;

        for (let i = 0; i < numPatches; i++) {
            const x = Math.random() * worldWidth - worldWidth / 2;
            const y = Math.random() * worldHeight - worldHeight / 2;
            const width = 400 + Math.random() * 600;
            const height = 400 + Math.random() * 600;
            
            // Create organic shape using multiple control points
            const points = [];
            const numPoints = 8 + Math.floor(Math.random() * 4);
            
            for (let j = 0; j < numPoints; j++) {
                const angle = (j / numPoints) * Math.PI * 2;
                const variance = 0.7 + Math.random() * 0.6;
                const px = x + Math.cos(angle) * width * variance;
                const py = y + Math.sin(angle) * height * variance;
                points.push({ x: px, y: py });
            }

            // Pre-calculate offsets for consistent rendering
            const offsets = [];
            for (let i = 0; i < 3; i++) {
                offsets.push({
                    x: (Math.random() - 0.5) * 0.8,
                    y: (Math.random() - 0.5) * 0.8,
                    radius: 0.5 + Math.random() * 0.3
                });
            }
            
            patches.push({
                x,
                y,
                points,
                shade: Math.random() < 0.4 ? 'light' : (Math.random() < 0.6 ? 'medium' : 'dark'),
                offsets: offsets,
                avgRadius: Math.sqrt(width * height) / 2
            });
        }

        return patches;
    }

    /**
     * Render terrain to graphics object
     */
    renderTerrain(graphics, cameraX, cameraY) {
        // This will be called each frame to draw visible grass patches
        
        if (this.grassPatches.length === 0) {
            this.grassPatches = this.generateGrassPatches();
        }

        // Draw only patches near camera
        const viewDistance = 1500;

        this.grassPatches.forEach(patch => {
            const dist = Phaser.Math.Distance.Between(cameraX, cameraY, patch.x, patch.y);
            if (dist < viewDistance) {
                // Choose color based on shade
                let color;
                switch (patch.shade) {
                    case 'light':
                        color = PALETTE.grassLight;
                        break;
                    case 'medium':
                        color = PALETTE.grassMedium;
                        break;
                    case 'dark':
                        color = PALETTE.grassDark;
                        break;
                }

                // Use Phaser Graphics API - draw organic circles for grass patches
                graphics.fillStyle(color, 0.6);
                
                // Draw main patch
                graphics.fillCircle(patch.x, patch.y, patch.avgRadius);
                
                // Add some smaller overlapping circles for organic look (using pre-calculated offsets)
                patch.offsets.forEach(offset => {
                    const offsetX = offset.x * patch.avgRadius;
                    const offsetY = offset.y * patch.avgRadius;
                    const radius = patch.avgRadius * offset.radius;
                    graphics.fillCircle(patch.x + offsetX, patch.y + offsetY, radius);
                });
            }
        });
    }

    /**
     * Create a static terrain texture (for small areas)
     */
    createGrassTexture(width, height) {
        const key = `grass_texture_${width}x${height}`;
        
        if (this.scene.textures.exists(key)) {
            return key;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base grass color
        ctx.fillStyle = PALETTE.grassMediumHex;
        ctx.fillRect(0, 0, width, height);

        // Add organic texture with dots and blobs
        const numBlobs = Math.floor((width * height) / 500);
        for (let i = 0; i < numBlobs; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = 5 + Math.random() * 15;
            
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                ctx.fillStyle = PALETTE.grassLightHex;
            } else if (colorChoice < 0.66) {
                ctx.fillStyle = PALETTE.grassDarkHex;
            } else {
                ctx.fillStyle = PALETTE.grassMediumHex;
            }
            
            ctx.globalAlpha = 0.3 + Math.random() * 0.4;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        this.scene.textures.addCanvas(key, canvas);
        return key;
    }
}

export default TerrainRenderer;

