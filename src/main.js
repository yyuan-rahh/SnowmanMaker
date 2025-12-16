import CONFIG from './config.js';
import { GameScene } from './scenes/GameScene.js';

console.log('Main.js loaded');
console.log('Phaser available:', typeof Phaser !== 'undefined');

/**
 * Main Phaser game configuration and initialization
 */
const config = {
    type: Phaser.AUTO,
    width: CONFIG.width,
    height: CONFIG.height,
    parent: 'game-container',
    backgroundColor: '#F5F3E9',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Create game instance
try {
    console.log('Creating Phaser game...');
    const game = new Phaser.Game(config);
    console.log('Game created successfully');
    
    // Export for debugging
    window.game = game;
} catch (error) {
    console.error('Error creating game:', error);
    alert('Error creating game: ' + error.message + '\nCheck console (F12) for details');
}

