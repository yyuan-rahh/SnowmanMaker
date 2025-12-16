import CONFIG from '../config.js';
import { BushSprite } from '../graphics/sprites/BushSprite.js';
import { TreeSprite } from '../graphics/sprites/TreeSprite.js';
import { CharacterSprite } from '../graphics/sprites/CharacterSprite.js';

/**
 * Map generator with random rooms and special themed areas
 */
export class MapGenerator {
    constructor(scene) {
        this.scene = scene;
        this.bushes = [];
        this.specialAreas = [];
        this.itemSpawnPoints = [];
        this.snowballSpawns = [];
    }

    /**
     * Generate the full map
     */
    generate() {
        // Generate sprite textures
        this.generateSprites();
        
        // Create room layout with bush walls
        this.generateRooms();
        
        // Place special themed areas
        this.placeGarden();
        this.placeBenchArea();
        this.placeCoalPile();
        this.placeTreeArea();
        
        // Determine snowball spawn points (one in each region)
        this.determineSnowballSpawns();
        
        return {
            bushes: this.bushes,
            itemSpawnPoints: this.itemSpawnPoints,
            snowballSpawns: this.snowballSpawns,
            specialAreas: this.specialAreas
        };
    }

    /**
     * Generate all sprite textures
     */
    generateSprites() {
        const bushGen = new BushSprite(this.scene);
        bushGen.generate();
        
        const treeGen = new TreeSprite(this.scene);
        treeGen.generate();
        
        const charGen = new CharacterSprite(this.scene);
        charGen.generateAll();
    }

