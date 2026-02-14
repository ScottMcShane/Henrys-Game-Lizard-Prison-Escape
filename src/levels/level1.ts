import { BarrelConfig } from "../entities/Barrel";
import { GuardConfig } from "../entities/Guard";
import { MovingPlatformConfig } from "../entities/MovingPlatform";

/**
 * Level 1 - Prison Cell Block
 *
 * Tile legend:
 *   0 = empty
 *   1 = stone wall
 *   2 = platform
 *   3 = prison bars (decoration)
 *   4 = spikes (hazard)
 *   5 = breakable wall
 */

export const TILE_SIZE = 32;

export const LEVEL_1_MAP: number[][] = [
  // Row 0 (top ceiling)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
  // Row 1
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 2
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 3
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 4
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 5 - high platforms
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,2,2,2,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,2,2, 2,0,0,0,0,0,0,0,0,1],
  // Row 6
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 7 - mid platforms
  [1,0,0,0,0,0,0,0,0,0, 0,0,2,2,2,2,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,2,2,2,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,2,2, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 8
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 9 - lower platforms + breakable wall section
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,2, 2,2,0,0,0,0,0,0,2,2, 2,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,2, 2,2,0,0,0,0,0,0,0,0, 0,0,0,2,2,2,0,0,0,0, 0,0,0,0,2,2,2,0,0,1],
  // Row 10
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 11 - breakable walls blocking path
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,5,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 12 - breakable walls + player spawn area
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,5,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 13 - spikes + breakable walls
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,4,4,0,0, 0,0,0,0,5,0,0,0,0,0, 0,0,4,4,4,0,0,0,0,0, 0,0,0,0,0,4,4,0,0,0, 0,0,0,0,0,0,0,0,0,0, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 14 (floor)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
];

export const PLAYER_SPAWN = { col: 3, row: 12 };
export const EXIT_DOOR = { col: 77, row: 12 };

// Barrels roll across platforms and the floor - Donkey Kong style!
export const BARRELS: BarrelConfig[] = [
  // Barrel rolling right across the floor early on
  { x: 10 * TILE_SIZE, y: 12 * TILE_SIZE, velocityX: 100 },
  // Barrel rolling left on mid section
  { x: 45 * TILE_SIZE, y: 12 * TILE_SIZE, velocityX: -120 },
  // Fast barrel in the later section
  { x: 55 * TILE_SIZE, y: 12 * TILE_SIZE, velocityX: 140 },
];

// Guards patrol back and forth on platforms and floor
export const GUARDS: GuardConfig[] = [
  // Guard patrolling the floor near the start
  { x: 15 * TILE_SIZE, y: 12 * TILE_SIZE, patrolLeft: 10 * TILE_SIZE, patrolRight: 18 * TILE_SIZE, speed: 60 },
  // Guard on lower platform
  { x: 30 * TILE_SIZE, y: 8 * TILE_SIZE, patrolLeft: 28 * TILE_SIZE, patrolRight: 32 * TILE_SIZE, speed: 40 },
  // Guard patrolling mid floor
  { x: 50 * TILE_SIZE, y: 12 * TILE_SIZE, patrolLeft: 48 * TILE_SIZE, patrolRight: 54 * TILE_SIZE, speed: 70 },
  // Guard near the exit
  { x: 72 * TILE_SIZE, y: 12 * TILE_SIZE, patrolLeft: 68 * TILE_SIZE, patrolRight: 76 * TILE_SIZE, speed: 80 },
];

// Tongue grapple hook points (placed in the air for swinging across gaps)
export const HOOK_POINTS = [
  { col: 8, row: 6 },     // Early hook to practice with
  { col: 22, row: 4 },    // Over spike gap
  { col: 27, row: 5 },    // Chain to reach platform
  { col: 36, row: 3 },    // High hook over platforms
  { col: 42, row: 5 },    // Mid-level hook
  { col: 52, row: 4 },    // Over guard patrol area
  { col: 58, row: 3 },    // High traverse hook
  { col: 62, row: 5 },    // Before breakable wall
  { col: 67, row: 4 },    // Near moving platform
  { col: 73, row: 3 },    // Final approach hooks
  { col: 76, row: 5 },    // Near exit
];

// Moving platforms help reach higher areas
export const MOVING_PLATFORMS: MovingPlatformConfig[] = [
  // Horizontal mover in the gap area
  { x: 25 * TILE_SIZE, y: 11 * TILE_SIZE, distanceX: 3 * TILE_SIZE, distanceY: 0, speed: 0.8, width: 3 * TILE_SIZE },
  // Vertical mover to reach high platform
  { x: 38 * TILE_SIZE, y: 10 * TILE_SIZE, distanceX: 0, distanceY: 3 * TILE_SIZE, speed: 0.6, width: 2 * TILE_SIZE },
  // Horizontal mover near end
  { x: 65 * TILE_SIZE, y: 9 * TILE_SIZE, distanceX: 4 * TILE_SIZE, distanceY: 0, speed: 1.0, width: 3 * TILE_SIZE },
];
