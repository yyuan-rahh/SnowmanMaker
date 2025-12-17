import CONFIG from '../config.js';
import PALETTE from '../graphics/ColorPalette.js';
import { TerrainRenderer } from '../graphics/TerrainRenderer.js';
import { SnowballSprite } from '../graphics/sprites/SnowballSprite.js';
import { GrassTrailSprite } from '../graphics/sprites/GrassTrailSprite.js';
import { ItemSprites } from '../graphics/sprites/ItemSprites.js';
import { CarSprite } from '../graphics/sprites/CarSprite.js';
import { Snowball } from '../entities/Snowball.js';
import { CollectibleItem } from '../entities/CollectibleItem.js';
import { MapGenerator } from '../systems/MapGenerator.js';
import { GrassTrailSystem } from '../systems/GrassTrailSystem.js';
import { RoadSystem } from '../systems/RoadSystem.js';
import { IsometricConverter } from '../systems/IsometricConverter.js';
import { ParticleEffects } from '../graphics/effects/ParticleEffects.js';
import { DialogueSystem } from '../ui/DialogueSystem.js';
import { SantaSprite } from '../graphics/sprites/SantaSprite.js';
import { DogWalkerSprite } from '../graphics/sprites/DogWalkerSprite.js';
import { SoundSystem } from '../systems/SoundSystem.js';

