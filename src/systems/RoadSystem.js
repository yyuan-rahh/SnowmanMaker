import PALETTE from '../graphics/ColorPalette.js';

/**
 * Manages road rendering and car traffic
 */
export class RoadSystem {
    constructor(scene) {
        this.scene = scene;
        this.cars = [];
        this.roadPath = [];
        this.roadGraphics = null;
        this.carSpawnTimer = null;
    }

    /**
     * Generate horseshoe-shaped road with right angles
     */
    generateRoadPath() {
        // Horseshoe pattern: Enter left → Go east → Turn north → Go up → 
        // Turn east → Go across top → Turn south → Go down → Exit right
        
        const entryY = 350; // Below Far-Left (y=0), above Lower-Left (y=700)
        const turnUpX = -600; // Halfway past Lower-Left room (x=-800)
        const topY = -400; // Top horizontal section height
        const turnDownX = 600; // Halfway past Lower-Right room (x=800), symmetric
        
        this.roadPath = [
            // Enter from far left (horizontal entry)
            { x: -2000, y: entryY },
            { x: -1500, y: entryY },
            { x: -1000, y: entryY },
            
            // Continue east to first turn point
            { x: turnUpX, y: entryY },
            
            // Turn north (up) - 90 degree turn
            { x: turnUpX, y: 200 },
            { x: turnUpX, y: 0 },
            { x: turnUpX, y: -200 },
            { x: turnUpX, y: -350 },
            
            // At the top horizontal section
            { x: turnUpX, y: topY },
            
            // Turn east (right) - 90 degree turn, go across the top
            { x: -400, y: topY },
            { x: -200, y: topY },
            { x: 0, y: topY },
            { x: 200, y: topY },
            { x: 400, y: topY },
            { x: turnDownX, y: topY },
            
            // Turn south (down) - 90 degree turn, symmetric to left side
            { x: turnDownX, y: -350 },
            { x: turnDownX, y: -200 },
            { x: turnDownX, y: 0 },
            { x: turnDownX, y: 200 },
            
            // Continue down to exit level
            { x: turnDownX, y: entryY },
            
            // Exit to the right (horizontal exit)
            { x: 1000, y: entryY },
            { x: 1500, y: entryY },
            { x: 2000, y: entryY }
        ];
    }

    /**
     * Draw the road visual
     */
    drawRoad() {
        this.roadGraphics = this.scene.add.graphics();
        this.roadGraphics.setDepth(-8500); // Above grass trails (which are at -9000)

        const roadWidth = 100;

        // Draw road as a thick gray path
        this.roadGraphics.lineStyle(roadWidth, 0x555555, 1);
        this.roadGraphics.beginPath();
        
        // Draw smooth path through all points
        this.roadGraphics.moveTo(this.roadPath[0].x, this.roadPath[0].y);
        
        for (let i = 1; i < this.roadPath.length; i++) {
            const point = this.roadPath[i];
            this.roadGraphics.lineTo(point.x, point.y);
        }
        
        this.roadGraphics.strokePath();

        // Draw road markings (dashed white line in center)
        this.roadGraphics.lineStyle(3, 0xFFFFFF, 0.8);
        this.roadGraphics.beginPath();
        
        // Draw dashed center line
        for (let i = 0; i < this.roadPath.length - 1; i++) {
            const start = this.roadPath[i];
            const end = this.roadPath[i + 1];
            const distance = Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y);
            const segments = Math.ceil(distance / 40); // 40px per dash segment
            
            for (let j = 0; j < segments; j++) {
                if (j % 2 === 0) { // Only draw every other segment (dashed)
                    const t1 = j / segments;
                    const t2 = Math.min((j + 0.5) / segments, 1);
                    const x1 = start.x + (end.x - start.x) * t1;
                    const y1 = start.y + (end.y - start.y) * t1;
                    const x2 = start.x + (end.x - start.x) * t2;
                    const y2 = start.y + (end.y - start.y) * t2;
                    
                    this.roadGraphics.beginPath();
                    this.roadGraphics.moveTo(x1, y1);
                    this.roadGraphics.lineTo(x2, y2);
                    this.roadGraphics.strokePath();
                }
            }
        }
    }

    /**
     * Initialize the road system
     */
    initialize() {
        this.generateRoadPath();
        this.drawRoad();
        
        // Start spawning cars every 3-6 seconds
        this.startCarSpawning();
    }

    /**
     * Start spawning cars periodically
     */
    startCarSpawning() {
        const spawnCar = () => {
            this.spawnCar();
            
            // Schedule next car spawn (3-6 seconds)
            const delay = 3000 + Math.random() * 3000;
            this.carSpawnTimer = this.scene.time.delayedCall(delay, spawnCar);
        };
        
        // Spawn first car after 2 seconds
        this.carSpawnTimer = this.scene.time.delayedCall(2000, spawnCar);
    }

    /**
     * Spawn dog walker on the left side of the horseshoe
     */

    /**
     * Spawn a new car at the start of the road
     */
    spawnCar() {
        // Random car color
        const carTypes = ['car_red', 'car_blue', 'car_yellow'];
        const carType = Phaser.Utils.Array.GetRandom(carTypes);
        
        // Create car sprite at road start
        const startPoint = this.roadPath[0];
        const car = this.scene.physics.add.sprite(startPoint.x, startPoint.y, carType);
        car.setDepth(startPoint.y * 10 + 5); // Above road, dynamic based on position
        
        // Set up car physics (2x larger body)
        car.body.setSize(120, 60);
        car.body.setOffset(20, 20);
        
        // Car data
        car.pathIndex = 0;
        car.speed = 350 + Math.random() * 150; // Random speed between 350-500 (faster!)
        
        this.cars.push(car);
    }

    /**
     * Update all cars along the road path
     */
    update(delta) {
        // Update each car
        for (let i = this.cars.length - 1; i >= 0; i--) {
            const car = this.cars[i];
            
            if (!car || !car.active) {
                this.cars.splice(i, 1);
                continue;
            }
            
            // Get current target point
            if (car.pathIndex >= this.roadPath.length - 1) {
                // Car reached end of road, remove it
                car.destroy();
                this.cars.splice(i, 1);
                continue;
            }
            
            const targetPoint = this.roadPath[car.pathIndex + 1];
            const distance = Phaser.Math.Distance.Between(car.x, car.y, targetPoint.x, targetPoint.y);
            
            // Check if reached target point
            if (distance < 20) {
                car.pathIndex++;
                if (car.pathIndex >= this.roadPath.length - 1) {
                    continue; // Will be removed next frame
                }
            }
            
            // Move towards target point
            const nextTarget = this.roadPath[car.pathIndex + 1];
            const angle = Phaser.Math.Angle.Between(car.x, car.y, nextTarget.x, nextTarget.y);
            
            car.setVelocity(
                Math.cos(angle) * car.speed,
                Math.sin(angle) * car.speed
            );
            
            // Rotate car to face movement direction
            car.setRotation(angle);
            
            // Update depth based on y position
            car.setDepth(car.y * 10 + 5);
        }
    }

    /**
     * Get all active cars (for collision detection)
     */
    getCars() {
        return this.cars.filter(car => car && car.active);
    }

    /**
     * Clean up
     */
    destroy() {
        if (this.carSpawnTimer) {
            this.carSpawnTimer.remove();
        }
        
        this.cars.forEach(car => {
            if (car && car.active) {
                car.destroy();
            }
        });
        
        this.cars = [];
        
        if (this.roadGraphics) {
            this.roadGraphics.destroy();
        }
    }
}

export default RoadSystem;

