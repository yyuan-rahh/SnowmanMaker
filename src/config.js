// Game configuration constants
export const CONFIG = {
    // Canvas size
    width: 1400,
    height: 900,
    
    // Isometric settings
    iso: {
        tileWidth: 64,
        tileHeight: 32,
        angle: 30
    },
    
    // Map settings
    map: {
        width: 100,
        height: 100,
        numRooms: 8
    },
    
    // Snowball settings
    snowball: {
        startRadius: 20,
        maxRadius: 60,
        growthRate: 0.0005, // Growth per pixel traveled (slower)
        speed: 150,
        friction: 0.95
    },
    
    // Item collection requirements (snowball scale multiplier)
    itemRequirements: {
        carrot: 1.0,
        twig: 1.0,
        coal: 1.5,
        hat: 2.0
    },
    
    // Items needed to complete game
    itemsNeeded: {
        carrot: 1,  // nose
        twig: 2,    // arms
        coal: 8,    // 2 eyes + 6 buttons
        hat: 1      // hat
    },
    
    // Camera settings
    camera: {
        smoothing: 0.1,
        switchDuration: 500  // ms
    },
    
    // Trail settings
    trail: {
        spawnInterval: 50,  // ms
        lifetime: 2000,     // ms
        maxParticles: 100
    }
};

export default CONFIG;

