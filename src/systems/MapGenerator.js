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
     * Check if a position is clear of bushes
     */
    isPositionClear(x, y, minDistance = 60) {
        for (let bush of this.bushes) {
            const distance = Phaser.Math.Distance.Between(x, y, bush.x, bush.y);
            if (distance < minDistance) {
                return false;
            }
        }
        return true;
    }

    /**
     * Find a clear position near a target location
     */
    findClearPosition(targetX, targetY, range, maxAttempts = 20) {
        for (let i = 0; i < maxAttempts; i++) {
            const offsetX = (Math.random() - 0.5) * range;
            const offsetY = (Math.random() - 0.5) * range;
            const testX = targetX + offsetX;
            const testY = targetY + offsetY;
            
            if (this.isPositionClear(testX, testY)) {
                return { x: testX, y: testY };
            }
        }
        // If no clear position found, return target position anyway
        return { x: targetX, y: targetY };
    }

    /**
     * Generate the full map
     */
    generate() {
        // Generate sprite textures
        this.generateSprites();
        
        // Create room layout with bush walls
        this.generateRooms();
        
        // Place all items in a central room
        this.placeCentralRoom();
        
        // Place dog walker walking along the road
        this.placeDogWalker();
        
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
     * Generate 7 rectangular rooms with bush walls
     */
    generateRooms() {
        const numRooms = 7;
        this.rooms = [];
        
        // Create 7 rectangular rooms at different positions
        const roomConfigs = [
            { x: 0, y: 0, width: 500, height: 500 },           // Center
            { x: -800, y: -700, width: 400, height: 400 },     // Upper-left
            { x: 800, y: -700, width: 450, height: 400 },      // Upper-right
            { x: -800, y: 700, width: 400, height: 450 },      // Lower-left
            { x: 800, y: 700, width: 450, height: 450 },       // Lower-right
            { x: -1400, y: 0, width: 400, height: 400 },       // Far left
            { x: 1400, y: 0, width: 400, height: 400 }         // Far right
        ];
        
        // Create each rectangular room
        roomConfigs.forEach((config, index) => {
            this.createRectangularRoom(config.x, config.y, config.width, config.height);
            this.rooms.push(config);
        });
    }

    /**
     * Create a rectangular room with bush walls and one opening
     */
    createRectangularRoom(centerX, centerY, width, height) {
        const spacing = 40; // Tight spacing for dense walls
        const numBushesH = Math.ceil(width / spacing);
        const numBushesV = Math.ceil(height / spacing);
        
        // Choose one wall to have the opening (door)
        const doorWall = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        const doorPosition = 0.3 + Math.random() * 0.4; // Position along that wall
        const doorWidth = 2; // bushes to skip for door
        
        // Top wall
        for (let i = 0; i < numBushesH; i++) {
            const isDooor = (doorWall === 0 && Math.abs(i - numBushesH * doorPosition) < doorWidth);
            if (!isDooor) {
                const x = centerX - width / 2 + i * spacing;
                this.createBush(x, centerY - height / 2);
            }
        }
        
        // Bottom wall
        for (let i = 0; i < numBushesH; i++) {
            const isDooor = (doorWall === 2 && Math.abs(i - numBushesH * doorPosition) < doorWidth);
            if (!isDooor) {
                const x = centerX - width / 2 + i * spacing;
                this.createBush(x, centerY + height / 2);
            }
        }
        
        // Left wall
        for (let i = 0; i < numBushesV; i++) {
            const isDooor = (doorWall === 3 && Math.abs(i - numBushesV * doorPosition) < doorWidth);
            if (!isDooor) {
                const y = centerY - height / 2 + i * spacing;
                this.createBush(centerX - width / 2, y);
            }
        }
        
        // Right wall
        for (let i = 0; i < numBushesV; i++) {
            const isDooor = (doorWall === 1 && Math.abs(i - numBushesV * doorPosition) < doorWidth);
            if (!isDooor) {
                const y = centerY - height / 2 + i * spacing;
                this.createBush(centerX + width / 2, y);
            }
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
     * Place each item type inside a different rectangular room
     */
    placeCentralRoom() {
        // Use the generated rooms to place items
        // Room 0: Empty (center)
        // Room 1: Man on bench with hat
        // Room 2: Coal pile
        // Room 3: Tree with twigs
        // Rooms 4-5: Empty (for navigation)
        // Room 6: Garden with carrots (far right)
        
        // === ROOM 6 (Far Right): Garden with Carrots ===
        const gardenRoom = this.rooms[6];
        const gardenWidth = Math.min(200, gardenRoom.width - 100);
        const gardenHeight = Math.min(150, gardenRoom.height - 100);
        
        // Create visual garden inside the room
        const graphics = this.scene.add.graphics();
        graphics.setDepth(-8000); // Above grass trails (which are at -9000)
        graphics.fillStyle(0x8B6F47, 0.6);
        graphics.fillRoundedRect(
            gardenRoom.x - gardenWidth/2, 
            gardenRoom.y - gardenHeight/2, 
            gardenWidth, 
            gardenHeight, 
            10
        );
        
        // Planting rows
        graphics.lineStyle(3, 0x6B5346, 0.4);
        for (let i = 0; i < 3; i++) {
            const rowY = gardenRoom.y - gardenHeight/2 + 30 + i * 40;
            graphics.beginPath();
            graphics.moveTo(gardenRoom.x - gardenWidth/2 + 20, rowY);
            graphics.lineTo(gardenRoom.x + gardenWidth/2 - 20, rowY);
            graphics.strokePath();
        }
        this.specialAreas.push({ type: 'garden', x: gardenRoom.x, y: gardenRoom.y, sprite: graphics });
        
        // Place more carrots inside the garden (well away from walls)
        // Place them in rows so green leaves are visible
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const offsetX = (col - 1) * 60; // Spread across width
                const offsetY = (row - 1) * 40; // Spread across height
                this.itemSpawnPoints.push({
                    type: 'carrot',
                    x: gardenRoom.x + offsetX,
                    y: gardenRoom.y + offsetY - 20 // Offset up slightly so leaves show
                });
            }
        }
        
        // === ROOM 1: Man on Bench with Hat ===
        const benchRoom = this.rooms[1];
        
        const bench = this.scene.add.sprite(benchRoom.x, benchRoom.y + 30, 'bench');
        bench.setDepth(benchRoom.y * 10);
        this.scene.physics.add.existing(bench, true);
        bench.body.setSize(60, 20);
        bench.body.setOffset((bench.width - 60) / 2, bench.height - 25);
        this.specialAreas.push({ type: 'bench', x: benchRoom.x, y: benchRoom.y, sprite: bench });
        
        const man = this.scene.add.sprite(benchRoom.x, benchRoom.y, 'man_sitting');
        man.setDepth(benchRoom.y * 10 + 1);
        this.scene.physics.add.existing(man, true);
        man.body.setCircle(25);
        man.body.setOffset((man.width - 50) / 2, man.height - 50);
        man.hasHat = true;
        this.specialAreas.push({ type: 'man', x: benchRoom.x, y: benchRoom.y, sprite: man });
        
        // Hat above man's head
        this.itemSpawnPoints.push({
            type: 'hat',
            x: benchRoom.x,
            y: benchRoom.y - 60
        });
        
        // === ROOM 2: Coal Pile (with visual pile and collision) ===
        const coalRoom = this.rooms[2];
        
        // Create visual coal pile
        const coalPileGraphics = this.scene.add.graphics();
        coalPileGraphics.setDepth(coalRoom.y * 10 - 1);
        
        // Draw a mound of coal (dark circles)
        const coalPositions = [
            // Bottom layer
            { x: -30, y: 20 }, { x: -10, y: 20 }, { x: 10, y: 20 }, { x: 30, y: 20 },
            // Middle layer
            { x: -20, y: 5 }, { x: 0, y: 5 }, { x: 20, y: 5 },
            // Top layer
            { x: -10, y: -8 }, { x: 10, y: -8 },
            // Peak
            { x: 0, y: -20 }
        ];
        
        coalPositions.forEach(pos => {
            coalPileGraphics.fillStyle(0x2C2C2C, 1);
            coalPileGraphics.fillCircle(coalRoom.x + pos.x, coalRoom.y + pos.y, 12);
            // Add highlight for dimension
            coalPileGraphics.fillStyle(0x444444, 0.5);
            coalPileGraphics.fillCircle(coalRoom.x + pos.x - 3, coalRoom.y + pos.y - 3, 5);
        });
        
        // Create invisible sprite for collision
        const coalPileSprite = this.scene.add.sprite(coalRoom.x, coalRoom.y, null);
        coalPileSprite.setVisible(false);
        coalPileSprite.setDepth(coalRoom.y * 10);
        this.scene.physics.add.existing(coalPileSprite, true); // static body
        coalPileSprite.body.setCircle(40); // Circular collision area
        coalPileSprite.body.setOffset(-40, -40); // Center the circle
        
        this.specialAreas.push({ 
            type: 'coal_pile', 
            x: coalRoom.x, 
            y: coalRoom.y, 
            sprite: coalPileSprite,
            graphics: coalPileGraphics 
        });
        
        // Scatter collectible coal inside the room (well away from walls)
        const maxCoalSpread = Math.min(coalRoom.width, coalRoom.height) / 2 - 80;
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const distance = 30 + Math.random() * maxCoalSpread;
            this.itemSpawnPoints.push({
                type: 'coal',
                x: coalRoom.x + Math.cos(angle) * distance,
                y: coalRoom.y + Math.sin(angle) * distance
            });
        }
        
        // === ROOM 3: Trees Lining the Outside of the Horseshoe Road ===
        const treeRoom = this.rooms[3];
        
        // Place trees along the outer perimeter of the horseshoe road
        // Horseshoe: left vertical (x=-600), top horizontal (y=-400), right vertical (x=600)
        // Trees placed further out and more spaced apart
        
        const treePositions = [];
        
        // Left side of horseshoe (outside the left vertical road section at x=-600)
        const leftX = -800; // Further from road
        for (let y = 200; y >= -450; y -= 200) { // Spaced 200px apart, exclude bottom-most (y=400)
            treePositions.push({ x: leftX, y: y, hasTwigs: false });
        }
        
        // Top of horseshoe (above the top horizontal road section at y=-400)
        const topY = -600; // Further from road
        for (let x = -400; x <= 400; x += 200) { // Spaced 200px apart, exclude outer ends (-600 and 600)
            treePositions.push({ x: x, y: topY, hasTwigs: false });
        }
        
        // Right side of horseshoe (outside the right vertical road section at x=600)
        const rightX = 800; // Further from road
        for (let y = -450; y <= 200; y += 200) { // Spaced 200px apart, exclude bottom-most (y=400)
            treePositions.push({ x: rightX, y: y, hasTwigs: false });
        }
        
        // Mark 2 specific trees to have twigs (one on left side, one on right side)
        if (treePositions.length >= 4) {
            treePositions[2].hasTwigs = true; // Left side tree
            treePositions[treePositions.length - 3].hasTwigs = true; // Right side tree
        }
        
        treePositions.forEach(pos => {
            const tree = this.scene.add.sprite(pos.x, pos.y, 'tree_pine');
            tree.setDepth(pos.y * 10);
            this.scene.physics.add.existing(tree, true);
            tree.body.setCircle(30);
            tree.body.setOffset(tree.width/2 - 30, tree.height - 40);
            this.specialAreas.push({ 
                type: 'tree', 
                x: pos.x, 
                y: pos.y, 
                sprite: tree 
            });
            
            // Only add twigs under 2 specific trees
            if (pos.hasTwigs) {
                // Place 2 twigs further from the tree
                for (let i = 0; i < 2; i++) {
                    const twigOffsetX = (Math.random() - 0.5) * 100; // Increased spread
                    const twigOffsetY = 80 + Math.random() * 60; // Further away
                    this.itemSpawnPoints.push({
                        type: 'twig',
                        x: pos.x + twigOffsetX,
                        y: pos.y + twigOffsetY
                    });
                }
            }
        });
    }


    /**
     * Place dog walker walking along the road
     */
    placeDogWalker() {
        // Place dog walker on the left side of the road, walking along it
        const dogWalkerX = -700; // Just left of the road's left vertical section
        const dogWalkerY = 100;  // Mid-way along the left vertical section
        
        const dogWalker = this.scene.add.sprite(dogWalkerX, dogWalkerY, 'person_with_scarf');
        dogWalker.setDepth(dogWalkerY * 10 + 1);
        this.scene.physics.add.existing(dogWalker, true); // true = static body (can't be pushed)
        dogWalker.body.setCircle(30); // Larger collision area for easier interaction
        dogWalker.body.setOffset((dogWalker.width - 60) / 2, dogWalker.height - 60);
        dogWalker.hasScarf = true;
        dogWalker.animFrame = 0;
        dogWalker.walkSpeed = 30; // Slow walking speed
        
        // Walking back and forth bounds
        dogWalker.walkMinY = -300; // Top boundary
        dogWalker.walkMaxY = 400;  // Bottom boundary
        dogWalker.walkDirection = -1; // Start walking up (north)
        
        this.specialAreas.push({ type: 'dog_walker', x: dogWalkerX, y: dogWalkerY, sprite: dogWalker });
        
        // Dog next to walker
        const dog = this.scene.add.sprite(dogWalkerX + 40, dogWalkerY + 10, 'dog');
        dog.setDepth(dogWalkerY * 10);
        this.scene.physics.add.existing(dog);
        dog.body.setCircle(15);
        dog.body.setOffset((dog.width - 30) / 2, dog.height - 20);
        dog.isChasing = false;
        this.specialAreas.push({ type: 'dog', x: dogWalkerX + 40, y: dogWalkerY + 10, sprite: dog });
        
        // No floating scarf - it's on the dog walker's neck!
    }

    /**
     * Determine spawn points for 3 snowballs in different areas
     */
    determineSnowballSpawns() {
        this.snowballSpawns = [
            { x: 0, y: 0 },           // Snowball 1: Center
            { x: -1400, y: 0 },       // Snowball 2: Inside leftmost rectangle (far-left room)
            { x: 800, y: 600 }        // Snowball 3: Near lower-right area
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