    /**
     * Generate room layout with bush clusters
     */
    generateRooms() {
        const numRooms = CONFIG.map.numRooms;
        const rooms = [];
        
        // Create room centers
        for (let i = 0; i < numRooms; i++) {
            const angle = (i / numRooms) * Math.PI * 2;
            const distance = 800 + Math.random() * 600;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const width = 400 + Math.random() * 400;
            const height = 400 + Math.random() * 400;
            
            rooms.push({ x, y, width, height });
        }
        
        // Create bush walls around room perimeters
        rooms.forEach(room => {
            this.createBushWalls(room);
        });
        
        // Add some random bush clusters
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 600 + Math.random() * 1500;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            this.createBushCluster(x, y, 2 + Math.floor(Math.random() * 3));
        }
    }

    /**
     * Create bush walls around a room
     */
    createBushWalls(room) {
        const spacing = 70;
        const numBushesH = Math.ceil(room.width / spacing);
        const numBushesV = Math.ceil(room.height / spacing);
        
        // Top and bottom walls
        for (let i = 0; i < numBushesH; i++) {
            if (Math.random() > 0.3) { // Leave some gaps
                const x = room.x - room.width / 2 + i * spacing;
                this.createBush(x, room.y - room.height / 2);
                this.createBush(x, room.y + room.height / 2);
            }
        }
        
        // Left and right walls
        for (let i = 0; i < numBushesV; i++) {
            if (Math.random() > 0.3) {
                const y = room.y - room.height / 2 + i * spacing;
                this.createBush(room.x - room.width / 2, y);
                this.createBush(room.x + room.width / 2, y);
            }
        }
    }

    /**
     * Create a cluster of bushes
     */
    createBushCluster(x, y, count) {
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            this.createBush(x + offsetX, y + offsetY);
        }
    }

    /**
     * Create single bush sprite
     */
    createBush(x, y) {
        const bush = this.scene.add.sprite(x, y, 'bush_80x60');
        bush.setDepth(y * 10);
        
        // Add to physics for collision
        this.scene.physics.add.existing(bush, true); // true = static body
        
        this.bushes.push(bush);
        return bush;
    }

    /**
     * Place garden area with carrots
     */
    placeGarden() {
        const x = -800;
        const y = -600;
        const gardenWidth = 200;
        const gardenHeight = 150;
        
        // Create visual garden with dirt rows
        const graphics = this.scene.add.graphics();
        graphics.setDepth(y * 10 - 1);
        
        // Draw brown dirt patch
        graphics.fillStyle(0x8B6F47, 0.6);
        graphics.fillRoundedRect(x - gardenWidth/2, y - gardenHeight/2, gardenWidth, gardenHeight, 10);
        
        // Draw planting rows
        graphics.lineStyle(3, 0x6B5346, 0.4);
        for (let i = 0; i < 4; i++) {
            const rowY = y - gardenHeight/2 + 30 + i * 30;
            graphics.beginPath();
            graphics.moveTo(x - gardenWidth/2 + 20, rowY);
            graphics.lineTo(x + gardenWidth/2 - 20, rowY);
            graphics.strokePath();
        }
        
        this.specialAreas.push({ type: 'garden', x, y, sprite: graphics });
        
        // Spawn carrots in garden rows
        for (let i = 0; i < 2; i++) {
            const rowIndex = Math.floor(Math.random() * 4);
            const offsetX = (Math.random() - 0.5) * 120;
            const rowY = -gardenHeight/2 + 30 + rowIndex * 30;
            this.itemSpawnPoints.push({
                type: 'carrot',
                x: x + offsetX,
                y: y + rowY
            });
        }
    }

    /**
     * Place bench area with man and hat
     */
    placeBenchArea() {
        const x = 900;
        const y = -400;
        
        // Create bench with physics
        const bench = this.scene.add.sprite(x, y + 30, 'bench');
        bench.setDepth(y * 10);
        this.scene.physics.add.existing(bench, true); // static body
        bench.body.setSize(60, 20);
        bench.body.setOffset((bench.width - 60) / 2, bench.height - 25);
        this.specialAreas.push({ type: 'bench', x, y, sprite: bench });
        
        // Create man sitting on bench with physics
        const man = this.scene.add.sprite(x, y, 'man_sitting');
        man.setDepth(y * 10 + 1);
        this.scene.physics.add.existing(man, true); // static body
        man.body.setCircle(25);
        man.body.setOffset((man.width - 50) / 2, man.height - 50);
        man.hasHat = true; // Track if man has hat
        this.specialAreas.push({ type: 'man', x, y, sprite: man });
        
        // Hat spawn point (above man's head)
        this.itemSpawnPoints.push({
            type: 'hat',
            x: x,
            y: y - 60
        });
    }

    /**
     * Place coal pile area
     */
    placeCoalPile() {
        const x = 600;
        const y = 800;
        
        this.specialAreas.push({ type: 'coal_pile', x, y });
        
        // Spawn coal items scattered around
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            this.itemSpawnPoints.push({
                type: 'coal',
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance
            });
        }
    }

    /**
     * Place tree area with twigs
     */
    placeTreeArea() {
        const x = -700;
        const y = 700;
        
        // Create tree with physics
        const tree = this.scene.add.sprite(x, y, 'tree_pine');
        tree.setDepth(y * 10);
        this.scene.physics.add.existing(tree, true); // true = static body
        tree.body.setCircle(30); // Collision radius for tree trunk
        tree.body.setOffset(tree.width/2 - 30, tree.height - 40); // Bottom center
        this.specialAreas.push({ type: 'tree', x, y, sprite: tree });
        
        // Spawn twigs under/near tree
        for (let i = 0; i < 4; i++) {
            const offsetX = (Math.random() - 0.5) * 150;
            const offsetY = 50 + Math.random() * 100;
            this.itemSpawnPoints.push({
                type: 'twig',
                x: x + offsetX,
                y: y + offsetY
            });
        }
    }

    /**
     * Determine spawn points for 3 snowballs in different areas
     */
    determineSnowballSpawns() {
        this.snowballSpawns = [
            { x: 0, y: 0 },           // Center
            { x: -1000, y: -800 },    // Near garden
            { x: 800, y: 600 }        // Between coal and tree
        ];
    }

    /**
     * Get snowball spawn position by ID
     */
    getSnowballSpawn(id) {
        return this.snowballSpawns[id] || this.snowballSpawns[0];
    }

    /**
     * Clean up
     */
    destroy() {
        this.bushes.forEach(bush => bush.destroy());
        this.bushes = [];
        this.specialAreas = [];
        this.itemSpawnPoints = [];
        this.snowballSpawns = [];
    }
}

export default MapGenerator;

