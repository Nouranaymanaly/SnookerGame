# Snooker Game

## Overview

This is a Snooker game created using the p5.js and Matter.js libraries. The game simulates a pool table with balls, pockets, and a cue stick. The objective is to strike the balls into the pockets.

## Features

- Realistic physics simulation using Matter.js
- Six pockets positioned as in a standard pool table
- Cue ball control for striking other balls

## Getting Started

### Files

- `index.html`: The main HTML file to run the game.
- `sketch.js`: The JavaScript file containing the game logic.
- `Libraries`: stores the p5.js and Matter.js

### Running the Game

1. Open the `index.html` file in your web browser.
2. The game will initialize and display a pool table.
3. Use your mouse to control the cue stick and strike the cue ball.

### Controls

- **Mouse Click and Drag**: Position and strike the cue ball.

### Game Logic

- The game initializes with a standard pool table layout.
- The `draw()` function updates the game state and renders the table, balls, and other elements.
- Collisions are detected and handled using the Matter.js engine.

## Acknowledgements

- [p5.js](https://p5js.org/): A JavaScript library for creative coding.
- [Matter.js](https://brm.io/matter-js/): A JavaScript 2D physics engine.
