import Phaser from "phaser";

export class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: { up: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private attackKey: Phaser.Input.Keyboard.Key;
  private tongueKey: Phaser.Input.Keyboard.Key;
  private facing: "left" | "right" = "right";
  private animTimer = 0;
  private currentFrame = 0;
  private scene: Phaser.Scene;

  // Tuning constants
  private readonly SPEED = 200;
  private readonly JUMP_VELOCITY = -380;
  private readonly WALL_SLIDE_SPEED = 40;
  private readonly WALL_JUMP_X = 250;
  private readonly WALL_JUMP_Y = -350;

  // Wall climbing state
  private isWallSliding = false;
  private wallSide: "left" | "right" | null = null;

  // Double jump state
  private jumpsRemaining = 2;
  private readonly MAX_JUMPS = 2;

  // Tail whip state
  private isAttacking = false;
  private attackCooldown = 0;
  private readonly ATTACK_DURATION = 200;
  private readonly ATTACK_COOLDOWN = 400;
  tailWhipHitbox: Phaser.GameObjects.Rectangle | null = null;

  // Tongue grapple / swing state
  private isGrappling = false;
  private grappleTarget: { x: number; y: number } | null = null;
  private tongueGraphics: Phaser.GameObjects.Graphics | null = null;
  private readonly GRAPPLE_RANGE = 180;
  private ropeLength = 0;
  private swingAngle = 0;
  private swingAngularVel = 0;
  private readonly SWING_GRAVITY = 800;   // pixels/s² (matches world gravity)
  private readonly SWING_DAMPING = 0.998;
  private readonly SWING_INPUT_FORCE = 1200; // pixels/s² input torque

