import PALETTE from '../ColorPalette.js';

/**
 * Particle effects for collection and other events
 */
export class ParticleEffects {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Create sparkle effect at position
     */
    createSparkles(x, y, color = PALETTE.sparkleYellow) {
        // Create temporary graphics for sparkle particles
        const particles = [];
        
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 50; // Upward bias
            
            const sparkle = this.scene.add.circle(x, y, 3 + Math.random() * 2, color, 1);
            sparkle.setDepth(10000);
            
            particles.push({
                sprite: sparkle,
                vx,
                vy,
                life: 0,
                maxLife: 500 + Math.random() * 300
            });
        }
        
        // Animate particles
        const updateParticles = () => {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life += 16;
                
                if (p.life >= p.maxLife) {
                    p.sprite.destroy();
                    particles.splice(i, 1);
                    continue;
                }
                
                // Update position
                p.sprite.x += p.vx * 0.016;
                p.sprite.y += p.vy * 0.016;
                p.vy += 200 * 0.016; // Gravity
                
                // Fade out
                const alpha = 1 - (p.life / p.maxLife);
                p.sprite.setAlpha(alpha);
            }
            
            if (particles.length > 0) {
                requestAnimationFrame(updateParticles);
            }
        };
        
        updateParticles();
    }

    /**
     * Create collection poof effect
     */
    createPoof(x, y) {
        // Create expanding circle
        const poof = this.scene.add.circle(x, y, 10, PALETTE.white, 0.6);
        poof.setDepth(10000);
        
        this.scene.tweens.add({
            targets: poof,
            radius: 40,
            alpha: 0,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => poof.destroy()
        });
    }

    /**
     * Create growing trail effect when snowball grows
     */
    createGrowthEffect(snowball) {
        const pos = snowball.getPosition();
        
        // Brief flash
        const flash = this.scene.add.circle(pos.x, pos.y, snowball.radius, PALETTE.sparkleWhite, 0.5);
        flash.setDepth(10000);
        
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 1.5,
            duration: 300,
            ease: 'Cubic.easeOut',
            onComplete: () => flash.destroy()
        });
    }

    /**
     * Create switch indicator when changing snowballs
     */
    createSwitchIndicator(snowball, number) {
        const pos = snowball.getPosition();
        
        // Number indicator
        const text = this.scene.add.text(pos.x, pos.y - 80, number.toString(), {
            fontSize: '48px',
            fontFamily: 'Indie Flower, cursive',
            color: PALETTE.carrotOrangeHex,
            stroke: PALETTE.whiteHex,
            strokeThickness: 4
        });
        text.setOrigin(0.5);
        text.setDepth(10000);
        
        this.scene.tweens.add({
            targets: text,
            y: pos.y - 120,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    /**
     * Create snowfall effect across the visible screen
     */
    createSnowfall() {
        const camera = this.scene.cameras.main;
        const viewBounds = {
            left: camera.scrollX - 200,
            right: camera.scrollX + camera.width + 200,
            top: camera.scrollY - 200,
            bottom: camera.scrollY + camera.height + 200
        };
        
        const snowflakes = [];
        const numFlakes = 80; // Number of snowflakes
        
        // Create snowflakes
        for (let i = 0; i < numFlakes; i++) {
            const x = viewBounds.left + Math.random() * (viewBounds.right - viewBounds.left);
            const y = viewBounds.top - Math.random() * 200; // Start above screen
            const size = 2 + Math.random() * 4;
            
            const flake = this.scene.add.circle(x, y, size, PALETTE.white, 0.7 + Math.random() * 0.3);
            flake.setDepth(9999); // Above most things but below UI
            
            const fallSpeed = 50 + Math.random() * 50;
            const swaySpeed = 30 + Math.random() * 20;
            const swayAmount = 20 + Math.random() * 30;
            
            snowflakes.push({
                sprite: flake,
                startX: x,
                fallSpeed,
                swaySpeed,
                swayAmount,
                swayOffset: Math.random() * Math.PI * 2,
                life: 0
            });
        }
        
        // Animate snowflakes
        const updateSnowflakes = () => {
            for (let i = snowflakes.length - 1; i >= 0; i--) {
                const flake = snowflakes[i];
                flake.life += 16;
                
                // Fall down
                flake.sprite.y += flake.fallSpeed * 0.016;
                
                // Sway side to side
                const swayX = Math.sin((flake.life / 1000) * flake.swaySpeed + flake.swayOffset) * flake.swayAmount;
                flake.sprite.x = flake.startX + swayX;
                
                // Remove if off screen or after 8 seconds
                if (flake.sprite.y > viewBounds.bottom || flake.life > 8000) {
                    flake.sprite.destroy();
                    snowflakes.splice(i, 1);
                }
            }
            
            if (snowflakes.length > 0) {
                requestAnimationFrame(updateSnowflakes);
            }
        };
        
        updateSnowflakes();
    }
}

export default ParticleEffects;

