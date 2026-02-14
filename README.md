# Henry's Game

A side-scrolling platformer built with Phaser 3 and TypeScript. Play as a cartoon lizard escaping from prison using wall climbing, tongue grappling, and tail whip attacks.

## Controls

| Key | Action |
|-----|--------|
| Arrow keys / WASD | Move |
| Up / W / Space | Jump (double jump in air) |
| X | Tail whip attack |
| Z | Tongue grapple (aim at hook points) |
| N | Next level (after clearing) |
| R | Restart level / Restart game |

## Levels

1. **Prison Interior** - Learn the basics: platforming, guards, barrels, breakable walls, and tongue grappling
2. **Rooftop Escape** - Harder platforming with elite guards (2 hits to stun), long gaps requiring chain-swinging between hooks
3. **Boss Arena** - Face the Warden, a giant elite guard with 5 glowing weak points. Swing off each one to defeat him and escape

## Abilities

- **Double Jump** - Jump again mid-air for extra height
- **Wall Slide & Wall Jump** - Slide down walls and leap off them
- **Tail Whip** - Stun guards, break walls (press X)
- **Tongue Grapple** - Latch onto hook points and swing with pendulum physics (press Z). Release with jump for a momentum boost

## Running Locally

```bash
npm install
npm run dev
```

## Tech

- [Phaser 3](https://phaser.io/) - Game framework
- TypeScript + Vite
- All graphics are procedurally generated on canvas (no external assets)
