# Snowman Building Game
A cozy isometric snowman-building exploration game with hand-painted aesthetics.

## About

Roll around as a tiny snowball, gathering materials to build the perfect snowman! Explore a randomly generated world with bushes, trees, and special areas. Switch between 3 different snowballs to explore different regions of the map.

## How to Play

### Controls
- **Arrow Keys** or **WASD** - Move the active snowball
- **1, 2, 3 Keys** - Switch between the three snowballs

### Gameplay
- Roll around to make your snowball bigger
- Collect items as you grow:
  - 🥕 **Carrot** (nose) - Collect when size is 1.0x or bigger
  - 🪵 **Twigs** (arms) - Collect when size is 1.0x or bigger  
  - ⚫ **Coal** (eyes & buttons) - Collect when size is 1.5x or bigger
  - 🎩 **Hat** - Collect when size is 2.0x or bigger
- Your snowball leaves a grass trail as it rolls
- Each of the 3 snowballs starts in a different area of the map
- Switch perspectives to explore and collect all items

### Goal
Collect all the materials needed to build a snowman:
- 1 Carrot (nose)
- 2 Twigs (arms)
- 8 Coal pieces (2 eyes + 6 buttons)
- 1 Hat

## Special Areas

- **Garden** - Find carrots growing here
- **Man on Bench** - Take his hat when you're big enough!
- **Coal Pile** - Scattered coal pieces
- **Tree Area** - Fallen twigs underneath

## Features

- Hand-painted visual style with soft colors
- Organic brush-stroke grass trails
- Realistic rolling physics (no slipping!)
- Randomly generated map layout
- Three snowballs with smooth camera transitions
- Size-based collection mechanics

## Running the Game

### Option 1: Using Python
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Using Node.js
```bash
npm start
```

### Option 3: Using any HTTP server
The game is a static web application - just serve the files with any HTTP server.

## Technical Details

- Built with **Phaser 3** game engine
- Hand-painted sprites generated using Canvas API
- Isometric 2.5D perspective
- ES6 modules architecture
- No build step required (uses CDN for Phaser)
