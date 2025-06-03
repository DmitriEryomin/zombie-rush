# Zombi Rush

A tower defense game built with Phaser 3 and TypeScript where you must defend your base from waves of zombies.

## Description

Zombi Rush is a tower defense game where you control a base with machine guns to fend off hordes of zombies that approach from different directions. The game uses Phaser 3 for rendering and game logic, with TypeScript for type safety.

## Features

- Multiple zombie waves approaching from different directions
- Base with rotating machine gun that automatically targets nearby zombies
- Path-based zombie movement
- Animation system for zombie sprites
- Custom UI elements and game scenes

## Project Structure

- `/src` - Source code
  - `/assets` - Game assets (images, fonts, etc.)
    - `/blood` - Blood splatter effects
    - `/fonts` - Game fonts
    - `/tower` - Tower and weapon sprites
    - `/ui` - UI elements
    - `/zombie` - Zombie sprite animations
  - `/game-objects` - Game entity classes
    - `base.ts` - Player's base with machine gun
    - `path.ts` - Path generation for zombies
    - `zombie.ts` - Zombie entity with movement
    - `zombie-wave.ts` - Wave management for zombies
  - `/scenes` - Phaser scenes
    - `boot-scene.ts` - Initial loading scene
    - `preload-scene.ts` - Asset preloading with progress bar
    - `main-menu-scene.ts` - Game menu
    - `game-scene.ts` - Main gameplay scene
  - `/services` - Game services
    - `path-generator.ts` - Generates paths for zombies to follow

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Production:

1. Build the project:
   ```bash
   npm run build
   ```
2. Preview the production build:
   ```bash
   npm run preview
   ```
