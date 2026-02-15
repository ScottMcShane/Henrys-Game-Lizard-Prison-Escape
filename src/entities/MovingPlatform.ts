import Phaser from "phaser";

export interface MovingPlatformConfig {
  x: number;
  y: number;
  distanceX: number;
  distanceY: number;
  speed: number;
  width: number;
}

export class MovingPlatform {
  body: Phaser.Physics.Arcade.Image;
  private startX: number;
  private startY: number;
  private distX: number;
  private distY: number;
  private speed: number;
  private elapsed = 0;

  constructor(scene: Phaser.Scene, config: MovingPlatformConfig) {
    this.startX = config.x;
    this.startY = config.y;
    this.distX = config.distanceX;
    this.distY = config.distanceY;
    this.speed = config.speed;

    // Create a tiled platform appearance by using multiple sprites
    // but use a single physics body
    this.body = scene.physics.add.image(config.x, config.y, "tile-moving");
    this.body.setDisplaySize(config.width, 16);
    this.body.setImmovable(true);
    const phBody = this.body.body as Phaser.Physics.Arcade.Body;
    phBody.setAllowGravity(false);
    phBody.pushable = false;
  }

  update(_time: number, delta: number) {
    this.elapsed += delta;
    const t = Math.sin(this.elapsed * this.speed * 0.001);

    const newX = this.startX + this.distX * t;
    const newY = this.startY + this.distY * t;

    // Directly set position instead of using velocity to avoid frame-rate jitter.
    // Set velocity so standing players are carried along with the platform.
    const body = this.body.body as Phaser.Physics.Arcade.Body;
    const dt = delta / 1000;
    body.setVelocity(
      (newX - this.body.x) / dt,
      (newY - this.body.y) / dt
    );
    this.body.x = newX;
    this.body.y = newY;
    body.position.x = newX - body.halfWidth;
    body.position.y = newY - body.halfHeight;
  }
}
