# Quick Start Guide

## Playing the Game Right Now

The game server is already running! Open your browser and go to:

```
http://localhost:8000
```

## What You'll See

1. **Loading Screen** - "A Good Snowman Is Hard To Build" title
2. **Main Game** - A cozy isometric world with:
   - A white snowball (that's you!)
   - Green grass patches
   - Dark green bush walls
   - Layered pine trees
   - A man sitting on a bench
   - Items scattered around

## How to Play

### Basic Controls
- **Move**: Arrow Keys or WASD
- **Switch Snowballs**: Press 1, 2, or 3

### Your Goal
Collect all the snowman parts:
- ✅ 1 Carrot (for the nose)
- ✅ 2 Twigs (for the arms)  
- ✅ 8 Coal pieces (for eyes and buttons)
- ✅ 1 Hat (the finishing touch!)

### The Twist: Size Matters!
Your snowball starts small but grows as you roll. Different items require different sizes:

- **Carrot & Twigs**: Available from the start (1.0x size)
- **Coal**: Need to grow to 1.5x size
- **Hat**: Need to grow to 2.0x size (the biggest!)

Watch the **Size indicator** in the top-left UI to track your growth.

### Three Snowballs
You control 3 different snowballs, each starting in a different area:
- **Snowball 1**: Center area
- **Snowball 2**: Near the garden  
- **Snowball 3**: Between special areas

Switch between them to explore different parts of the map and collect all items!

## Visual Features to Notice

✨ **Hand-Painted Aesthetic**
- Soft, organic shapes (no hard edges)
- Muted, cozy colors
- Brush-stroke style grass trails
- Layered sprites with depth

✨ **Physics Details**
- Snowball rotates as it rolls (no slipping!)
- Smooth momentum and friction
- Grows gradually as you travel
- Leaves darker grass trails behind

✨ **Polish Effects**
- Sparkle particles when collecting items
- Number indicators when switching snowballs
- Smooth camera transitions
- Gentle bobbing animations on items
- Soft shadows under everything

## Map Features

### Special Areas to Find:
1. **Garden** - Look for orange carrots
2. **Man on Bench** - He's wearing the hat you need!
3. **Coal Pile** - Scattered black coal pieces
4. **Tree Area** - Brown twigs under the pine tree

### Navigation Tips:
- Bush walls create rooms and pathways
- The map is large - explore different areas with different snowballs
- Use the camera to orient yourself
- The active snowball is bright white, inactive ones are gray

## Winning the Game

Once you've collected all required items, you'll see:
```
A Good Snowman!
You collected all the parts!
```

Refresh the page to play again with a new random map layout!

## Troubleshooting

### Game won't load?
- Make sure the server is running on port 8000
- Check browser console for errors (F12)
- Try refreshing the page

### Controls not working?
- Click on the game canvas area first
- Make sure you're not in browser's search mode (ESC to exit)

### Can't collect an item?
- Check your snowball size in the UI
- Roll around more to grow bigger
- Remember: Hat needs 2.0x size!

## Development Server

To restart the server if needed:
```bash
cd "/Users/yigeyuan/Documents/Cursor Code/SnowmanMaker"
python3 -m http.server 8000
```

Or with Node.js:
```bash
npm start
```

Enjoy building your snowman! ⛄️

