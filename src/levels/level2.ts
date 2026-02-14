import { BarrelConfig } from "../entities/Barrel";
import { GuardConfig } from "../entities/Guard";
import { MovingPlatformConfig } from "../entities/MovingPlatform";

/**
 * Level 2 - Rooftop Escape
 *
 * Harder level with longer gaps, more spikes, and elite guards.
 * Hook points are spaced further apart to encourage chain-swinging.
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

// Wider map: 100 columns x 18 rows (taller for more vertical play)
export const LEVEL_2_MAP: number[][] = [
  // Row 0 (ceiling)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
  // Row 1
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 2
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 3
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 4 - high platforms
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,2,2,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,2,2,2, 0,0,0,0,0,0,0,0,0,1],
  // Row 5
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,2,2,2,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,2,2,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 6 - mid platforms with gaps
  [1,0,0,0,0,0,0,0,0,0, 0,0,2,2,2,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,2,2,2, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 2,2,2,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 7
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,2,2,2,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 8 - lower platforms
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,2,2, 2,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 9
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 2,2,2,0,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,2,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 2,2,2,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 10
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 11 - lower platforms + breakable walls
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,5, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,5,5,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 12
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,5, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,5,5,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,2,2,2,0,0,1],
  // Row 13 - more platforms near spawn
  [1,0,0,0,0,0,2,2,2,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,5, 5,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,5,5,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 14 - floor with large gaps (chasms)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,0,0,0,0,0, 0,0,0,1,1,1,1,1,1,1, 1,1,1,1,0,0,0,0,0,0, 0,0,0,0,0,0,1,1,1,1, 1,1,1,0,0,0,0,0,0,0, 0,0,0,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0,0,0, 0,1,1,1,1,1,1,1,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 15 - spikes below gaps
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,4,4,4,4,4, 4,4,4,0,0,0,0,0,0,0, 0,0,0,0,4,4,4,4,4,4, 4,4,4,4,4,4,0,0,0,0, 0,0,0,4,4,4,4,4,4,4, 4,4,4,0,0,0,0,0,0,0, 4,4,4,4,4,4,4,4,4,4, 4,0,0,0,0,0,0,0,4,4, 4,4,4,4,4,4,4,4,4,1],
  // Row 16
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 17 (bottom wall)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
];

export const PLAYER_SPAWN = { col: 3, row: 13 };
export const EXIT_DOOR = { col: 96, row: 11 };

// Barrels - more frequent, faster
export const BARRELS: BarrelConfig[] = [
  { x: 10 * TILE_SIZE, y: 13 * TILE_SIZE, velocityX: 130 },
  { x: 28 * TILE_SIZE, y: 13 * TILE_SIZE, velocityX: -150 },
  { x: 50 * TILE_SIZE, y: 13 * TILE_SIZE, velocityX: 160 },
  { x: 65 * TILE_SIZE, y: 13 * TILE_SIZE, velocityX: -140 },
];

// Regular guards
export const GUARDS: GuardConfig[] = [
  { x: 8 * TILE_SIZE, y: 13 * TILE_SIZE, patrolLeft: 5 * TILE_SIZE, patrolRight: 13 * TILE_SIZE, speed: 70 },
  { x: 28 * TILE_SIZE, y: 13 * TILE_SIZE, patrolLeft: 24 * TILE_SIZE, patrolRight: 33 * TILE_SIZE, speed: 60 },
  { x: 65 * TILE_SIZE, y: 13 * TILE_SIZE, patrolLeft: 63 * TILE_SIZE, patrolRight: 69 * TILE_SIZE, speed: 75 },
];

// Elite guards (red hat, faster, 2 hits to stun) - Level 2 exclusive
export interface EliteGuardConfig {
  x: number;
  y: number;
  patrolLeft: number;
  patrolRight: number;
  speed: number;
}

export const ELITE_GUARDS: EliteGuardConfig[] = [
  { x: 48 * TILE_SIZE, y: 13 * TILE_SIZE, patrolLeft: 46 * TILE_SIZE, patrolRight: 52 * TILE_SIZE, speed: 110 },
  { x: 84 * TILE_SIZE, y: 13 * TILE_SIZE, patrolLeft: 81 * TILE_SIZE, patrolRight: 87 * TILE_SIZE, speed: 120 },
  { x: 95 * TILE_SIZE, y: 11 * TILE_SIZE, patrolLeft: 93 * TILE_SIZE, patrolRight: 98 * TILE_SIZE, speed: 100 },
];

// Hook points - spaced far apart to require long swings and chain-swinging
export const HOOK_POINTS = [
  // First chasm crossing (cols 15-22 are gap) - need to swing across
  { col: 12, row: 8 },    // Launch point before chasm
  { col: 19, row: 5 },    // Mid-air hook over spike pit - big swing needed

  // Second chasm crossing (cols 34-45 are the big gap) - chain swing required
  { col: 32, row: 6 },    // Start of chain
  { col: 38, row: 4 },    // Mid chain - must release and catch
  { col: 44, row: 6 },    // End of chain

  // Third chasm (cols 53-62)
  { col: 51, row: 5 },    // Before chasm
  { col: 57, row: 3 },    // High hook - big swing arc
  { col: 62, row: 5 },    // Landing approach

  // Fourth chasm (cols 70-80) - longest chain
  { col: 68, row: 4 },    // Start
  { col: 74, row: 3 },    // Mid-chain high
  { col: 79, row: 5 },    // End approach

  // Final gap to exit (cols 88-93)
  { col: 86, row: 5 },    // Before last gap
  { col: 92, row: 4 },    // Final swing to exit platform
];

// Moving platforms - over chasms to give alternative routes
export const MOVING_PLATFORMS: MovingPlatformConfig[] = [
  // Slow mover over first gap (easier option but slower)
  { x: 18 * TILE_SIZE, y: 13 * TILE_SIZE, distanceX: 4 * TILE_SIZE, distanceY: 0, speed: 0.5, width: 2 * TILE_SIZE },
  // Vertical mover mid-level
  { x: 50 * TILE_SIZE, y: 10 * TILE_SIZE, distanceX: 0, distanceY: 4 * TILE_SIZE, speed: 0.7, width: 2 * TILE_SIZE },
  // Fast horizontal near end
  { x: 75 * TILE_SIZE, y: 13 * TILE_SIZE, distanceX: 5 * TILE_SIZE, distanceY: 0, speed: 1.2, width: 2 * TILE_SIZE },
];
