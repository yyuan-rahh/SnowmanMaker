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
        hat: 2.0,
        scarf: 3.0  // Need to be really big to take the scarf!
    },
    
    // Items needed to complete game
    itemsNeeded: {
        carrot: 1,  // nose
        twig: 2,    // arms
        coal: 8,    // 2 eyes + 6 buttons
        hat: 1,     // hat
        scarf: 1    // scarf
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
    },

    // Snow floor texture (procedural, cached)
    snowFloor: {
        tileSize: 512,          // px; repeated across the whole world
        baseGrid: 16,           // base noise grid resolution (higher = smaller features)
        octaves: 4,             // multi-octave value noise
        intensity: 0.05,        // 0..1 brightness variation strength
        alpha: 0.55,            // 0..1 opacity of the whole snow floor layer
        speckleDensity: 0.0015, // dots per pixel (approx)
        driftBlobs: 0,          // soft “wind drift” ellipses (set 0 to remove big translucent blobs)
        baseColorHex: '#E6DDD1' // texture tint (background color remains unchanged)
    }
};

export default CONFIG;
