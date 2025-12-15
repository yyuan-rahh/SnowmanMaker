// Game State
const gameState = {
    snowballs: [],
    snowballCount: 0,
    isDragging: false,
    currentSnowball: null,
    dragStartPos: null,
    dragDistance: 0,
    selectedSnowball: null,
    levitatingSnowball: null,
    moveSpeed: 0.3,
    keys: {},
    ground: null,
    groundTexture: null,
    dynamicTexture: null,
    lastSnowballPos: null,
    snowballDistanceTraveled: 0
};

// Initialize the game
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    
    // Create the scene
    const scene = createScene(engine, canvas);
    
    // UI Setup
    setupUI();
    
    // Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
    
    // Resize handler
    window.addEventListener('resize', () => {
        engine.resize();
    });
});

function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.53, 0.81, 0.92); // Sky blue
    
    // ===== CAMERA SETUP =====
    // Using UniversalCamera for WASD movement
    const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 8, -15), scene);
    camera.rotation = new BABYLON.Vector3(0.3, 0, 0); // Slight downward angle
    camera.speed = gameState.moveSpeed;
    camera.angularSensibility = 2000;
    
    // Attach camera controls (right-click to rotate)
    camera.inputs.clear();
    camera.inputs.addMouse(false); // Mouse movement without pointer lock
    camera.inputs.addKeyboard();
    
    // ===== LIGHTING =====
    // Hemisphere light for outdoor lighting
    const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.8;
    hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
    hemiLight.groundColor = new BABYLON.Color3(0.5, 0.5, 0.6);
    
    // Directional light for shadows
    const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
    dirLight.position = new BABYLON.Vector3(20, 40, 20);
    dirLight.intensity = 0.6;
    
    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;
    
    // ===== TERRAIN & ENVIRONMENT =====
    createEnvironment(scene, shadowGenerator);
    
    // ===== MOVEMENT SYSTEM =====
    setupMovement(scene, camera);
    
    // ===== SNOWBALL ROLLING MECHANIC =====
    setupSnowballMechanic(scene, camera, shadowGenerator);
    
    return scene;
}

