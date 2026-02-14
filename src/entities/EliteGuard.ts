import Phaser from "phaser";
import { EliteGuardConfig } from "../levels/level2";

export class EliteGuard {
  sprite: Phaser.Physics.Arcade.Sprite;
  private patrolLeft: number;
  private patrolRight: number;
  private speed: number;
  private direction: 1 | -1 = 1;
  private animTimer = 0;
  private currentFrame = 0;

  // Takes 2 hits to stun
  hitsRemaining = 2;
  private readonly MAX_HITS = 2;

  constructor(scene: Phaser.Scene, config: EliteGuardConfig) {
    this.patrolLeft = config.patrolLeft;
    this.patrolRight = config.patrolRight;
    this.speed = config.speed;

    this.sprite = scene.physics.add.sprite(config.x, config.y, "elite-walk1");
    this.sprite.setSize(20, 28);
    this.sprite.setOffset(6, 4);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
  }

  update(_time: number, delta: number) {
    if (!this.sprite.active) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Patrol movement
    body.setVelocityX(this.speed * this.direction);

    // Reverse at patrol bounds or when hitting a wall
    if (this.sprite.x >= this.patrolRight || body.blocked.right) {
      this.direction = -1;
    } else if (this.sprite.x <= this.patrolLeft || body.blocked.left) {
      this.direction = 1;
    }

    // Flip sprite to face movement direction
    this.sprite.setFlipX(this.direction === -1);

    // Walk animation (faster than regular guard)
    this.animTimer += delta;
    if (this.animTimer > 150) {
      this.animTimer = 0;
      this.currentFrame = this.currentFrame === 0 ? 1 : 0;
    }
    this.sprite.setTexture(this.currentFrame === 0 ? "elite-walk1" : "elite-walk2");
  }

  /** Called when hit by tail whip. Returns true if fully stunned. */
  takeHit(): boolean {
    this.hitsRemaining--;
    return this.hitsRemaining <= 0;
  }

  /** Reset hits after recovering from stun */
  resetHits() {
    this.hitsRemaining = this.MAX_HITS;
  }
}