  // Callback for when tail whip hits something
  onTailWhipHit: ((hitbox: Phaser.GameObjects.Rectangle) => void) | null = null;
  // Callback for when grapple is released (fired before target is cleared)
  onGrappleRelease: ((hookRef: { x: number; y: number }) => void) | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, "lizard-idle");
    this.sprite.setSize(20, 20);
    this.sprite.setOffset(6, 10);
    this.sprite.setBounce(0);
    this.sprite.setCollideWorldBounds(false);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.attackKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.tongueKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.tongueGraphics = scene.add.graphics();
    this.tongueGraphics.setDepth(2);
  }

  update(_time: number, delta: number) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;
    const onWallLeft = body.blocked.left;
    const onWallRight = body.blocked.right;

    // Reset jumps on ground
    if (onGround) {
      this.jumpsRemaining = this.MAX_JUMPS;
      this.isWallSliding = false;
      this.wallSide = null;
    }

    // --- Grapple update ---
    if (this.isGrappling && this.grappleTarget) {
      this.updateGrapple(delta);
      this.updateAnimation(false, false, onGround);
      return; // Skip normal movement while grappling
    }

    // --- Wall sliding ---
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;

    if (!onGround && onWallLeft && left) {
      this.isWallSliding = true;
      this.wallSide = "left";
      body.setVelocityY(this.WALL_SLIDE_SPEED);
      this.jumpsRemaining = this.MAX_JUMPS; // Reset jumps on wall
    } else if (!onGround && onWallRight && right) {
      this.isWallSliding = true;
      this.wallSide = "right";
      body.setVelocityY(this.WALL_SLIDE_SPEED);
      this.jumpsRemaining = this.MAX_JUMPS;
    } else {
      this.isWallSliding = false;
      this.wallSide = null;
    }

    // --- Horizontal movement ---
    if (!this.isWallSliding) {
      if (left) {
        body.setVelocityX(-this.SPEED);
        this.facing = "left";
      } else if (right) {
        body.setVelocityX(this.SPEED);
        this.facing = "right";
      } else {
        body.setVelocityX(0);
      }
    }

    // --- Jump / Wall jump / Double jump ---
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                         Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
                         Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (jumpPressed) {
      if (this.isWallSliding) {
        // Wall jump - launch away from wall
        const dir = this.wallSide === "left" ? 1 : -1;
        body.setVelocityX(this.WALL_JUMP_X * dir);
        body.setVelocityY(this.WALL_JUMP_Y);
        this.facing = dir === 1 ? "right" : "left";
        this.isWallSliding = false;
        this.wallSide = null;
        this.jumpsRemaining = 1; // Allow one more jump after wall jump
      } else if (this.jumpsRemaining > 0) {
        body.setVelocityY(this.JUMP_VELOCITY);
        this.jumpsRemaining--;

        // Double jump particle burst
        if (this.jumpsRemaining === 0) {
          this.spawnDoubleJumpEffect();
        }
      }
    }

    // --- Tail whip attack ---
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);
    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && this.attackCooldown <= 0 && !this.isAttacking) {
      this.performTailWhip();
    }
    if (this.isAttacking) {
      this.updateTailWhip(delta);
    }

    // --- Tongue grapple initiation ---
    if (Phaser.Input.Keyboard.JustDown(this.tongueKey) && !this.isGrappling && !this.isAttacking) {
      this.startGrappleSearch();
    }

    // --- Animation ---
    this.updateAnimation(left, right, onGround);
  }

  private updateAnimation(left: boolean, right: boolean, onGround: boolean) {
    this.sprite.setFlipX(this.facing === "left");

    if (this.isAttacking) {
      this.sprite.setTexture("lizard-attack");
    } else if (this.isGrappling) {
      this.sprite.setTexture("lizard-jump");
    } else if (this.isWallSliding) {
      this.sprite.setTexture("lizard-wallslide");
    } else if (!onGround) {
      this.sprite.setTexture("lizard-jump");
    } else if (left || right) {
      this.animTimer += this.scene.game.loop.delta;
      if (this.animTimer > 120) {
        this.animTimer = 0;
        this.currentFrame = this.currentFrame === 0 ? 1 : 0;
      }
      this.sprite.setTexture(this.currentFrame === 0 ? "lizard-run1" : "lizard-run2");
    } else {
      this.sprite.setTexture("lizard-idle");
      this.animTimer = 0;
      this.currentFrame = 0;
    }
  }

  // --- Tail Whip ---
  private performTailWhip() {
    this.isAttacking = true;
    this.attackCooldown = this.ATTACK_COOLDOWN;

    const offsetX = this.facing === "right" ? 24 : -24;
    this.tailWhipHitbox = this.scene.add.rectangle(
      this.sprite.x + offsetX,
      this.sprite.y,
      20, 16,
      0x3ba55c, 0.6
    );
    this.tailWhipHitbox.setDepth(2);

    // Camera nudge for impact feel
    this.scene.cameras.main.shake(50, 0.003);

    if (this.onTailWhipHit) {
      this.onTailWhipHit(this.tailWhipHitbox);
    }
  }

  private updateTailWhip(delta: number) {
    if (!this.tailWhipHitbox) return;

    this.attackCooldown -= delta; // additional tracking

    // Move hitbox with player
    const offsetX = this.facing === "right" ? 24 : -24;
    this.tailWhipHitbox.setPosition(this.sprite.x + offsetX, this.sprite.y);

    // Check if attack duration expired
    const elapsed = this.ATTACK_COOLDOWN - this.attackCooldown;
    if (elapsed >= this.ATTACK_DURATION) {
      this.tailWhipHitbox.destroy();
      this.tailWhipHitbox = null;
      this.isAttacking = false;
    }
  }

  // --- Double Jump Effect ---
  private spawnDoubleJumpEffect() {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const particle = this.scene.add.circle(
        this.sprite.x,
        this.sprite.y + 10,
        3,
        0x4ecb71, 0.8
      );
      this.scene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos(angle) * 20,
        y: particle.y + Math.sin(angle) * 20,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 300,
        onComplete: () => particle.destroy(),
      });
    }
  }

  // --- Tongue Grapple ---
  setHookPoints(hookPoints: { x: number; y: number }[]) {
    this._hookPoints = hookPoints;
  }
  private _hookPoints: { x: number; y: number }[] = [];

  private startGrappleSearch() {
    // Find nearest hook point within range
    let nearest: { x: number; y: number } | null = null;
    let nearestDist = this.GRAPPLE_RANGE;

    for (const hook of this._hookPoints) {
      const dist = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, hook.x, hook.y);
      const dx = hook.x - this.sprite.x;
      const inFacingDir = (this.facing === "right" && dx >= -32) || (this.facing === "left" && dx <= 32);
      if (dist < nearestDist && inFacingDir) {
        nearestDist = dist;
        nearest = hook;
      }
    }

    if (nearest) {
      this.isGrappling = true;
      this.grappleTarget = nearest;

      // Calculate rope length (distance from hook to player)
      this.ropeLength = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        nearest.x, nearest.y
      );
      this.ropeLength = Math.max(this.ropeLength, 48);

      // Angle convention: 0 = straight down from hook, positive = right
      this.swingAngle = Math.atan2(
        this.sprite.x - nearest.x,
        this.sprite.y - nearest.y
      );

      // Convert current velocity into angular velocity (rad/s)
      // v_tangential = angularVel * ropeLength, so angularVel = v_tangential / ropeLength
      // The tangential direction at angle θ is (cos θ, -sin θ)
      // So v_tangential = vx * cos(θ) - vy * sin(θ)
      const body = this.sprite.body as Phaser.Physics.Arcade.Body;
      const cosA = Math.cos(this.swingAngle);
      const sinA = Math.sin(this.swingAngle);
      const vTangential = body.velocity.x * cosA - body.velocity.y * sinA;
      this.swingAngularVel = vTangential / this.ropeLength;

      // Disable arcade gravity - pendulum sim handles everything
      body.setAllowGravity(false);
    }
  }

  private updateGrapple(delta: number) {
    if (!this.grappleTarget || !this.tongueGraphics) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const dt = delta / 1000; // convert ms to seconds

    // --- Pendulum physics (proper delta-time integration) ---

    // Gravity creates a restoring torque: angular_accel = -(g/L) * sin(angle)
    // Negative sign pulls the pendulum BACK toward angle=0 (straight down)
    const angularAccel = -(this.SWING_GRAVITY / this.ropeLength) * Math.sin(this.swingAngle);
    this.swingAngularVel += angularAccel * dt;

    // Player input adds angular acceleration (like pumping a swing)
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    if (right) {
      this.swingAngularVel += (this.SWING_INPUT_FORCE / this.ropeLength) * dt;
    } else if (left) {
      this.swingAngularVel -= (this.SWING_INPUT_FORCE / this.ropeLength) * dt;
    }

    // Light damping per frame (framerate-independent via pow)
    this.swingAngularVel *= Math.pow(this.SWING_DAMPING, dt * 60);

    // Integrate angle
    this.swingAngle += this.swingAngularVel * dt;

    // Soft clamp to prevent going fully over the top
    if (Math.abs(this.swingAngle) > Math.PI * 0.85) {
      this.swingAngle = Math.sign(this.swingAngle) * Math.PI * 0.85;
      this.swingAngularVel *= -0.3;
    }

    // Place player directly on the pendulum arc (no velocity fighting)
    const newX = this.grappleTarget.x + Math.sin(this.swingAngle) * this.ropeLength;
    const newY = this.grappleTarget.y + Math.cos(this.swingAngle) * this.ropeLength;
    this.sprite.setPosition(newX, newY);
    body.setVelocity(0, 0); // Clear velocity so arcade physics doesn't interfere

    // Face the direction of swing movement
    if (this.swingAngularVel > 0.1) this.facing = "right";
    else if (this.swingAngularVel < -0.1) this.facing = "left";

    // --- Draw tongue rope ---
    this.tongueGraphics.clear();

    // Slight sag in the middle for visual flair
    const midX = (this.sprite.x + this.grappleTarget.x) / 2;
    const midY = (this.sprite.y + this.grappleTarget.y) / 2 + 8;
    this.tongueGraphics.lineStyle(3, 0xff6688);
    this.tongueGraphics.beginPath();
    this.tongueGraphics.moveTo(this.sprite.x, this.sprite.y - 4);
    this.tongueGraphics.lineTo(midX, midY);
    this.tongueGraphics.lineTo(this.grappleTarget.x, this.grappleTarget.y);
    this.tongueGraphics.strokePath();

    // Hook glow
    this.tongueGraphics.fillStyle(0xff4466);
    this.tongueGraphics.fillCircle(this.grappleTarget.x, this.grappleTarget.y, 5);

    // --- Release conditions ---

    // Jump to release - launches with swing momentum + upward boost
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                         Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
                         Phaser.Input.Keyboard.JustDown(this.cursors.space);
    if (jumpPressed) {
      // Tangential velocity: v = angularVel * ropeLength
      // Tangent direction at angle θ is (cos θ, -sin θ)
      const speed = this.swingAngularVel * this.ropeLength;
      const cosA = Math.cos(this.swingAngle);
      const sinA = Math.sin(this.swingAngle);
      const launchVelX = speed * cosA;
      const launchVelY = speed * -sinA + this.JUMP_VELOCITY * 0.6;
      this.endGrapple(body);
      body.setVelocity(
        Phaser.Math.Clamp(launchVelX, -500, 500),
        Math.min(launchVelY, -80)
      );
      this.jumpsRemaining = 1;
      return;
    }

    // Press Z again or Down to drop with current momentum
    if (Phaser.Input.Keyboard.JustDown(this.tongueKey) ||
        Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      const speed = this.swingAngularVel * this.ropeLength;
      const cosA = Math.cos(this.swingAngle);
      const sinA = Math.sin(this.swingAngle);
      this.endGrapple(body);
      body.setVelocity(
        Phaser.Math.Clamp(speed * cosA, -400, 400),
        speed * -sinA
      );
      this.jumpsRemaining = this.MAX_JUMPS;
    }
  }

  private endGrapple(body: Phaser.Physics.Arcade.Body) {
    if (this.onGrappleRelease && this.grappleTarget) {
      this.onGrappleRelease(this.grappleTarget);
    }
    this.isGrappling = false;
    this.grappleTarget = null;
    this.swingAngularVel = 0;
    body.setAllowGravity(true);
    if (this.tongueGraphics) {
      this.tongueGraphics.clear();
    }
  }
}
