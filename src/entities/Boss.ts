import Phaser from "phaser";

export interface BossConfig {
  x: number;
  y: number;
  patrolLeft: number;
  patrolRight: number;
  speed: number;
}

export class Boss {
  sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private patrolLeft: number;
  private patrolRight: number;
  private speed: number;
  private direction: 1 | -1 = 1;
  private animTimer = 0;
  private currentFrame = 0;

  // 5 hook points as mutable {x,y} objects that move with the boss.
  // These same references are passed to the Player's hook target array,
  // so mutating .x/.y here each frame makes the grapple anchor follow automatically.
  hookPoints: { x: number; y: number }[] = [];
  hookPointHit: boolean[] = [false, false, false, false, false];
  hitsLanded = 0;
  readonly TOTAL_HITS = 5;
  isDead = false;

  // Offsets relative to boss sprite center (128x128 sprite)
  // Positions: head, left shoulder, right shoulder, left foot, right foot
  private static readonly HOOK_OFFSETS = [
    { dx: 0, dy: -50 },
    { dx: -40, dy: -20 },
    { dx: 40, dy: -20 },
    { dx: -20, dy: 50 },
    { dx: 20, dy: 50 },
  ];

  private hookSprites: Phaser.GameObjects.Arc[] = [];
  private deathTimer = 0;
  private deathPhase = 0;

  constructor(scene: Phaser.Scene, config: BossConfig) {
    this.scene = scene;
    this.patrolLeft = config.patrolLeft;
    this.patrolRight = config.patrolRight;
    this.speed = config.speed;

    this.sprite = scene.physics.add.sprite(config.x, config.y, "boss-walk1");
    this.sprite.setDisplaySize(128, 128);
    this.sprite.setSize(80, 110);
    this.sprite.setOffset(24, 18);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);

    // Create the 5 mutable hook point objects
    for (let i = 0; i < 5; i++) {
      this.hookPoints.push({ x: config.x, y: config.y });
    }