function createEnvironment(scene, shadowGenerator) {
    // Snow Ground with texture
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {
        width: 50,
        height: 50,
        subdivisions: 10
    }, scene);
    
    gameState.ground = ground;
    
    // Create dynamic texture that will be directly painted (snow that reveals grass)
    const dynamicTexture = new BABYLON.DynamicTexture('groundTexture', 2048, scene, false);
    const ctx = dynamicTexture.getContext();
    
    // First layer: Draw grass/dirt base
    ctx.fillStyle = '#6B8E23'; // Olive green grass base
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Add grass texture
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 2048;
        const shade = Math.random() * 40;
        ctx.fillStyle = `rgb(${107 + shade}, ${142 + shade}, ${35 + shade})`;
        ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }
    
    // Second layer: Cover everything with textured snow (this will be removed as snowball rolls)
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, 2048, 2048);
    
    // Add snow texture details (sparkles/grain)
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 2048;
        const brightness = Math.random() * 30 + 220;
        const size = Math.random() * 3 + 1;
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 10}, 0.8)`;
        ctx.fillRect(x, y, size, size);
    }
    
    dynamicTexture.update();
    gameState.dynamicTexture = dynamicTexture;
    
    // Simple material using only the dynamic texture
    const snowMaterial = new BABYLON.StandardMaterial('snowMat', scene);
    snowMaterial.diffuseTexture = dynamicTexture;
    snowMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);
    snowMaterial.specularPower = 32;
    snowMaterial.ambientColor = new BABYLON.Color3(0.95, 0.95, 0.98);
    
    ground.material = snowMaterial;
    ground.receiveShadows = true;
    
    // Create invisible boundaries
    const boundarySize = 25;
    createBoundary(scene, boundarySize);
    
    // Add some trees around the perimeter
    createTrees(scene, shadowGenerator);
    
    // Add simple skybox
    const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', {size: 500}, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.6, 0.8, 0.95);
    skybox.material = skyboxMaterial;
}

function createBoundary(scene, size) {
    // Create invisible walls at the edges
    const wallHeight = 10;
    const wallThickness = 1;
    
    const walls = [
        {pos: new BABYLON.Vector3(0, wallHeight/2, size), size: new BABYLON.Vector3(size*2, wallHeight, wallThickness)},
        {pos: new BABYLON.Vector3(0, wallHeight/2, -size), size: new BABYLON.Vector3(size*2, wallHeight, wallThickness)},
        {pos: new BABYLON.Vector3(size, wallHeight/2, 0), size: new BABYLON.Vector3(wallThickness, wallHeight, size*2)},
        {pos: new BABYLON.Vector3(-size, wallHeight/2, 0), size: new BABYLON.Vector3(wallThickness, wallHeight, size*2)}
    ];
    
    walls.forEach((wall, i) => {
        const boundary = BABYLON.MeshBuilder.CreateBox(`boundary${i}`, {
            width: wall.size.x,
            height: wall.size.y,
            depth: wall.size.z
        }, scene);
        boundary.position = wall.pos;
        boundary.isVisible = false;
        boundary.checkCollisions = true;
    });
}

function createTrees(scene, shadowGenerator) {
    const treePositions = [
        new BABYLON.Vector3(-15, 0, -15),
        new BABYLON.Vector3(-18, 0, -12),
        new BABYLON.Vector3(15, 0, -15),
        new BABYLON.Vector3(18, 0, -13),
        new BABYLON.Vector3(-16, 0, 15),
        new BABYLON.Vector3(16, 0, 16),
        new BABYLON.Vector3(0, 0, -20),
        new BABYLON.Vector3(-10, 0, 18)
    ];
    
    treePositions.forEach((pos, i) => {
        createTree(scene, pos, shadowGenerator, i);
    });
}

function createTree(scene, position, shadowGenerator, index) {
    // Tree trunk
    const trunk = BABYLON.MeshBuilder.CreateCylinder(`trunk${index}`, {
        height: 3,
        diameter: 0.5
    }, scene);
    trunk.position = new BABYLON.Vector3(position.x, 1.5, position.z);
    
    const trunkMat = new BABYLON.StandardMaterial(`trunkMat${index}`, scene);
    trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
    trunk.material = trunkMat;
    trunk.checkCollisions = true;
    shadowGenerator.addShadowCaster(trunk);
    
    // Tree foliage (snow-covered)
    const foliage = BABYLON.MeshBuilder.CreateCylinder(`foliage${index}`, {
        height: 4,
        diameterTop: 0,
        diameterBottom: 3
    }, scene);
    foliage.position = new BABYLON.Vector3(position.x, 4.5, position.z);
    
    const foliageMat = new BABYLON.StandardMaterial(`foliageMat${index}`, scene);
    foliageMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.3);
    foliageMat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.05);
    foliage.material = foliageMat;
    shadowGenerator.addShadowCaster(foliage);
    
    // Snow cap on tree
    const snowCap = BABYLON.MeshBuilder.CreateCylinder(`snowCap${index}`, {
        height: 0.5,
        diameterTop: 0.3,
        diameterBottom: 3.2
    }, scene);
    snowCap.position = new BABYLON.Vector3(position.x, 6.3, position.z);
    
    const snowCapMat = new BABYLON.StandardMaterial(`snowCapMat${index}`, scene);
    snowCapMat.diffuseColor = new BABYLON.Color3(0.98, 0.98, 1);
    snowCapMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.9);
    snowCap.material = snowCapMat;
}

function setupMovement(scene, camera) {
    // WASD movement
    scene.onBeforeRenderObservable.add(() => {
        const speed = gameState.moveSpeed;
        
        // Get camera's forward and right vectors
        const forward = camera.getDirection(BABYLON.Axis.Z);
        const right = camera.getDirection(BABYLON.Axis.X);
        
        // Keep movement on horizontal plane
        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();
        
        // WASD movement
        if (gameState.keys['w'] || gameState.keys['W']) {
            camera.position.addInPlace(forward.scale(speed));
        }
        if (gameState.keys['s'] || gameState.keys['S']) {
            camera.position.addInPlace(forward.scale(-speed));
        }
        if (gameState.keys['a'] || gameState.keys['A']) {
            camera.position.addInPlace(right.scale(-speed));
        }
        if (gameState.keys['d'] || gameState.keys['D']) {
            camera.position.addInPlace(right.scale(speed));
        }
        
        // Keep camera at consistent height
        camera.position.y = 8;
        
        // Boundary constraints
        const boundary = 22;
        camera.position.x = Math.max(-boundary, Math.min(boundary, camera.position.x));
        camera.position.z = Math.max(-boundary, Math.min(boundary, camera.position.z));
    });
    
    // Keyboard event listeners
    window.addEventListener('keydown', (e) => {
        gameState.keys[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        gameState.keys[e.key] = false;
    });
}

function setupSnowballMechanic(scene, camera, shadowGenerator) {
    const canvas = scene.getEngine().getRenderingCanvas();
    
    // Mouse down - start rolling snowball or levitate
    canvas.addEventListener('pointerdown', (e) => {
        // Right click - levitate snowball
        if (e.button === 2) {
            const pickResult = scene.pick(e.clientX, e.clientY);
            if (pickResult.hit && pickResult.pickedMesh.name.startsWith('snowball')) {
                gameState.levitatingSnowball = pickResult.pickedMesh;
                gameState.levitatingSnowball.metadata = gameState.levitatingSnowball.metadata || {};
                gameState.levitatingSnowball.metadata.levitating = true;
                updateHint('Snowball levitating! Move and click to drop it.');
                e.preventDefault();
                return;
            }
        }
        
        // Left click
        if (e.button !== 0) return;
        
        // If levitating, drop snowball
        if (gameState.levitatingSnowball) {
            const pickResult = scene.pick(e.clientX, e.clientY);
            
            // Check if dropping on another snowball
            if (pickResult.hit && pickResult.pickedMesh.name.startsWith('snowball') && 
                pickResult.pickedMesh !== gameState.levitatingSnowball) {
                stackSnowballs(gameState.levitatingSnowball, pickResult.pickedMesh);
            } else if (pickResult.hit && pickResult.pickedMesh.name === 'ground') {
                // Drop on ground
                gameState.levitatingSnowball.position.y = gameState.levitatingSnowball.scaling.y / 2;
            }
            
            gameState.levitatingSnowball.metadata.levitating = false;
            gameState.levitatingSnowball = null;
            updateHint('Drag snowballs to roll them, or right-click to levitate!');
            return;
        }
        
        // Check if clicking on existing snowball to roll it
        const pickResult = scene.pick(e.clientX, e.clientY);
        if (pickResult.hit && pickResult.pickedMesh.name.startsWith('snowball')) {
            gameState.selectedSnowball = pickResult.pickedMesh;
            gameState.isDragging = true;
            gameState.lastSnowballPos = pickResult.pickedMesh.position.clone();
            gameState.snowballDistanceTraveled = 0;
            updateHint('Drag to roll this snowball! It will grow as it rolls.');
            return;
        }
        
        // Start creating new snowball if on ground
        if (pickResult.hit && pickResult.pickedMesh.name === 'ground') {
            gameState.isDragging = true;
            gameState.dragStartPos = {x: e.clientX, y: e.clientY};
            gameState.snowballDistanceTraveled = 0;
            
            // Create small snowball at picked position
            const snowball = BABYLON.MeshBuilder.CreateSphere(`snowball${Date.now()}`, {
                diameter: 0.8,
                segments: 32 // Higher detail for bumps
            }, scene);
            snowball.position = pickResult.pickedPoint.clone();
            snowball.position.y = 0.4;
            
            // Create realistic snowball material with bumps
            const snowballMat = new BABYLON.StandardMaterial(`snowballMat${Date.now()}`, scene);
            
            // Create bumpy snow texture for snowball
            const snowballTexture = new BABYLON.DynamicTexture(`snowballTex${Date.now()}`, 512, scene, true);
            const sbCtx = snowballTexture.getContext();
            
            // Base white
            sbCtx.fillStyle = '#FAFAFA';
            sbCtx.fillRect(0, 0, 512, 512);
            
            // Add bumpy texture (clumps of snow)
            for (let i = 0; i < 800; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = Math.random() * 8 + 3;
                const brightness = Math.random() * 20 + 235;
                const shadowOffset = Math.random() * 10 + 225;
                
                // Shadow/depth
                sbCtx.fillStyle = `rgb(${shadowOffset}, ${shadowOffset}, ${shadowOffset + 5})`;
                sbCtx.beginPath();
                sbCtx.arc(x + 1, y + 1, size, 0, Math.PI * 2);
                sbCtx.fill();
                
                // Highlight
                sbCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness + 10})`;
                sbCtx.beginPath();
                sbCtx.arc(x, y, size * 0.9, 0, Math.PI * 2);
                sbCtx.fill();
            }
            snowballTexture.update();
            
            snowballMat.diffuseTexture = snowballTexture;
            snowballMat.diffuseColor = new BABYLON.Color3(0.98, 0.98, 1);
            
            // Create bump map for 3D effect
            const bumpTexture = new BABYLON.DynamicTexture(`bumpTex${Date.now()}`, 512, scene, true);
            const bumpCtx = bumpTexture.getContext();
            bumpCtx.fillStyle = '#808080';
            bumpCtx.fillRect(0, 0, 512, 512);
            
            // Random bumps
            for (let i = 0; i < 600; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const size = Math.random() * 10 + 4;
                const depth = Math.random() * 80 + 100;
                
                const gradient = bumpCtx.createRadialGradient(x, y, 0, x, y, size);
                gradient.addColorStop(0, `rgb(${depth + 50}, ${depth + 50}, ${depth + 50})`);
                gradient.addColorStop(1, `rgb(${depth}, ${depth}, ${depth})`);
                
                bumpCtx.fillStyle = gradient;
                bumpCtx.beginPath();
                bumpCtx.arc(x, y, size, 0, Math.PI * 2);
                bumpCtx.fill();
            }
            bumpTexture.update();
            
            snowballMat.bumpTexture = bumpTexture;
            snowballMat.bumpTexture.level = 0.5;
            
            snowballMat.specularColor = new BABYLON.Color3(0.85, 0.85, 0.9);
            snowballMat.specularPower = 48;
            snowballMat.ambientColor = new BABYLON.Color3(0.95, 0.95, 0.98);
            
            snowball.material = snowballMat;
            
            snowball.checkCollisions = true;
            shadowGenerator.addShadowCaster(snowball);
            
            gameState.currentSnowball = snowball;
            gameState.currentSnowball.metadata = {
                currentSize: 0.8,
                distanceTraveled: 0,
                lastPos: pickResult.pickedPoint.clone(),
                rotationAxis: new BABYLON.Vector3(0, 0, 0)
            };
            gameState.lastSnowballPos = pickResult.pickedPoint.clone();
            
            updateHint('Keep dragging to roll the snowball!');
        }
    });
    
    // Disable context menu for right-click
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Mouse move - roll snowball or move levitating snowball
    canvas.addEventListener('pointermove', (e) => {
        // Handle levitating snowball
        if (gameState.levitatingSnowball) {
            const pickResult = scene.pick(e.clientX, e.clientY);
            if (pickResult.hit) {
                const targetPos = pickResult.pickedPoint.clone();
                targetPos.y += gameState.levitatingSnowball.scaling.y / 2 + 2;
                gameState.levitatingSnowball.position = BABYLON.Vector3.Lerp(
                    gameState.levitatingSnowball.position,
                    targetPos,
                    0.3
                );
                
                // Gentle floating animation
                gameState.levitatingSnowball.position.y += Math.sin(Date.now() / 300) * 0.1;
            }
            return;
        }
        
        if (!gameState.isDragging) return;
        
        const pickResult = scene.pick(e.clientX, e.clientY);
        if (!pickResult.hit || pickResult.pickedMesh.name !== 'ground') return;
        
        const snowball = gameState.selectedSnowball || gameState.currentSnowball;
        if (!snowball) return;
        
        const targetPos = pickResult.pickedPoint.clone();
        const lastPos = gameState.lastSnowballPos || snowball.position;
        
        // Calculate distance traveled on ground
        const distance = BABYLON.Vector3.Distance(
            new BABYLON.Vector3(lastPos.x, 0, lastPos.z),
            new BABYLON.Vector3(targetPos.x, 0, targetPos.z)
        );
        
        // Only grow if moving on snow (check if there's grass underneath)
        const onSnow = !isOnGrass(targetPos);
        
        if (onSnow && distance > 0.01) {
            snowball.metadata.distanceTraveled += distance;
            
            // Grow based on distance (slower growth rate)
            const growthRate = 0.15; // Adjust this for growth speed
            const newSize = snowball.metadata.currentSize + (distance * growthRate);
            snowball.metadata.currentSize = newSize;
            
            snowball.scaling = new BABYLON.Vector3(newSize, newSize, newSize);
        }
        
        // Move snowball with speed limit
        targetPos.y = snowball.scaling.y / 2;
        const direction = targetPos.subtract(snowball.position);
        
        if (direction.length() > 0.01) {
            // Apply speed limit
            const maxSpeed = 0.5; // Maximum units per frame
            const moveDistance = Math.min(direction.length(), maxSpeed);
            const normalizedDirection = direction.normalize();
            
            snowball.position.addInPlace(normalizedDirection.scale(moveDistance));
            
            // Rolling rotation based on movement direction
            const moveDir = direction.normalize();
            const rotationSpeed = distance * 10;
            
            // Rotate perpendicular to movement direction
            const rotAxis = new BABYLON.Vector3(-moveDir.z, 0, moveDir.x);
            snowball.rotate(rotAxis, rotationSpeed, BABYLON.Space.WORLD);
            
            // Paint grass trail at the bottom contact point of the sphere
            const bottomPoint = new BABYLON.Vector3(
                snowball.position.x,
                0, // Ground level
                snowball.position.z
            );
            paintGrassTrail(bottomPoint, snowball.scaling.x / 2);
        }
        
        gameState.lastSnowballPos = targetPos.clone();
        
        // Check for stacking (only if selected snowball, not new one)
        if (gameState.selectedSnowball) {
            checkSnowballStacking(scene);
        }
    });
    
    // Mouse up - finish rolling
    canvas.addEventListener('pointerup', (e) => {
        if (e.button !== 0) return;
        
        if (gameState.currentSnowball) {
            // Add to snowballs array
            gameState.snowballs.push(gameState.currentSnowball);
            gameState.snowballCount++;
            updateSnowballCounter();
            
            if (gameState.snowballCount < 3) {
                updateHint('Roll another snowball! Try making different sizes.');
            } else {
                updateHint('Right-click snowballs to levitate and stack them!');
            }
            
            gameState.currentSnowball = null;
        }
        
        if (gameState.selectedSnowball) {
            gameState.selectedSnowball = null;
        }
        
        gameState.isDragging = false;
        gameState.lastSnowballPos = null;
    });
}

