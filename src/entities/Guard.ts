import Phaser from "phaser";

export interface GuardConfig {
  x: number;
  y: number;
  patrolLeft: number;
  patrolRight: number;
  speed: number;
}

export class Guard {
  sprite: Phaser.Physics.Arcade.Sprite;
  private patrolLeft: number;
  private patrolRight: number;
  private speed: number;
  private direction: 1 | -1 = 1;
  private animTimer = 0;
  private currentFrame = 0;

  constructor(scene: Phaser.Scene, config: GuardConfig) {
    this.patrolLeft = config.patrolLeft;
    this.patrolRight = config.patrolRight;
    this.speed = config.speed;

    this.sprite = scene.physics.add.sprite(config.x, config.y, "guard-walk1");
    this.sprite.setSize(20, 28);
    this.sprite.setOffset(6, 4);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
  }

  update(_time: number, delta: number) {
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

    // Simple walk animation
    this.animTimer += delta;
    if (this.animTimer > 200) {
      this.animTimer = 0;
      this.currentFrame = this.currentFrame === 0 ? 1 : 0;
    }
    this.sprite.setTexture(this.currentFrame === 0 ? "guard-walk1" : "guard-walk2");
  }
}
