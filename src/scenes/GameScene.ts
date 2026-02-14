import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Barrel, BarrelConfig } from "../entities/Barrel";
import { Guard, GuardConfig } from "../entities/Guard";
import { EliteGuard } from "../entities/EliteGuard";
import { MovingPlatform, MovingPlatformConfig } from "../entities/MovingPlatform";
import { Boss, BossConfig } from "../entities/Boss";
import * as L1 from "../levels/level1";
import * as L2 from "../levels/level2";
import * as L3 from "../levels/level3";
import { EliteGuardConfig } from "../levels/level2";

interface LevelData {
  map: number[][];
  tileSize: number;
  playerSpawn: { col: number; row: number };
  exitDoor: { col: number; row: number };
  barrels: BarrelConfig[];
  guards: GuardConfig[];
  eliteGuards: EliteGuardConfig[];
  hookPoints: { col: number; row: number }[];
  movingPlatforms: MovingPlatformConfig[];
  boss?: BossConfig;
  hideDoorUntilBoss?: boolean;
}

const LEVELS: LevelData[] = [
  {
    map: L1.LEVEL_1_MAP,
    tileSize: L1.TILE_SIZE,
    playerSpawn: L1.PLAYER_SPAWN,
    exitDoor: L1.EXIT_DOOR,
    barrels: L1.BARRELS,
    guards: L1.GUARDS,
    eliteGuards: [],
    hookPoints: L1.HOOK_POINTS,
    movingPlatforms: L1.MOVING_PLATFORMS,
  },
  {
    map: L2.LEVEL_2_MAP,
    tileSize: L2.TILE_SIZE,
    playerSpawn: L2.PLAYER_SPAWN,
    exitDoor: L2.EXIT_DOOR,
    barrels: L2.BARRELS,
    guards: L2.GUARDS,
    eliteGuards: L2.ELITE_GUARDS,
    hookPoints: L2.HOOK_POINTS,
    movingPlatforms: L2.MOVING_PLATFORMS,
  },
  {
    map: L3.LEVEL_3_MAP,
    tileSize: L3.TILE_SIZE,
    playerSpawn: L3.PLAYER_SPAWN,
    exitDoor: L3.EXIT_DOOR,
    barrels: L3.BARRELS,
    guards: L3.GUARDS,
    eliteGuards: L3.ELITE_GUARDS,
    hookPoints: L3.HOOK_POINTS,
    movingPlatforms: L3.MOVING_PLATFORMS,
    boss: L3.BOSS,
    hideDoorUntilBoss: true,
  },
];

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private breakables!: Phaser.Physics.Arcade.StaticGroup;
  private door!: Phaser.GameObjects.Sprite;
  private barrels: Barrel[] = [];
  private guards: Guard[] = [];
  private eliteGuards: EliteGuard[] = [];
  private movingPlatforms: MovingPlatform[] = [];
  private boss: Boss | null = null;
  private bossDefeated = false;
  private bossHitText: Phaser.GameObjects.Text | null = null;
  private levelComplete = false;
  private gameWon = false;
  private winText!: Phaser.GameObjects.Text;
  private restartText!: Phaser.GameObjects.Text;

  private currentLevel = 0;
  private level!: LevelData;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data: { level?: number }) {
    this.currentLevel = data.level ?? 0;
    this.level = LEVELS[this.currentLevel] ?? LEVELS[0];
  }

  create() {
    this.levelComplete = false;
    this.gameWon = false;
    this.barrels = [];
    this.guards = [];
    this.eliteGuards = [];
    this.movingPlatforms = [];
    this.boss = null;
    this.bossDefeated = false;
    this.bossHitText = null;

    const TS = this.level.tileSize;
    const mapWidth = this.level.map[0].length * TS;
    const mapHeight = this.level.map.length * TS;

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.createBackground(mapWidth, mapHeight);

    // Tile groups
    this.walls = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();
    this.breakables = this.physics.add.staticGroup();

    this.buildLevel();

    // Exit door
    this.door = this.add.sprite(
      this.level.exitDoor.col * TS + TS / 2,
      this.level.exitDoor.row * TS + TS / 2 - 8,
      "door"
    );
    this.door.setDepth(0);

    // Hide door on boss levels until boss is defeated
    if (this.level.hideDoorUntilBoss) {
      this.door.setVisible(false);
      this.door.setActive(false);
    }

    // Player
    this.player = new Player(
      this,
      this.level.playerSpawn.col * TS + TS / 2,
      this.level.playerSpawn.row * TS + TS / 2
    );
    this.player.sprite.setDepth(1);

    // Hook points (static level hooks)
    const hookWorldPoints: { x: number; y: number }[] = [];
    for (const hp of this.level.hookPoints) {
      const hx = hp.col * TS + TS / 2;
      const hy = hp.row * TS + TS / 2;
      hookWorldPoints.push({ x: hx, y: hy });

      const hookSprite = this.add.sprite(hx, hy, "hook-point").setDepth(0);
      this.tweens.add({
        targets: hookSprite,
        scaleX: 1.3,
        scaleY: 1.3,
        alpha: 0.6,
        yoyo: true,
        repeat: -1,
        duration: 800,
        ease: "Sine.easeInOut",
      });
    }

    // Boss (level 3)
    if (this.level.boss) {
      this.boss = new Boss(this, this.level.boss);
      this.physics.add.collider(this.boss.sprite, this.walls);
      this.physics.add.collider(this.boss.sprite, this.platforms);

      // Player touching boss body = death
      this.physics.add.overlap(this.player.sprite, this.boss.sprite, () => {
        if (this.boss && this.boss.sprite.active && !this.boss.isDead) {
          this.handleDeath();
        }
      });

      // Add boss hook points into the hook targets (same mutable references)
      for (const bossHook of this.boss.hookPoints) {
        hookWorldPoints.push(bossHook);
      }

      // Wire up grapple release -> boss hit detection
      const boss = this.boss;
      this.player.onGrappleRelease = (hookRef) => {
        const hookIndex = boss.getHookIndex(hookRef);
        if (hookIndex >= 0 && boss.registerHit(hookIndex)) {
          // Remove the hit hook from the player's target array so it can't be grappled again
          const idx = hookWorldPoints.indexOf(hookRef);
          if (idx >= 0) hookWorldPoints.splice(idx, 1);
        }
      };

      // Boss HUD
      this.bossHitText = this.add.text(400, 40, `WEAK POINTS: ${this.boss.TOTAL_HITS}/${this.boss.TOTAL_HITS}`, {
        fontSize: "14px",
        color: "#ff4444",
        fontFamily: "monospace",
        stroke: "#000",
        strokeThickness: 2,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
    }

    this.player.setHookPoints(hookWorldPoints);

    // Barrels
    for (const cfg of this.level.barrels) {
      const barrel = new Barrel(this, cfg, mapWidth);
      this.barrels.push(barrel);
      this.physics.add.collider(barrel.sprite, this.walls);
      this.physics.add.collider(barrel.sprite, this.platforms);
      this.physics.add.collider(barrel.sprite, this.breakables);
      this.physics.add.overlap(this.player.sprite, barrel.sprite, () => this.handleDeath());
    }

    // Guards
    for (const cfg of this.level.guards) {
      const guard = new Guard(this, cfg);
      this.guards.push(guard);
      this.physics.add.collider(guard.sprite, this.walls);
      this.physics.add.collider(guard.sprite, this.platforms);
      this.physics.add.collider(guard.sprite, this.breakables);
      this.physics.add.overlap(this.player.sprite, guard.sprite, () => {
        if (guard.sprite.active) this.handleDeath();
      });
    }

    // Elite guards (level 2+)
    for (const cfg of this.level.eliteGuards) {
      const elite = new EliteGuard(this, cfg);
      this.eliteGuards.push(elite);
      this.physics.add.collider(elite.sprite, this.walls);
      this.physics.add.collider(elite.sprite, this.platforms);
      this.physics.add.collider(elite.sprite, this.breakables);
      this.physics.add.overlap(this.player.sprite, elite.sprite, () => {
        if (elite.sprite.active) this.handleDeath();
      });
    }

    // Moving platforms
    for (const cfg of this.level.movingPlatforms) {
      const mp = new MovingPlatform(this, cfg);
      this.movingPlatforms.push(mp);
      this.physics.add.collider(this.player.sprite, mp.body);
    }

    // Tail whip interactions
    this.player.onTailWhipHit = (hitbox) => {
      // Stun regular guards
      for (const guard of this.guards) {
        if (!guard.sprite.active) continue;
        const guardBounds = guard.sprite.getBounds();
        const hitBounds = hitbox.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(guardBounds, hitBounds)) {
          this.stunGuard(guard);
        }
      }
      // Hit elite guards (need 2 hits)
      for (const elite of this.eliteGuards) {
        if (!elite.sprite.active) continue;
        const eliteBounds = elite.sprite.getBounds();
        const hitBounds = hitbox.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(eliteBounds, hitBounds)) {
          this.hitEliteGuard(elite);
        }
      }
      // Break breakable walls
      const breakableChildren = this.breakables.getChildren() as Phaser.Physics.Arcade.Sprite[];
      for (const br of breakableChildren) {
        if (!br.active) continue;
        const brBounds = br.getBounds();
        const hitBounds = hitbox.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(brBounds, hitBounds)) {
          this.destroyBreakable(br);
        }
      }
    };

    // Collisions
    this.physics.add.collider(this.player.sprite, this.walls);
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.player.sprite, this.breakables, (_player, breakable) => {
      this.handleBreakableCollision(breakable as Phaser.Physics.Arcade.Sprite);
    });

    // Spike overlap (death)
    this.physics.add.overlap(this.player.sprite, this.spikes, () => this.handleDeath());

    // Camera
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

    // Level indicator
    if (this.currentLevel > 0) {
      const levelLabel = this.add.text(400, 20, `LEVEL ${this.currentLevel + 1}`, {
        fontSize: "14px",
        color: "#aaa",
        fontFamily: "monospace",
        stroke: "#000",
        strokeThickness: 2,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
      // Fade out after 2 seconds
      this.tweens.add({
        targets: levelLabel,
        alpha: 0,
        delay: 2000,
        duration: 1000,
        onComplete: () => levelLabel.destroy(),
      });
    }

    // UI text
    this.winText = this.add.text(400, 180, "", {
      fontSize: "32px",
      color: "#ffd700",
      fontFamily: "monospace",
      stroke: "#000",
      strokeThickness: 4,
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10).setVisible(false);

    this.restartText = this.add.text(400, 230, "", {
      fontSize: "16px",
      color: "#fff",
      fontFamily: "monospace",
      stroke: "#000",
      strokeThickness: 2,
      align: "center",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10).setVisible(false);

    // Restart key - go back to level 1 if game was fully won
    this.input.keyboard!.on("keydown-R", () => {
      this.scene.restart({ level: this.gameWon ? 0 : this.currentLevel });
    });
  }

  update(time: number, delta: number) {
    if (this.levelComplete) return;

    this.player.update(time, delta);

    for (const barrel of this.barrels) barrel.update();
    for (const guard of this.guards) guard.update(time, delta);
    for (const elite of this.eliteGuards) elite.update(time, delta);
    for (const mp of this.movingPlatforms) mp.update(time, delta);

    // Boss update
    if (this.boss) {
      this.boss.update(time, delta);

      // Update HUD
      if (this.bossHitText && !this.boss.isDead) {
        const remaining = this.boss.TOTAL_HITS - this.boss.hitsLanded;
        this.bossHitText.setText(`WEAK POINTS: ${remaining}/${this.boss.TOTAL_HITS}`);
      }

      // Boss death complete -> reveal door
      if (this.boss.isDead && this.boss.deathComplete && !this.bossDefeated) {
        this.bossDefeated = true;
        this.revealExitDoor();
      }
    }

    // Win condition (only if door is active)
    const playerBounds = this.player.sprite.getBounds();
    const doorBounds = this.door.getBounds();
    if (this.door.active && Phaser.Geom.Rectangle.Overlaps(playerBounds, doorBounds)) {
      this.handleWin();
    }

    // Fall death
    const mapHeight = this.level.map.length * this.level.tileSize;
    if (this.player.sprite.y > mapHeight + 50) {
      this.handleDeath();
    }
  }

  private buildLevel() {
    const TS = this.level.tileSize;
    for (let row = 0; row < this.level.map.length; row++) {
      for (let col = 0; col < this.level.map[row].length; col++) {
        const tile = this.level.map[row][col];
        const x = col * TS + TS / 2;
        const y = row * TS + TS / 2;

        switch (tile) {
          case 1:
            this.walls.create(x, y, "tile-wall");
            break;
          case 2:
            this.platforms.create(x, y, "tile-platform");
            break;
          case 3:
            this.add.sprite(x, y, "tile-bar").setDepth(-1);
            break;
          case 4: {
            const spike = this.spikes.create(x, y, "tile-spike") as Phaser.Physics.Arcade.Sprite;
            spike.setSize(TS, 12);
            spike.setOffset(0, 20);
            break;
          }
          case 5:
            this.breakables.create(x, y, "tile-breakable");
            break;
        }
      }
    }
  }

  private handleBreakableCollision(breakable: Phaser.Physics.Arcade.Sprite) {
    const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left || body.blocked.right) {
      this.destroyBreakable(breakable);
    }
  }

  private destroyBreakable(breakable: Phaser.Physics.Arcade.Sprite) {
    const bx = breakable.x;
    const by = breakable.y;
    for (let i = 0; i < 6; i++) {
      const debris = this.add.rectangle(
        bx + Phaser.Math.Between(-8, 8),
        by + Phaser.Math.Between(-8, 8),
        Phaser.Math.Between(3, 8),
        Phaser.Math.Between(3, 8),
        0x5a5a4e
      );
      this.tweens.add({
        targets: debris,
        x: debris.x + Phaser.Math.Between(-40, 40),
        y: debris.y + Phaser.Math.Between(-50, 20),
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: 400,
        onComplete: () => debris.destroy(),
      });
    }
    this.cameras.main.shake(100, 0.005);
    breakable.destroy();
  }

  private stunGuard(guard: Guard) {
    const guardBody = guard.sprite.body as Phaser.Physics.Arcade.Body;
    guardBody.setVelocity(0, -150);
    guard.sprite.setTint(0xffff00);
    guard.sprite.setAlpha(0.6);

    guard.sprite.active = false;
    guardBody.enable = false;

    this.spawnStunStars(guard.sprite.x, guard.sprite.y);

    this.time.delayedCall(3000, () => {
      if (guard.sprite && guard.sprite.scene) {
        guard.sprite.clearTint();
        guard.sprite.setAlpha(1);
        guard.sprite.active = true;
        (guard.sprite.body as Phaser.Physics.Arcade.Body).enable = true;
      }
    });
  }

  private hitEliteGuard(elite: EliteGuard) {
    const fullyStunned = elite.takeHit();

    if (fullyStunned) {
      // Fully stunned - same as regular guard stun
      const eliteBody = elite.sprite.body as Phaser.Physics.Arcade.Body;
      eliteBody.setVelocity(0, -150);
      elite.sprite.setTint(0xffff00);
      elite.sprite.setAlpha(0.6);
      elite.sprite.active = false;
      eliteBody.enable = false;

      this.spawnStunStars(elite.sprite.x, elite.sprite.y);

      // Recovers after 4 seconds (longer than regular)
      this.time.delayedCall(4000, () => {
        if (elite.sprite && elite.sprite.scene) {
          elite.sprite.clearTint();
          elite.sprite.setAlpha(1);
          elite.sprite.active = true;
          (elite.sprite.body as Phaser.Physics.Arcade.Body).enable = true;
          elite.resetHits();
        }
      });
    } else {
      // First hit - flinch effect, brief stagger
      elite.sprite.setTint(0xff6666);
      const eliteBody = elite.sprite.body as Phaser.Physics.Arcade.Body;
      eliteBody.setVelocityX(-eliteBody.velocity.x * 0.5);
      eliteBody.setVelocityY(-100);

      // Flash red then clear
      this.time.delayedCall(300, () => {
        if (elite.sprite && elite.sprite.scene) {
          elite.sprite.clearTint();
        }
      });

      // Angry particle burst
      for (let i = 0; i < 4; i++) {
        const spark = this.add.circle(
          elite.sprite.x + Phaser.Math.Between(-8, 8),
          elite.sprite.y - 10,
          2, 0xff4444, 1
        );
        this.tweens.add({
          targets: spark,
          y: spark.y - 15,
          alpha: 0,
          duration: 400,
          onComplete: () => spark.destroy(),
        });
      }
    }
  }

  private spawnStunStars(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      const star = this.add.text(
        x + Phaser.Math.Between(-10, 10),
        y - 20,
        "*",
        { fontSize: "12px", color: "#ffd700" }
      );
      this.tweens.add({
        targets: star,
        y: star.y - 20,
        alpha: 0,
        angle: Phaser.Math.Between(-90, 90),
        duration: 600,
        onComplete: () => star.destroy(),
      });
    }
  }

  private revealExitDoor() {
    this.door.setVisible(true);
    this.door.setActive(true);

    this.cameras.main.flash(300, 255, 255, 200);

    // Hide boss HUD
    if (this.bossHitText) {
      this.bossHitText.setVisible(false);
    }

    const bossDeadText = this.add.text(400, 200, "BOSS DEFEATED!", {
      fontSize: "28px",
      color: "#ffd700",
      fontFamily: "monospace",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);

    this.tweens.add({
      targets: bossDeadText,
      alpha: 0,
      y: 180,
      delay: 1500,
      duration: 1000,
      onComplete: () => bossDeadText.destroy(),
    });

    // Pulsing door to draw attention
    this.tweens.add({
      targets: this.door,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
      repeat: 3,
      duration: 300,
    });
  }

  private createBackground(mapWidth: number, mapHeight: number) {
    const bg = this.add.graphics();
    bg.setScrollFactor(0.2);
    bg.setDepth(-10);

    // Different color palette per level
    for (let y = 0; y < mapHeight; y += 4) {
      const t = y / mapHeight;
      let r: number, g: number, b: number;
      if (this.currentLevel === 0) {
        // Level 1 - dark blue/purple prison interior
        r = Math.floor(20 + t * 10);
        g = Math.floor(20 + t * 8);
        b = Math.floor(35 + t * 15);
      } else if (this.currentLevel === 1) {
        // Level 2 - dark red/brown rooftop at night
        r = Math.floor(30 + t * 15);
        g = Math.floor(15 + t * 5);
        b = Math.floor(20 + t * 10);
      } else {
        // Level 3 - dark crimson boss arena
        r = Math.floor(35 + t * 15);
        g = Math.floor(10 + t * 5);
        b = Math.floor(15 + t * 8);
      }
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      bg.fillRect(0, y, mapWidth * 2, 4);
    }

    const window1 = this.add.graphics();
    window1.setScrollFactor(0.3);
    window1.setDepth(-9);

    if (this.currentLevel === 0) {
      // Prison window
      window1.fillStyle(0x223355, 0.6);
      window1.fillRect(200, 40, 60, 80);
      window1.fillStyle(0x88aacc, 0.3);
      window1.fillRect(205, 45, 50, 70);
      window1.fillStyle(0x666666);
      window1.fillRect(215, 40, 3, 80);
      window1.fillRect(230, 40, 3, 80);
      window1.fillRect(245, 40, 3, 80);
    } else if (this.currentLevel === 1) {
      // Distant city lights for rooftop level
      for (let i = 0; i < 8; i++) {
        const wx = 80 + i * 120;
        const wy = 60 + Math.sin(i * 1.5) * 30;
        window1.fillStyle(0x443322, 0.5);
        window1.fillRect(wx, wy, 40, 60);
        // Lit windows
        window1.fillStyle(0xffcc66, 0.3);
        window1.fillRect(wx + 5, wy + 5, 12, 10);
        window1.fillRect(wx + 22, wy + 5, 12, 10);
        window1.fillRect(wx + 5, wy + 25, 12, 10);
        window1.fillRect(wx + 22, wy + 40, 12, 10);
      }
    } else {
      // Boss arena - torch sconces on walls
      for (let i = 0; i < 4; i++) {
        const tx = 100 + i * 300;
        const ty = 80;
        // Sconce
        window1.fillStyle(0x554433, 0.6);
        window1.fillRect(tx, ty, 12, 20);
        // Flame glow
        window1.fillStyle(0xff6600, 0.3);
        window1.fillCircle(tx + 6, ty - 5, 15);
        window1.fillStyle(0xffcc00, 0.4);
        window1.fillCircle(tx + 6, ty - 5, 8);
      }
    }
  }

  private handleWin() {
    this.levelComplete = true;
    this.player.sprite.body!.enable = false;

    const nextLevel = this.currentLevel + 1;
    const hasNextLevel = nextLevel < LEVELS.length;

    if (hasNextLevel) {
      this.winText.setText("LEVEL CLEAR!").setVisible(true);
      this.restartText.setText("Press N for next level  |  Press R to replay").setVisible(true);

      this.input.keyboard!.once("keydown-N", () => {
        this.scene.restart({ level: nextLevel });
      });
    } else {
      this.gameWon = true;
      this.winText.setText("FREEDOM!").setVisible(true);
      this.restartText.setText("You escaped! Press R to play again").setVisible(true);
    }

    this.cameras.main.flash(500, 255, 215, 0);
  }

  private handleDeath() {
    if (this.levelComplete) return;
    this.levelComplete = true;
    this.player.sprite.body!.enable = false;

    this.cameras.main.shake(200, 0.01);
    this.cameras.main.flash(300, 200, 0, 0);

    this.winText.setText("CAUGHT!").setVisible(true);
    this.restartText.setText("Press R to restart").setVisible(true);
  }
}