/**
 * Main game scene
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        console.log('GameScene.create() started');
        console.log('Scene is:', this);
        console.log('Canvas exists:', !!this.sys.game.canvas);
        
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
            this.soundSystem = new SoundSystem(this);
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
        
            // Initialize road system with traffic
            console.log('Initializing road system...');
            this.roadSystem = new RoadSystem(this);
            this.roadSystem.initialize();
            console.log('Road system initialized');
        
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
            hat: 0,
            scarf: 0
        };
        
            this.updateUI();
            
            // Setup Santa rescue button
            this.setupSantaRescue();
            
            // Setup zoom controls
            this.setupZoomControls();
            
            // Setup reset button
            this.setupResetButton();
            
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
        
        // Car sprites
        const carGen = new CarSprite(this);
        carGen.generateAll();
        
        // Santa sprite
        const santaGen = new SantaSprite(this);
        santaGen.generate();
        
        // Dog walker sprites
        const dogWalkerGen = new DogWalkerSprite(this);
        dogWalkerGen.generateAll();
        
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
        // Terrain rendering disabled (large green circles removed)
        // const cam = this.cameras.main;
        // this.terrainGraphics.clear();
        // this.terrainRenderer.renderTerrain(this.terrainGraphics, cam.scrollX + cam.width/2, cam.scrollY + cam.height/2);
        
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
        
        // Update road system (cars)
        if (this.roadSystem) {
            this.roadSystem.update(delta);
            
            // Check collision between active snowball and cars
            this.checkCarCollisions(activeSnowball);
        }
        
        // Check snowfall timer (every 45 seconds)
        if (!this.lastSnowfallTime) this.lastSnowfallTime = 0;
        if (time - this.lastSnowfallTime > 45000) {
            this.particleEffects.createSnowfall();
            this.lastSnowfallTime = time;
        }
        
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
                        
                        // Play collection sound
                        this.soundSystem.playItemCollect();
                        
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
        
        // Check snowball collisions for stacking
        this.checkSnowballCollisions();
        
        // Update positions of stacked snowballs
        this.updateStackedSnowballs();
        
        // Check collision with dog walker for scarf stealing
        this.checkDogWalkerCollision(activeSnowball);
        
        // Animate dog walker
        this.animateDogWalker(time);
        
        // Update dog chase
        this.updateDogChase(delta);
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('carrot-count').textContent = this.inventory.carrot;
        document.getElementById('twig-count').textContent = this.inventory.twig;
        document.getElementById('coal-count').textContent = this.inventory.coal;
        document.getElementById('hat-count').textContent = this.inventory.hat;
        document.getElementById('scarf-count').textContent = this.inventory.scarf;
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
            this.inventory.hat >= needed.hat &&
            this.inventory.scarf >= needed.scarf;
        
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
            duration: 3000,
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
     * Check collision between snowball and cars (precise physics body overlap)
     */
    checkCarCollisions(snowball) {
        if (this.gameIsOver) return; // Don't check if game is already over
        
        const cars = this.roadSystem.getCars();
        
        for (const car of cars) {
            // Use Phaser's physics overlap detection for precise collision
            if (this.physics.overlap(snowball.sprite, car)) {
                this.gameOver();
                break;
            }
        }
    }

    /**
     * Handle game over (hit by car)
     */
    gameOver() {
        if (this.gameIsOver) return;
        
        this.gameIsOver = true;
        
        // Play lose sound
        this.soundSystem.playLoseSound();
        this.soundSystem.playCarHonk();
        
        // Pause physics
        this.physics.pause();
        
        // Stop car spawning
        if (this.roadSystem) {
            this.roadSystem.destroy();
        }
        
        // Show game over modal
        const modal = document.getElementById('gameover-modal');
        modal.classList.add('show');
        
        // Setup restart button
        const restartBtn = document.getElementById('restart-after-gameover');
        const handleRestart = () => {
            modal.classList.remove('show');
            restartBtn.removeEventListener('click', handleRestart);
            this.gameIsOver = false;
            this.scene.restart();
        };
        
        restartBtn.addEventListener('click', handleRestart);
    }

    /**
     * Setup reset button
     */
    setupResetButton() {
        const resetBtn = document.getElementById('reset-button');
        
        resetBtn.addEventListener('click', () => {
            // Confirm reset
            if (confirm('Reset the entire game? All progress will be lost!')) {
                // Restart the scene (resets everything)
                this.scene.restart();
            }
        });
    }

    /**
     * Setup zoom controls
     */
    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        
        const minZoom = 0.5;
        const maxZoom = 2.0;
        const zoomStep = 0.2;
        
        // Zoom in
        zoomInBtn.addEventListener('click', () => {
            const currentZoom = this.cameras.main.zoom;
            const newZoom = Math.min(currentZoom + zoomStep, maxZoom);
            
            this.tweens.add({
                targets: this.cameras.main,
                zoom: newZoom,
                duration: 300,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Zoom out
        zoomOutBtn.addEventListener('click', () => {
            const currentZoom = this.cameras.main.zoom;
            const newZoom = Math.max(currentZoom - zoomStep, minZoom);
            
            this.tweens.add({
                targets: this.cameras.main,
                zoom: newZoom,
                duration: 300,
                ease: 'Sine.easeInOut'
            });
        });
    }

    /**
     * Setup Santa rescue button and modal
     */
    setupSantaRescue() {
        const helpButton = document.getElementById('help-button');
        const modal = document.getElementById('santa-modal');
        const yesButton = document.getElementById('santa-yes');
        const noButton = document.getElementById('santa-no');

        // Show modal when help button clicked
        helpButton.addEventListener('click', () => {
            modal.classList.add('show');
        });

        // Handle "Yes" response - Santa comes to help!
        yesButton.addEventListener('click', () => {
            modal.classList.remove('show');
            this.summonSanta();
        });

        // Handle "No" response - Close modal, no help
        noButton.addEventListener('click', () => {
            modal.classList.remove('show');
            // Maybe show a sad message
            this.dialogueSystem.showDialogue(
                this.cameras.main.scrollX + this.cameras.main.width / 2,
                this.cameras.main.scrollY + 100,
                "Santa says: Well, maybe next year! Keep trying!",
                2500
            );
        });
    }

    /**
     * Summon Santa to rescue the snowball
     */
    summonSanta() {
        const activeSnowball = this.snowballs[this.activeSnowballIndex];
        const snowballPos = activeSnowball.getPosition();

        // Play Santa arrival sound
        this.soundSystem.playSantaSound();

        // Create Santa sprite off-screen (left side)
        const startX = snowballPos.x - 800;
        const startY = snowballPos.y - 200;
        const santa = this.add.sprite(startX, startY, 'santa_sled');
        santa.setScale(1.5);
        santa.setDepth(10000);

        // Animate Santa flying in
        this.tweens.add({
            targets: santa,
            x: snowballPos.x,
            y: snowballPos.y - 100,
            duration: 2000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // Magic effect!
                this.particleEffects.createSparkles(snowballPos.x, snowballPos.y, PALETTE.sparkleYellow);
                
                // Reset snowball size
                activeSnowball.distanceTraveled = 0;
                activeSnowball.scale = 1.0;
                activeSnowball.radius = CONFIG.snowball.startRadius;
                activeSnowball.sprite.setScale(1.0);
                
                // Update physics body
                activeSnowball.sprite.body.setCircle(activeSnowball.radius);
                activeSnowball.sprite.body.setOffset(
                    (activeSnowball.sprite.width - activeSnowball.radius * 2) / 2,
                    (activeSnowball.sprite.height - activeSnowball.radius * 2) / 2
                );
                
                this.updateSizeDisplay(1.0);
                
                // Show thank you message
                this.dialogueSystem.showDialogue(
                    snowballPos.x,
                    snowballPos.y - 150,
                    "Ho ho ho! You're small again! Merry Christmas!",
                    2500
                );
                
                // Fly away
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: santa,
                        x: snowballPos.x + 800,
                        y: snowballPos.y - 200,
                        duration: 2000,
                        ease: 'Sine.easeInOut',
                        onComplete: () => santa.destroy()
                    });
                });
            }
        });
    }

    /**
     * Show win message
     */
    showWinMessage() {
        // Show collection complete modal
        if (this.collectionComplete) return; // Only show once
        this.collectionComplete = true;
        
        // Play win sound
        this.soundSystem.playWinSound();
        
        const modal = document.getElementById('complete-modal');
        modal.classList.add('show');
        
        // Setup close button
        const closeBtn = document.getElementById('close-complete');
        const handleClose = () => {
            modal.classList.remove('show');
            closeBtn.removeEventListener('click', handleClose);
        };
        
        closeBtn.addEventListener('click', handleClose);
    }

    /**
     * Check collisions between snowballs and handle stacking
     */
    checkSnowballCollisions() {
        // Check each pair of snowballs
        for (let i = 0; i < this.snowballs.length; i++) {
            for (let j = i + 1; j < this.snowballs.length; j++) {
                const snowball1 = this.snowballs[i];
                const snowball2 = this.snowballs[j];
                
                // Skip if either is already stacked
                if (snowball1.isStacked || snowball2.isStacked) continue;
                
                const pos1 = snowball1.getPosition();
                const pos2 = snowball2.getPosition();
                const distance = Phaser.Math.Distance.Between(pos1.x, pos1.y, pos2.x, pos2.y);
                const minDistance = snowball1.radius + snowball2.radius;
                
                // Check if snowballs are touching
                if (distance < minDistance) {
                    // Determine which is smaller
                    const scale1 = snowball1.getScale();
                    const scale2 = snowball2.getScale();
                    
                    let smaller, larger;
                    if (scale1 < scale2) {
                        smaller = snowball1;
                        larger = snowball2;
                    } else {
                        smaller = snowball2;
                        larger = snowball1;
                    }
                    
                    // Stack the smaller one on top
                    this.stackSnowball(smaller, larger);
                }
            }
        }
    }

    /**
     * Stack one snowball on top of another
     */
    stackSnowball(smallerSnowball, largerSnowball) {
        smallerSnowball.isStacked = true;
        smallerSnowball.stackedOn = largerSnowball;
        
        // Play collision sound
        this.soundSystem.playCollisionSound();
        
        // Disable physics for smaller snowball
        if (smallerSnowball.sprite.body) {
            smallerSnowball.sprite.body.setVelocity(0, 0);
            smallerSnowball.sprite.body.enable = false;
        }
        
        // Position smaller on top of larger
        const largerPos = largerSnowball.getPosition();
        const offsetY = -(largerSnowball.radius + smallerSnowball.radius * 0.7);
        
        smallerSnowball.sprite.x = largerPos.x;
        smallerSnowball.sprite.y = largerPos.y + offsetY;
        
        // Update shadow position
        if (smallerSnowball.shadow) {
            smallerSnowball.shadow.x = largerPos.x;
            smallerSnowball.shadow.y = largerPos.y + offsetY;
        }
        
        // Increase depth so it appears on top
        smallerSnowball.sprite.setDepth(largerSnowball.sprite.depth + 100);
        
        // Switch to the larger snowball if smaller was active
        if (smallerSnowball.isActive) {
            const largerIndex = this.snowballs.indexOf(largerSnowball);
            this.switchSnowball(largerIndex);
        }
    }
    
    /**
     * Update stacked snowball positions
     */
    updateStackedSnowballs() {
        this.snowballs.forEach(snowball => {
            if (snowball.isStacked && snowball.stackedOn) {
                const largerPos = snowball.stackedOn.getPosition();
                const offsetY = -(snowball.stackedOn.radius + snowball.radius * 0.7);
                
                snowball.sprite.x = largerPos.x;
                snowball.sprite.y = largerPos.y + offsetY;
                
                if (snowball.shadow) {
                    snowball.shadow.x = largerPos.x;
                    snowball.shadow.y = largerPos.y + offsetY;
                }
            }
        });
    }

    /**
     * Check collision between snowball and dog walker for scarf stealing
     */
    checkDogWalkerCollision(snowball) {
        const dogWalkerArea = this.mapData?.specialAreas.find(area => area.type === 'dog_walker');
        if (!dogWalkerArea || !dogWalkerArea.sprite || !dogWalkerArea.sprite.hasScarf) return;
        
        const walker = dogWalkerArea.sprite;
        const snowballPos = snowball.getPosition();
        const distance = Phaser.Math.Distance.Between(
            snowballPos.x, snowballPos.y,
            walker.x, walker.y
        );
        
        // Check if snowball is touching dog walker
        if (distance < snowball.radius + 30) {
            const snowballScale = snowball.getScale();
            const requiredSize = CONFIG.itemRequirements.scarf;
            
            if (snowballScale >= requiredSize) {
                // Steal the scarf!
                this.stealScarf(walker);
            } else {
                // Show "too small" message
                if (!walker.lastWarningTime) walker.lastWarningTime = 0;
                const timeSinceLastWarning = this.time.now - walker.lastWarningTime;
                
                if (timeSinceLastWarning > 2000) {
                    const warningText = this.add.text(walker.x, walker.y - 80, 'Too small! Come back when bigger', {
                        fontSize: '18px',
                        fontFamily: 'Indie Flower, cursive',
                        color: '#E87722',
                        stroke: '#000000',
                        strokeThickness: 3,
                        align: 'center'
                    }).setOrigin(0.5);
                    
                    this.tweens.add({
                        targets: warningText,
                        y: walker.y - 120,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => warningText.destroy()
                    });
                    
                    walker.lastWarningTime = this.time.now;
                }
            }
        }
    }

    /**
     * Handle stealing the scarf from dog walker
     */
    stealScarf(walker) {
        // Mark scarf as taken
        walker.hasScarf = false;
        
        // Change sprite to version without scarf
        walker.setTexture('person_no_scarf');
        
        // Add to inventory
        this.inventory.scarf++;
        this.updateUI();
        this.checkWinCondition();
        
        // Play collection sound
        this.soundSystem.playItemCollect();
        
        // Show dialogue
        this.dialogueSystem.showDialogue(
            walker.x,
            walker.y,
            "Hey! Give me my scarf back!",
            3000
        );
        
        // Particle effects
        this.particleEffects.createSparkles(walker.x, walker.y - 50);
        this.particleEffects.createPoof(walker.x, walker.y - 50);
        
        // After 4 seconds, start dog chase
        const dogArea = this.mapData?.specialAreas.find(area => area.type === 'dog');
        if (dogArea && dogArea.sprite) {
            this.time.delayedCall(4000, () => {
                if (dogArea.sprite) {
                    dogArea.sprite.isChasing = true;
                    // Play bark sound when chase starts
                    this.soundSystem.playDogBark();
                }
            });
        }
    }

    /**
     * Animate dog walker walking back and forth
     */
    animateDogWalker(time) {
        const dogWalkerArea = this.mapData?.specialAreas.find(area => area.type === 'dog_walker');
        const dogArea = this.mapData?.specialAreas.find(area => area.type === 'dog');
        if (!dogWalkerArea || !dogWalkerArea.sprite) return;
        
        const walker = dogWalkerArea.sprite;
        
        // Only walk if dog is not chasing (stop when scarf is stolen)
        if (!dogArea?.sprite?.isChasing) {
            // Walk back and forth - direct position update for static body
            walker.y += walker.walkSpeed * (1/60) * walker.walkDirection; // Approximate delta for 60fps
            
            // Check boundaries and reverse direction
            if (walker.y <= walker.walkMinY) {
                walker.y = walker.walkMinY;
                walker.walkDirection = 1; // Start walking down (south)
            } else if (walker.y >= walker.walkMaxY) {
                walker.y = walker.walkMaxY;
                walker.walkDirection = -1; // Start walking up (north)
            }
            
            // Update physics body position
            if (walker.body) {
                walker.body.updateFromGameObject();
            }
            
            // Update depth
            walker.setDepth(walker.y * 10 + 1);
            
            // Keep dog next to walker if not chasing
            if (dogArea && dogArea.sprite && !dogArea.sprite.isChasing) {
                dogArea.sprite.x = walker.x + 40;
                dogArea.sprite.y = walker.y + 10;
                dogArea.sprite.setDepth(dogArea.sprite.y * 10);
            }
        }
        
        // Alternate between two walking frames every 250ms for smooth animation
        if (!walker.lastAnimTime) walker.lastAnimTime = time;
        if (time - walker.lastAnimTime > 250) {
            walker.animFrame = walker.animFrame === 0 ? 1 : 0;
            
            // Use correct texture based on whether scarf is still present
            let texture;
            if (walker.hasScarf) {
                texture = walker.animFrame === 0 ? 'person_with_scarf' : 'person_with_scarf_2';
            } else {
                texture = walker.animFrame === 0 ? 'person_no_scarf' : 'person_no_scarf_2';
            }
            
            walker.setTexture(texture);
            walker.lastAnimTime = time;
        }
    }

    /**
     * Update dog chase behavior
     */
    updateDogChase(delta) {
        const dogArea = this.mapData?.specialAreas.find(area => area.type === 'dog');
        if (!dogArea || !dogArea.sprite || !dogArea.sprite.isChasing) return;
        
        const dog = dogArea.sprite;
        const activeSnowball = this.snowballs[this.activeSnowballIndex];
        const snowballPos = activeSnowball.getPosition();
        
        // Check if all items are collected
        const needed = CONFIG.itemsNeeded;
        const allItemsCollected = 
            this.inventory.carrot >= needed.carrot &&
            this.inventory.twig >= needed.twig &&
            this.inventory.coal >= needed.coal &&
            this.inventory.hat >= needed.hat &&
            this.inventory.scarf >= needed.scarf;
        
        if (allItemsCollected) {
            // Passive following mode - dog follows slowly and happily
            const distance = Phaser.Math.Distance.Between(dog.x, dog.y, snowballPos.x, snowballPos.y);
            
            // Follow at a distance, slower speed
            if (distance > 150) {
                const dogSpeed = 80; // Much slower, passive following
                const angle = Phaser.Math.Angle.Between(dog.x, dog.y, snowballPos.x, snowballPos.y);
                
                dog.body.setVelocity(
                    Math.cos(angle) * dogSpeed,
                    Math.sin(angle) * dogSpeed
                );
            } else {
                // Stay nearby, stop moving
                dog.body.setVelocity(0, 0);
            }
            
            dog.setDepth(dog.y * 10);
            return; // Don't chase aggressively
        }
        
        // Aggressive chase mode (original behavior)
        // Periodic barking during chase (every 2 seconds)
        if (!dog.lastBarkTime) dog.lastBarkTime = 0;
        const timeSinceLastBark = this.time.now - dog.lastBarkTime;
        if (timeSinceLastBark > 2000) {
            this.soundSystem.playDogBark();
            dog.lastBarkTime = this.time.now;
        }
        
        // Dog speed (slower than snowball - snowball max is 150, so dog is slower)
        const dogSpeed = 120;
        
        // Calculate direction to snowball
        const angle = Phaser.Math.Angle.Between(dog.x, dog.y, snowballPos.x, snowballPos.y);
        
        // Move dog toward snowball
        dog.body.setVelocity(
            Math.cos(angle) * dogSpeed,
            Math.sin(angle) * dogSpeed
        );
        
        // Update dog depth
        dog.setDepth(dog.y * 10);
        
        // Check if dog caught the snowball
        const distance = Phaser.Math.Distance.Between(dog.x, dog.y, snowballPos.x, snowballPos.y);
        if (distance < activeSnowball.radius + 20) {
            this.dogCaughtSnowball();
        }
    }

    /**
     * Handle dog catching the snowball - game over
     */
    dogCaughtSnowball() {
        if (this.gameIsOver) return;
        
        this.gameIsOver = true;
        
        // Play lose sound and final bark
        this.soundSystem.playLoseSound();
        this.soundSystem.playDogBark();
        
        // Pause physics
        this.physics.pause();
        
        // Stop car spawning
        if (this.roadSystem) {
            this.roadSystem.destroy();
        }
        
        // Show custom game over modal for dog
        const modal = document.getElementById('gameover-modal');
        const heading = modal.querySelector('h2');
        const message = modal.querySelector('p');
        const tip = modal.querySelector('.game-tip');
        
        heading.textContent = '🐕 Caught!';
        message.textContent = 'The dog caught you!';
        tip.textContent = "🐕 Don't steal scarves from dog walkers!";
        
        modal.classList.add('show');
        
        // Setup restart button
        const restartBtn = document.getElementById('restart-after-gameover');
        const handleRestart = () => {
            modal.classList.remove('show');
            restartBtn.removeEventListener('click', handleRestart);
            
            // Reset modal text for car game overs
            heading.textContent = '💥 Game Over!';
            message.textContent = 'You got hit by a car!';
            tip.textContent = '🚗 Watch out for traffic next time!';
            
            this.gameIsOver = false;
            this.scene.restart();
        };
        
        restartBtn.addEventListener('click', handleRestart);
    }
}

export default GameScene;