    // Glowing weak-point indicators
    for (let i = 0; i < 5; i++) {
      const circle = scene.add.circle(0, 0, 8, 0xff4444, 0.8);
      circle.setDepth(3);
      scene.tweens.add({
        targets: circle,
        scaleX: 1.4,
        scaleY: 1.4,
        alpha: 0.5,
        yoyo: true,
        repeat: -1,
        duration: 600,
        ease: "Sine.easeInOut",
      });
      this.hookSprites.push(circle);
    }
  }

  update(_time: number, delta: number) {
    if (this.isDead) {
      this.updateDeathSequence(delta);
      return;
    }
    if (!this.sprite.active) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Patrol movement
    body.setVelocityX(this.speed * this.direction);

    if (this.sprite.x >= this.patrolRight || body.blocked.right) {
      this.direction = -1;
    } else if (this.sprite.x <= this.patrolLeft || body.blocked.left) {
      this.direction = 1;
    }

    this.sprite.setFlipX(this.direction === -1);

    // Walk animation
    this.animTimer += delta;
    if (this.animTimer > 200) {
      this.animTimer = 0;
      this.currentFrame = this.currentFrame === 0 ? 1 : 0;
    }
    this.sprite.setTexture(this.currentFrame === 0 ? "boss-walk1" : "boss-walk2");

    // Update hook point world positions (flip dx when facing left)
    const flipSign = this.direction === -1 ? -1 : 1;
    for (let i = 0; i < 5; i++) {
      const off = Boss.HOOK_OFFSETS[i];
      this.hookPoints[i].x = this.sprite.x + off.dx * flipSign;
      this.hookPoints[i].y = this.sprite.y + off.dy;

      if (!this.hookPointHit[i]) {
        this.hookSprites[i].setPosition(this.hookPoints[i].x, this.hookPoints[i].y);
        this.hookSprites[i].setVisible(true);
      } else {
        this.hookSprites[i].setVisible(false);
      }
    }
  }

  /** Called when player releases a grapple from one of the boss's hooks. */
  registerHit(hookIndex: number): boolean {
    if (hookIndex < 0 || hookIndex >= 5) return false;
    if (this.hookPointHit[hookIndex]) return false;

    this.hookPointHit[hookIndex] = true;
    this.hitsLanded++;

    // Visual: weak point explodes
    const sprite = this.hookSprites[hookIndex];
    sprite.setFillStyle(0xffffff);
    this.scene.tweens.add({
      targets: sprite,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => sprite.setVisible(false),
    });

    // Boss flinch
    this.sprite.setTint(0xff0000);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-100);
    this.scene.cameras.main.shake(150, 0.01);

    this.scene.time.delayedCall(300, () => {
      if (this.sprite && this.sprite.scene && !this.isDead) {
        this.sprite.clearTint();
      }
    });

    // Hit particles
    const hx = this.hookPoints[hookIndex].x;
    const hy = this.hookPoints[hookIndex].y;
    for (let i = 0; i < 8; i++) {
      const spark = this.scene.add.circle(
        hx + Phaser.Math.Between(-10, 10),
        hy + Phaser.Math.Between(-10, 10),
        3, 0xff6644, 1
      );
      this.scene.tweens.add({
        targets: spark,
        x: spark.x + Phaser.Math.Between(-30, 30),
        y: spark.y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: 500,
        onComplete: () => spark.destroy(),
      });
    }

    // Boss gets faster after each hit
    this.speed += 15;

    if (this.hitsLanded >= this.TOTAL_HITS) {
      this.startDeathSequence();
    }

    return true;
  }

  /** Find which hook index a given reference matches (uses reference equality). */
  getHookIndex(hookRef: { x: number; y: number }): number {
    return this.hookPoints.indexOf(hookRef);
  }

  get deathComplete(): boolean {
    return this.deathPhase >= 2;
  }

  private startDeathSequence() {
    this.isDead = true;
    this.deathTimer = 0;
    this.deathPhase = 0;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    body.enable = false;
  }

  private updateDeathSequence(delta: number) {
    this.deathTimer += delta;

    // Phase 0 (0-1500ms): Flash and shake, small explosions
    if (this.deathPhase === 0) {
      this.sprite.setVisible(Math.floor(this.deathTimer / 80) % 2 === 0);

      if (Math.floor(this.deathTimer / 200) > Math.floor((this.deathTimer - delta) / 200)) {
        this.spawnExplosion(
          this.sprite.x + Phaser.Math.Between(-50, 50),
          this.sprite.y + Phaser.Math.Between(-50, 50)
        );
        this.scene.cameras.main.shake(100, 0.008);
      }

      if (this.deathTimer >= 1500) {
        this.deathPhase = 1;
        this.deathTimer = 0;
      }
    }
    // Phase 1 (0-500ms): Big final explosion
    else if (this.deathPhase === 1) {
      if (this.deathTimer < 100) {
        this.scene.cameras.main.flash(500, 255, 200, 100);
        this.scene.cameras.main.shake(400, 0.02);

        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2;
          const speed = Phaser.Math.Between(80, 200);
          const particle = this.scene.add.circle(
            this.sprite.x, this.sprite.y,
            Phaser.Math.Between(3, 8),
            Math.random() > 0.5 ? 0xff4400 : 0xffcc00,
            1
          );
          this.scene.tweens.add({
            targets: particle,
            x: particle.x + Math.cos(angle) * speed,
            y: particle.y + Math.sin(angle) * speed,
            alpha: 0,
            scaleX: 0.1,
            scaleY: 0.1,
            duration: 800,
            onComplete: () => particle.destroy(),
          });
        }

        this.sprite.setVisible(false);
        this.sprite.active = false;
      }

      if (this.deathTimer >= 500) {
        this.deathPhase = 2;
      }
    }
  }

  private spawnExplosion(x: number, y: number) {
    const colors = [0xff4400, 0xffaa00, 0xff0000];
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.circle(
        x, y,
        Phaser.Math.Between(2, 5),
        colors[Phaser.Math.Between(0, 2)],
        1
      );
      this.scene.tweens.add({
        targets: p,
        x: p.x + Phaser.Math.Between(-25, 25),
        y: p.y + Phaser.Math.Between(-25, 25),
        alpha: 0,
        duration: 400,
        onComplete: () => p.destroy(),
      });
    }
  }
}
