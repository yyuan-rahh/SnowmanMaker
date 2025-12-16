import CONFIG from '../config.js';
import PALETTE from '../graphics/ColorPalette.js';
import { TerrainRenderer } from '../graphics/TerrainRenderer.js';
import { SnowballSprite } from '../graphics/sprites/SnowballSprite.js';
import { GrassTrailSprite } from '../graphics/sprites/GrassTrailSprite.js';
import { ItemSprites } from '../graphics/sprites/ItemSprites.js';
import { Snowball } from '../entities/Snowball.js';
import { CollectibleItem } from '../entities/CollectibleItem.js';
import { MapGenerator } from '../systems/MapGenerator.js';
import { GrassTrailSystem } from '../systems/GrassTrailSystem.js';
import { IsometricConverter } from '../systems/IsometricConverter.js';
import { ParticleEffects } from '../graphics/effects/ParticleEffects.js';
import { DialogueSystem } from '../ui/DialogueSystem.js';

/**
 * Main game scene
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        console.log('GameScene.create() started');
        
        try {
            // Set world bounds
            this.physics.world.setBounds(-3000, -3000, 6000, 6000);
            
            // Background color
            this.cameras.main.setBackgroundColor(PALETTE.background);
            
            console.log('Basic setup complete');
        
            // Initialize systems
            console.log('Initializing systems...');
            this.iso = new IsometricConverter();
            this.terrainRenderer = new TerrainRenderer(this);
            this.trailSystem = new GrassTrailSystem(this);
            this.mapGenerator = new MapGenerator(this);
            this.particleEffects = new ParticleEffects(this);
            this.dialogueSystem = new DialogueSystem(this);
            console.log('Systems initialized');
            
            // Generate all sprite textures
            console.log('Generating sprites...');
            this.generateAllSprites();
            console.log('Sprites generated');
        
            // Create terrain graphics
            console.log('Creating terrain graphics...');
            this.terrainGraphics = this.add.graphics();
            this.terrainGraphics.setDepth(-10000); // Lowest layer - ground
            
            // Generate map
            console.log('Generating map...');
            const mapData = this.mapGenerator.generate();
            console.log('Map generated:', mapData);
            
            // Store map data for later use
            this.mapData = mapData;
            
            // Create items
            console.log('Creating items...');
            this.items = [];
        mapData.itemSpawnPoints.forEach(spawn => {
            const item = new CollectibleItem(this, spawn.x, spawn.y, spawn.type);
            this.items.push(item);
        });
        
            // Create 3 snowballs
            this.snowballs = [];
            for (let i = 0; i < 3; i++) {
                const spawn = this.mapGenerator.getSnowballSpawn(i);
                const snowball = new Snowball(this, spawn.x, spawn.y, i);
                this.snowballs.push(snowball);
                
                // Add collision with bushes
                this.physics.add.collider(snowball.sprite, this.mapGenerator.bushes);
                
                // Add collision with special area objects
                this.mapData.specialAreas.forEach(area => {
                    if (area.sprite && area.sprite.body) {
                        this.physics.add.collider(snowball.sprite, area.sprite);
                    }
                });
            }
        
        // Set first snowball as active
        this.activeSnowballIndex = 0;
        this.snowballs[0].setActive(true);
        
        // Setup camera
        this.setupCamera();
        
        // Setup input
        this.setupInput();
        
        // Inventory tracking
        this.inventory = {
            carrot: 0,
            twig: 0,
            coal: 0,
            hat: 0
        };
        
        this.updateUI();
        
            // Game created successfully
            console.log('GameScene created successfully!');
            
        } catch (error) {
            console.error('Error in GameScene.create():', error);
            alert('Error loading game: ' + error.message + '\nCheck console (F12) for details');
            throw error;
        }
    }

    /**
     * Generate all sprite textures
     */
    generateAllSprites() {
        // Snowball sprites (will generate on demand)
        new SnowballSprite(this);
        
        // Trail sprite
        const trailGen = new GrassTrailSprite(this);
        trailGen.generate();
        
        // Item sprites
        const itemGen = new ItemSprites(this);
        itemGen.generateAll();
        
        // Create simple white particle for collection effects
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(0xffffff, 1);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('particle_white', 8, 8);
        particleGraphics.destroy();
    }

    /**
     * Setup camera to follow active snowball
     */
    setupCamera() {
        const activeSnowball = this.snowballs[this.activeSnowballIndex];
        this.cameras.main.startFollow(activeSnowball.sprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
    }

    /**
     * Setup keyboard input
     */
    setupInput() {
        // Arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD keys
        this.wasd = {
            w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        
        // Number keys for switching snowballs
        this.input.keyboard.on('keydown-ONE', () => this.switchSnowball(0));
        this.input.keyboard.on('keydown-TWO', () => this.switchSnowball(1));
        this.input.keyboard.on('keydown-THREE', () => this.switchSnowball(2));
    }

    /**
     * Switch active snowball
     */
    switchSnowball(index) {
        if (index === this.activeSnowballIndex) return;
        
        // Deactivate current
        this.snowballs[this.activeSnowballIndex].setActive(false);
        
        // Activate new
        this.activeSnowballIndex = index;
        this.snowballs[index].setActive(true);
        
        // Visual feedback
        this.particleEffects.createSwitchIndicator(this.snowballs[index], index + 1);
        
        // Smoothly transition camera
        const target = this.snowballs[index].sprite;
        this.cameras.main.pan(target.x, target.y, CONFIG.camera.switchDuration, 'Sine.easeInOut');
        this.cameras.main.startFollow(target, true, 0.1, 0.1);
        
        this.updateUI();
    }

    /**
     * Update loop
     */
    update(time, delta) {
        // Update terrain rendering
        const cam = this.cameras.main;
        this.terrainGraphics.clear();
        this.terrainRenderer.renderTerrain(this.terrainGraphics, cam.scrollX + cam.width/2, cam.scrollY + cam.height/2);
        
        // Update snowballs
        const activeSnowball = this.snowballs[this.activeSnowballIndex];
        
        this.snowballs.forEach(snowball => {
            snowball.update(time, delta);
            
            // Spawn trail for active snowball
            if (snowball.isActive && this.trailSystem.shouldSpawnTrail(snowball)) {
                const pos = snowball.getPosition();
                this.trailSystem.spawnTrail(pos.x, pos.y);
            }
        });
        
        // Handle input for active snowball
        activeSnowball.handleInput(this.cursors, this.wasd);
        
        // Update trail system
        this.trailSystem.update();
        
        // Check proximity to man on bench for dialogue
        this.checkManDialogue(activeSnowball);
        
        // Update items
        this.items.forEach(item => {
            item.update(time);
            
            // Check collision with active snowball
            if (!item.collected) {
                const itemPos = item.getPosition();
                const snowballPos = activeSnowball.getPosition();
                const distance = Phaser.Math.Distance.Between(itemPos.x, itemPos.y, snowballPos.x, snowballPos.y);
                
                if (distance < activeSnowball.radius + 20) {
                    if (item.canCollect(activeSnowball.getScale())) {
                        // Collect with effects
                        const itemPos = item.getPosition();
                        this.particleEffects.createSparkles(itemPos.x, itemPos.y);
                        this.particleEffects.createPoof(itemPos.x, itemPos.y);
                        
                        item.collect();
                        this.inventory[item.type]++;
                        
                        // If hat was collected, update man's status
                        if (item.type === 'hat') {
                            const man = this.mapData.specialAreas.find(area => area.type === 'man');
                            if (man && man.sprite) {
                                man.sprite.hasHat = false;
                            }
                        }
                        
                        this.updateUI();
                        this.checkWinCondition();
                    } else {
                        // Too small to collect - show warning message
                        this.showTooSmallMessage(item, itemPos.x, itemPos.y);
                    }
                }
            }
        });
        
        // Update UI with current snowball size
        this.updateSizeDisplay(activeSnowball.getScale());
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('carrot-count').textContent = this.inventory.carrot;
        document.getElementById('twig-count').textContent = this.inventory.twig;
        document.getElementById('coal-count').textContent = this.inventory.coal;
        document.getElementById('hat-count').textContent = this.inventory.hat;
        document.getElementById('active-snowball').textContent = this.activeSnowballIndex + 1;
    }

    /**
     * Update size display
     */
    updateSizeDisplay(scale) {
        document.getElementById('snowball-size').textContent = scale.toFixed(1) + 'x';
    }

    /**
     * Check if player has won
     */
    checkWinCondition() {
        const needed = CONFIG.itemsNeeded;
        const hasAll = 
            this.inventory.carrot >= needed.carrot &&
            this.inventory.twig >= needed.twig &&
            this.inventory.coal >= needed.coal &&
            this.inventory.hat >= needed.hat;
        
        if (hasAll) {
            this.showWinMessage();
        }
    }

    /**
     * Show "too small" message near item
     */
    showTooSmallMessage(item, x, y) {
        // Check if we recently showed message for this item (prevent spam)
        if (!item.lastWarningTime) {
            item.lastWarningTime = 0;
        }
        
        const timeSinceLastWarning = this.time.now - item.lastWarningTime;
        if (timeSinceLastWarning < 2000) return; // 2 second cooldown
        
        item.lastWarningTime = this.time.now;
        
        // Create warning text
        const warningText = this.add.text(x, y - 40, 'Too small! Come back when bigger', {
            fontSize: '18px',
            fontFamily: 'Indie Flower, cursive',
            color: '#E87722',
            stroke: '#FFFFFF',
            strokeThickness: 4,
            align: 'center'
        });
        warningText.setOrigin(0.5);
        warningText.setDepth(10000);
        
        // Fade out and float up animation
        this.tweens.add({
            targets: warningText,
            y: y - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Cubic.easeOut',
            onComplete: () => warningText.destroy()
        });
    }

    /**
     * Check proximity to man and show dialogue
     */
    checkManDialogue(snowball) {
        // Find the man sprite
        const man = this.mapData.specialAreas.find(area => area.type === 'man');
        if (!man || !man.sprite) return;
        
        const snowballPos = snowball.getPosition();
        const distance = Phaser.Math.Distance.Between(
            snowballPos.x, snowballPos.y,
            man.sprite.x, man.sprite.y
        );
        
        // Show dialogue if close enough (within 150 pixels) and cooldown passed
        const cooldown = 3000; // 3 seconds between dialogues
        const timeSinceLastDialogue = this.time.now - (this.lastDialogueTime || 0);
        
        if (distance < 150 && !this.dialogueSystem.isShowing() && timeSinceLastDialogue > cooldown) {
            if (man.sprite.hasHat) {
                // Man still has his hat
                this.dialogueSystem.showDialogue(
                    man.sprite.x, 
                    man.sprite.y,
                    "It's freezing out here! Thank god I have my hat.",
                    2000
                );
            } else {
                // Hat was taken
                this.dialogueSystem.showDialogue(
                    man.sprite.x, 
                    man.sprite.y,
                    "Hey! Give me back my hat!",
                    2000
                );
            }
            
            // Store last dialogue time to prevent spamming
            this.lastDialogueTime = this.time.now;
        }
    }

    /**
     * Show win message
     */
    showWinMessage() {
        // Create win message overlay
        const winDiv = document.createElement('div');
        winDiv.id = 'win-message';
        winDiv.className = 'show';
        winDiv.innerHTML = `
            <h1>A Good Snowman!</h1>
            <p>You collected all the parts!</p>
            <p>Refresh to play again</p>
        `;
        document.body.appendChild(winDiv);
    }
}

export default GameScene;

