# Tetris Game

A fully functional, browser-based Tetris game built with HTML, CSS, and JavaScript.

## Features

- **Classic Gameplay**: Standard 10×20 grid with authentic Tetris mechanics
- **Seven Tetromino Pieces**: All classic shapes (I, O, T, S, Z, J, L) with distinct colors
- **Full Controls**: 
  - Arrow keys for movement and rotation
  - Space bar for hard drop
- **Progressive Difficulty**: Speed increases every 10 lines cleared
- **Score System**: Points awarded for clearing lines and hard drops
- **Visual Interface**: 
  - Real-time score, lines, and level tracking
  - Next piece preview
  - Game over screen with final stats
- **Responsive Design**: Works on desktop and mobile browsers

## How to Play

### Starting the Game

1. Open `index.html` in any modern web browser
2. Click the "Start Game" button
3. Use keyboard controls to play

### Controls

| Key | Action |
|-----|--------|
| ← (Left Arrow) | Move piece left |
| → (Right Arrow) | Move piece right |
| ↓ (Down Arrow) | Move piece down faster |
| ↑ (Up Arrow) | Rotate piece clockwise |
| Space | Hard drop (instantly drop to bottom) |

### Gameplay

- **Objective**: Clear horizontal lines by filling them completely with blocks
- **Scoring**:
  - 1 line = 100 points × level
  - 2 lines = 300 points × level
  - 3 lines = 500 points × level
  - 4 lines (Tetris!) = 800 points × level
  - Hard drop = 2 points per row
- **Level Up**: Every 10 lines cleared increases the level and speed
- **Game Over**: When pieces stack up to the top of the board

### Tips

- Plan ahead using the "Next Piece" preview
- Try to create Tetris (4 lines at once) for maximum points
- Use hard drop (Space) to quickly place pieces and earn bonus points
- Keep the board as flat as possible to avoid difficult situations

## Technical Details

### File Structure

```
kiro-sandbox/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── tetris.js       # Game logic and mechanics
└── README.md       # This file
```

### Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 Flexbox and Grid

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Game Mechanics

### Tetromino Shapes

- **I-piece** (Cyan): 4 blocks in a line
- **O-piece** (Yellow): 2×2 square
- **T-piece** (Purple): T-shaped
- **S-piece** (Green): S-shaped
- **Z-piece** (Red): Z-shaped
- **J-piece** (Blue): J-shaped
- **L-piece** (Orange): L-shaped

### Rotation System

- Pieces rotate clockwise with wall kick support
- If rotation would cause collision, the game attempts to shift the piece left or right
- O-piece doesn't rotate (square shape)

### Speed Progression

- Level 1: 1000ms per drop
- Each level: -100ms (minimum 100ms at level 10+)
- Level increases every 10 lines cleared

## Development

This is a standalone web application with no dependencies. Simply open the HTML file in a browser to play.

To modify the game:
- Edit `tetris.js` for game logic
- Edit `styles.css` for appearance
- Edit `index.html` for structure

## Enjoy Playing!

Challenge yourself to beat your high score and master the art of Tetris!