function paintGrassTrail(position, snowballRadius) {
    if (!gameState.dynamicTexture || !gameState.ground) return;
    
    // Convert world position to texture coordinates
    const groundSize = 50;
    const textureSize = 2048;
    
    // Normalize position to 0-1 range
    const normalizedX = (position.x + groundSize / 2) / groundSize;
    const normalizedZ = (position.z + groundSize / 2) / groundSize;
    
    // Convert to texture pixel coordinates
    // Note: Flip Z coordinate to match texture orientation
    const texX = Math.floor(normalizedX * textureSize);
    const texY = Math.floor((1.0 - normalizedZ) * textureSize);
    
    // Calculate brush size based on snowball radius
    // Convert world units to texture pixels
    const worldToTexture = textureSize / groundSize;
    const brushSize = snowballRadius * worldToTexture;
    
    // Remove snow to reveal grass underneath
    const ctx = gameState.dynamicTexture.getContext();
    
    // Paint grass/dirt where snow is removed (matching the snowball's footprint)
    const gradient = ctx.createRadialGradient(texX, texY, 0, texX, texY, brushSize);
    gradient.addColorStop(0, '#8B7355'); // Brown/dead grass center
    gradient.addColorStop(0.3, '#9A7B4F'); // Tan
    gradient.addColorStop(0.6, '#7A9B3A'); // Green grass showing through
    gradient.addColorStop(0.8, '#C8C8C8'); // Light gray (partial snow)
    gradient.addColorStop(1, '#FAFAFA'); // White snow edge
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(texX, texY, brushSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Add detailed grass texture in the exposed area
    const numGrassDetails = Math.floor(brushSize / 5);
    for (let i = 0; i < numGrassDetails; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * brushSize * 0.5;
        const x = texX + Math.cos(angle) * distance;
        const y = texY + Math.sin(angle) * distance;
        const size = Math.random() * 4 + 2;
        
        // Grass blade or dirt patch
        const grassShade = Math.floor(Math.random() * 30);
        ctx.fillStyle = `rgb(${122 + grassShade}, ${155 + grassShade}, ${58 + grassShade})`;
        ctx.fillRect(x, y, size, size);
    }
    
    gameState.dynamicTexture.update();
}

function isOnGrass(position) {
    if (!gameState.dynamicTexture || !gameState.ground) return false;
    
    // Check if position has grass underneath (snow has been removed)
    const groundSize = 50;
    const textureSize = 2048;
    
    const normalizedX = (position.x + groundSize / 2) / groundSize;
    const normalizedZ = (position.z + groundSize / 2) / groundSize;
    
    // Match the flipped Z coordinate from paintGrassTrail
    const texX = Math.floor(normalizedX * textureSize);
    const texY = Math.floor((1.0 - normalizedZ) * textureSize);
    
    // Get pixel data
    const ctx = gameState.dynamicTexture.getContext();
    const imageData = ctx.getImageData(texX, texY, 1, 1);
    const r = imageData.data[0];
    const g = imageData.data[1];
    const b = imageData.data[2];
    
    // If pixel is not white/bright (snow removed), it's grass
    // Snow is RGB(250, 250, 250+), grass is darker/more colorful
    const brightness = (r + g + b) / 3;
    return brightness < 240;
}

function checkSnowballStacking(scene) {
    if (!gameState.selectedSnowball) return;
    
    // Check if dragged snowball is near another snowball
    for (let snowball of gameState.snowballs) {
        if (snowball === gameState.selectedSnowball) continue;
        
        const distance = BABYLON.Vector3.Distance(
            gameState.selectedSnowball.position,
            snowball.position
        );
        
        const combinedRadius = (gameState.selectedSnowball.scaling.x + snowball.scaling.x) / 2;
        
        // If close enough, snap and stack
        if (distance < combinedRadius * 0.8) {
            stackSnowballs(gameState.selectedSnowball, snowball);
            break;
        }
    }
}

function stackSnowballs(topSnowball, bottomSnowball) {
    // Ensure bottom is larger
    if (topSnowball.scaling.x > bottomSnowball.scaling.x) {
        [topSnowball, bottomSnowball] = [bottomSnowball, topSnowball];
    }
    
    // Position top snowball on top of bottom
    topSnowball.position.x = bottomSnowball.position.x;
    topSnowball.position.z = bottomSnowball.position.z;
    
    // Calculate stacking height (account for any snowballs already stacked on bottom)
    let stackHeight = bottomSnowball.scaling.y / 2;
    
    // Check if there's already a snowball on top of bottom
    for (let ball of gameState.snowballs) {
        if (ball.metadata && ball.metadata.stackedOn === bottomSnowball) {
            stackHeight += ball.scaling.y;
        }
    }
    
    topSnowball.position.y = stackHeight + topSnowball.scaling.y / 2;
    
    // Mark as stacked
    topSnowball.metadata = topSnowball.metadata || {};
    topSnowball.metadata.stacked = true;
    topSnowball.metadata.stackedOn = bottomSnowball;
    
    // Check if snowman is complete (3 stacked snowballs)
    checkSnowmanComplete();
}

function checkSnowmanComplete() {
    let stackHeight = 0;
    let currentBall = gameState.selectedSnowball;
    
    // Count stack height
    while (currentBall && currentBall.metadata && currentBall.metadata.stacked) {
        stackHeight++;
        currentBall = currentBall.metadata.stackedOn;
        if (currentBall) stackHeight++;
    }
    
    // Check all snowballs for any complete 3-stack
    for (let ball of gameState.snowballs) {
        let height = 1;
        let current = ball;
        
        // Count downward
        while (current.metadata && current.metadata.stackedOn) {
            current = current.metadata.stackedOn;
            height++;
        }
        
        // Count upward
        current = ball;
        for (let other of gameState.snowballs) {
            if (other.metadata && other.metadata.stackedOn === current) {
                height++;
                current = other;
            }
        }
        
        if (height >= 3) {
            updateHint('🎉 Snowman complete! You did it! Press Reset to build another.');
            return;
        }
    }
}

function setupUI() {
    const startBtn = document.getElementById('startBtn');
    const instructions = document.getElementById('instructions');
    const resetBtn = document.getElementById('resetBtn');
    
    startBtn.addEventListener('click', () => {
        instructions.classList.add('hidden');
    });
    
    resetBtn.addEventListener('click', () => {
        location.reload();
    });
}

function updateSnowballCounter() {
    document.getElementById('snowballCounter').textContent = `Snowballs: ${gameState.snowballCount}/3`;
}

function updateHint(text) {
    document.getElementById('hint').textContent = text;
}

