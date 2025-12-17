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

    /**
     * Create a tileable snow texture (procedural value noise + speckles).
     * Intended for a repeating ground layer via TileSprite.
     */
    createSnowTexture(size = 512, options = {}) {
        const {
            baseGrid = 8,
            octaves = 4,
            intensity = 0.10,
            speckleDensity = 0.0025,
            driftBlobs = 18,
            baseColorHex = PALETTE.backgroundHex
        } = options;

        const key = `snow_texture_${size}_${baseGrid}_${octaves}_${intensity}_${speckleDensity}_${driftBlobs}_${baseColorHex}`;
        if (this.scene.textures.exists(key)) return key;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // --- helpers ---
        const clamp255 = (v) => Math.max(0, Math.min(255, v | 0));
        const hexToRgb = (hex) => {
            const h = hex.replace('#', '').trim();
            const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
            const n = parseInt(full, 16);
            return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
        };
        const { r: baseR, g: baseG, b: baseB } = hexToRgb(baseColorHex);

        // Precompute per-octave tileable value grids.
        // For sampling, we wrap indices with modulo so edges match.
        const octaveGrids = [];
        for (let o = 0; o < octaves; o++) {
            const freq = 1 << o;
            const grid = Math.max(2, baseGrid * freq);
            const values = new Float32Array(grid * grid);
            for (let i = 0; i < values.length; i++) values[i] = Math.random();
            octaveGrids.push({ grid, values, amp: Math.pow(0.5, o) });
        }

        const sampleGrid = (values, grid, gx, gy) => {
            const x = ((gx % grid) + grid) % grid;
            const y = ((gy % grid) + grid) % grid;
            return values[x + y * grid];
        };

        const smoothstep = (t) => t * t * (3 - 2 * t);

        const sampleValueNoise = (x, y, gridObj) => {
            const { grid, values } = gridObj;
            const fx = (x / size) * grid;
            const fy = (y / size) * grid;
            const x0 = Math.floor(fx);
            const y0 = Math.floor(fy);
            const tx = smoothstep(fx - x0);
            const ty = smoothstep(fy - y0);

            const v00 = sampleGrid(values, grid, x0, y0);
            const v10 = sampleGrid(values, grid, x0 + 1, y0);
            const v01 = sampleGrid(values, grid, x0, y0 + 1);
            const v11 = sampleGrid(values, grid, x0 + 1, y0 + 1);

            const a = v00 * (1 - tx) + v10 * tx;
            const b = v01 * (1 - tx) + v11 * tx;
            return a * (1 - ty) + b * ty; // 0..1
        };

        // Base fill
        ctx.fillStyle = baseColorHex;
        ctx.fillRect(0, 0, size, size);

        // Noise layer (directly writes pixels for speed + control)
        const image = ctx.getImageData(0, 0, size, size);
        const data = image.data;

        // Normalize amplitude sum so intensity is consistent across octaves
        const ampSum = octaveGrids.reduce((s, g) => s + g.amp, 0) || 1;
        const maxDelta = 255 * intensity;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = 0;
                for (const g of octaveGrids) {
                    n += (sampleValueNoise(x, y, g) - 0.5) * 2 * g.amp; // -amp..+amp
                }
                n /= ampSum; // ~ -1..+1
                const delta = n * maxDelta;

                const idx = (x + y * size) * 4;
                data[idx] = clamp255(baseR + delta);
                data[idx + 1] = clamp255(baseG + delta);
                data[idx + 2] = clamp255(baseB + delta);
                data[idx + 3] = 255;
            }
        }
        ctx.putImageData(image, 0, 0);

        // Soft drift blobs (adds “wind” patches without hard edges)
        // Scale drift opacity down when intensity is low (keeps overall look subtle).
        const driftAlphaScale = Math.max(0, Math.min(1, intensity / 0.10));
        for (let i = 0; i < driftBlobs; i++) {
            const cx = Math.random() * size;
            const cy = Math.random() * size;
            const rx = 40 + Math.random() * 140;
            const ry = 25 + Math.random() * 90;
            const rot = (Math.random() - 0.5) * 0.6;

            // Alternate subtle highlight/shadow blobs
            const isHighlight = Math.random() < 0.6;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rot);
            ctx.globalAlpha = (0.05 + Math.random() * 0.06) * driftAlphaScale;
            ctx.fillStyle = isHighlight ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Speckles
        const speckles = Math.floor(size * size * speckleDensity);
        const speckleAlphaScale = Math.max(0.5, Math.min(1, intensity / 0.10));
        for (let i = 0; i < speckles; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const a = (0.03 + Math.random() * 0.06) * speckleAlphaScale;
            ctx.globalAlpha = a;
            ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)';
            ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;

        this.scene.textures.addCanvas(key, canvas);
        return key;
    }
}

export default TerrainRenderer;

