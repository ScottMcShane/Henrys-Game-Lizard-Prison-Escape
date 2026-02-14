import { BarrelConfig } from "../entities/Barrel";
import { GuardConfig } from "../entities/Guard";
import { EliteGuardConfig } from "./level2";
import { MovingPlatformConfig } from "../entities/MovingPlatform";
import { BossConfig } from "../entities/Boss";

/**
 * Level 3 - Boss Arena
 *
 * Compact enclosed arena (40 x 18 tiles = 1280 x 576 px).
 * The Warden (giant Elite Guard) patrols the floor.
 * Player uses wall platforms and the boss's own weak points to swing and attack.
 *
 * Tile legend: 0=empty, 1=wall, 2=platform, 3=decoration, 4=spikes, 5=breakable
 */

export const TILE_SIZE = 32;

// 40 columns x 18 rows
export const LEVEL_3_MAP: number[][] = [
  // Row 0 - ceiling
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
  // Row 1
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 2
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 3 - high side platforms
  [1,0,0,2,2,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,0,1],
  // Row 4
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 5
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 6 - wall ledges
  [1,2,2,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,2,2,1],
  // Row 7
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 8
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 9 - mid platforms for rest spots
  [1,0,0,0,0,2,2,2,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,2,2,2,0,0,0,1],
  // Row 10
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 11
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 12 - player spawn platform (left) and exit platform (right)
  [1,2,2,2,2,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,2,2,2,1],
  // Row 13
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 14
  [1,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,1],
  // Row 15 - spikes at floor edges
  [1,4,4,4,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,4,4,1],
  // Row 16 - floor (boss patrols here)
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
  // Row 17 - sub-floor
  [1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1],
];

export const PLAYER_SPAWN = { col: 2, row: 11 };
export const EXIT_DOOR = { col: 37, row: 11 };

// No regular enemies in boss fight
export const BARRELS: BarrelConfig[] = [];
export const GUARDS: GuardConfig[] = [];
export const ELITE_GUARDS: EliteGuardConfig[] = [];

// Static hook points on walls/ceiling for player navigation
export const HOOK_POINTS = [
  { col: 2, row: 4 },
  { col: 37, row: 4 },
  { col: 10, row: 2 },
  { col: 30, row: 2 },
  { col: 20, row: 2 },
];

export const MOVING_PLATFORMS: MovingPlatformConfig[] = [
  { x: 20 * TILE_SIZE, y: 10 * TILE_SIZE, distanceX: 8 * TILE_SIZE, distanceY: 0, speed: 0.4, width: 3 * TILE_SIZE },
];

// Boss configuration
export const BOSS: BossConfig = {
  x: 20 * TILE_SIZE,
  y: 14 * TILE_SIZE,
  patrolLeft: 5 * TILE_SIZE,
  patrolRight: 34 * TILE_SIZE,
  speed: 60,
};
