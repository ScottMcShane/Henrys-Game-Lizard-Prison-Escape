import Phaser from "phaser";
import { TILE_SIZE } from "../levels/level1";

export interface BarrelConfig {
  x: number;
  y: number;
  velocityX: number;
}

export class Barrel {
  sprite: Phaser.Physics.Arcade.Sprite;
  private startX: number;
  private startY: number;
  private velX: number;
  private mapWidth: number;

  constructor(scene: Phaser.Scene, config: BarrelConfig, mapWidth: number) {
    this.startX = config.x;
    this.startY = config.y;
    this.velX = config.velocityX;
    this.mapWidth = mapWidth;

    this.sprite = scene.physics.add.sprite(config.x, config.y, "barrel");
    this.sprite.setSize(24, 24);
    this.sprite.setOffset(4, 4);
    this.sprite.setBounce(0.2);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setVelocityX(this.velX);
  }

  update() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Reverse direction when hitting a wall
    if (body.blocked.left || body.blocked.right) {
      this.velX = -this.velX;
    }

    // Keep barrel rolling at constant speed when on ground
    if (body.blocked.down) {
      body.setVelocityX(this.velX);
    }

    // Rotate sprite for rolling effect
    this.sprite.angle += this.velX > 0 ? 3 : -3;

    // Respawn if barrel goes off screen edges or falls off map
    if (this.sprite.x < -TILE_SIZE || this.sprite.x > this.mapWidth + TILE_SIZE || this.sprite.y > 600) {
      this.sprite.setPosition(this.startX, this.startY);
      body.setVelocity(this.velX, 0);
      this.sprite.angle = 0;
    }
  }
}
