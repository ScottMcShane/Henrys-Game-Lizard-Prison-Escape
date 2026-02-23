import Phaser from "phaser";

/**
 * BootScene generates all placeholder graphics so we don't need external assets yet.
 * Each "texture" is drawn on a canvas and registered with the texture manager.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create() {
    this.createLizardTextures();
    this.createTileTextures();
    this.createDoorTexture();
    this.createBarrelTexture();
    this.createGuardTextures();
    this.createMovingPlatformTexture();
    this.createBreakableWallTexture();
    this.createHookTexture();
    this.createEliteGuardTextures();
    this.createBossTextures();
    this.scene.start("InstructionsScene");
  }

  private createLizardTextures() {
    const size = 32;

    // --- idle frame ---
    const idle = this.textures.createCanvas("lizard-idle", size, size)!;
    const ictx = idle.getContext();
    this.drawLizard(ictx, size, false);
    idle.refresh();

    // --- run frame 1 (legs together) ---
    const run1 = this.textures.createCanvas("lizard-run1", size, size)!;
    const r1ctx = run1.getContext();
    this.drawLizard(r1ctx, size, false);
    run1.refresh();

    // --- run frame 2 (legs apart) ---
    const run2 = this.textures.createCanvas("lizard-run2", size, size)!;
    const r2ctx = run2.getContext();
    this.drawLizard(r2ctx, size, true);
    run2.refresh();

    // --- jump frame ---
    const jump = this.textures.createCanvas("lizard-jump", size, size)!;
    const jctx = jump.getContext();
    this.drawLizardJump(jctx, size);
    jump.refresh();

    // --- wall slide frame ---
    const wallslide = this.textures.createCanvas("lizard-wallslide", size, size)!;
    const wsctx = wallslide.getContext();
    this.drawLizardWallSlide(wsctx, size);
    wallslide.refresh();

    // --- attack frame ---
    const attack = this.textures.createCanvas("lizard-attack", size, size)!;
    const actx = attack.getContext();
    this.drawLizardAttack(actx, size);
    attack.refresh();
  }

  private drawLizard(
    ctx: CanvasRenderingContext2D,
    s: number,
    legsApart: boolean
  ) {
    ctx.clearRect(0, 0, s, s);

    // Body (green oval)
    ctx.fillStyle = "#4ecb71";
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2 + 2, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#5fd98a";
    ctx.beginPath();
    ctx.ellipse(s / 2 + 8, s / 2 - 4, 6, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s / 2 + 11, s / 2 - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(s / 2 + 12, s / 2 - 6, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = "#3ba55c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s / 2 - 10, s / 2 + 2);
    ctx.quadraticCurveTo(s / 2 - 16, s / 2 - 4, s / 2 - 14, s / 2 - 10);
    ctx.stroke();

    // Legs
    ctx.strokeStyle = "#4ecb71";
    ctx.lineWidth = 2;
    if (legsApart) {
      // Front legs spread
      ctx.beginPath();
      ctx.moveTo(s / 2 + 4, s / 2 + 8);
      ctx.lineTo(s / 2 + 8, s / 2 + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s / 2 + 2, s / 2 + 8);
      ctx.lineTo(s / 2 - 2, s / 2 + 14);
      ctx.stroke();
      // Back legs spread
      ctx.beginPath();
      ctx.moveTo(s / 2 - 4, s / 2 + 8);
      ctx.lineTo(s / 2 - 8, s / 2 + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s / 2 - 6, s / 2 + 8);
      ctx.lineTo(s / 2 - 2, s / 2 + 14);
      ctx.stroke();
    } else {
      // Legs together
      ctx.beginPath();
      ctx.moveTo(s / 2 + 4, s / 2 + 8);
      ctx.lineTo(s / 2 + 4, s / 2 + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s / 2 - 4, s / 2 + 8);
      ctx.lineTo(s / 2 - 4, s / 2 + 14);
      ctx.stroke();
    }
  }

  private drawLizardJump(ctx: CanvasRenderingContext2D, s: number) {
    ctx.clearRect(0, 0, s, s);

    // Body
    ctx.fillStyle = "#4ecb71";
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2, 10, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#5fd98a";
    ctx.beginPath();
    ctx.ellipse(s / 2 + 8, s / 2 - 6, 6, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s / 2 + 11, s / 2 - 8, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(s / 2 + 12, s / 2 - 8, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = "#3ba55c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s / 2 - 10, s / 2);
    ctx.quadraticCurveTo(s / 2 - 16, s / 2 + 6, s / 2 - 12, s / 2 + 10);
    ctx.stroke();

    // Legs tucked
    ctx.strokeStyle = "#4ecb71";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s / 2 + 4, s / 2 + 6);
    ctx.lineTo(s / 2 + 6, s / 2 + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s / 2 - 4, s / 2 + 6);
    ctx.lineTo(s / 2 - 6, s / 2 + 10);
    ctx.stroke();
  }

  private drawLizardWallSlide(ctx: CanvasRenderingContext2D, s: number) {
    ctx.clearRect(0, 0, s, s);

    // Body (vertical orientation - clinging to wall)
    ctx.fillStyle = "#4ecb71";
    ctx.beginPath();
    ctx.ellipse(s / 2, s / 2, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (looking up slightly)
    ctx.fillStyle = "#5fd98a";
    ctx.beginPath();
    ctx.ellipse(s / 2 + 6, s / 2 - 8, 5, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s / 2 + 9, s / 2 - 10, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(s / 2 + 10, s / 2 - 10, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Clinging legs (spread out on wall)
    ctx.strokeStyle = "#4ecb71";
    ctx.lineWidth = 2;
    // Top legs
    ctx.beginPath();
    ctx.moveTo(s / 2 - 6, s / 2 - 4);
    ctx.lineTo(s / 2 - 12, s / 2 - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s / 2 + 4, s / 2 - 4);
    ctx.lineTo(s / 2 + 10, s / 2 - 2);
    ctx.stroke();
    // Bottom legs
    ctx.beginPath();
    ctx.moveTo(s / 2 - 6, s / 2 + 6);
    ctx.lineTo(s / 2 - 12, s / 2 + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s / 2 + 4, s / 2 + 6);
    ctx.lineTo(s / 2 + 10, s / 2 + 10);
    ctx.stroke();

    // Tail hanging down
    ctx.strokeStyle = "#3ba55c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s / 2, s / 2 + 10);
    ctx.quadraticCurveTo(s / 2 - 4, s / 2 + 16, s / 2 - 8, s / 2 + 14);
    ctx.stroke();
  }

  private drawLizardAttack(ctx: CanvasRenderingContext2D, s: number) {
    ctx.clearRect(0, 0, s, s);

    // Body (slight lunge forward)
    ctx.fillStyle = "#4ecb71";
    ctx.beginPath();
    ctx.ellipse(s / 2 - 2, s / 2 + 2, 10, 8, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = "#5fd98a";
    ctx.beginPath();
    ctx.ellipse(s / 2 + 6, s / 2 - 4, 6, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Angry eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s / 2 + 9, s / 2 - 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c00";
    ctx.beginPath();
    ctx.arc(s / 2 + 10, s / 2 - 6, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail whip (extended, glowing)
    ctx.strokeStyle = "#3ba55c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(s / 2 - 12, s / 2 + 2);
    ctx.quadraticCurveTo(s / 2 - 20, s / 2 - 6, s / 2 - 16, s / 2 - 14);
    ctx.stroke();

    // Whip glow effect
    ctx.strokeStyle = "rgba(100, 255, 100, 0.5)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(s / 2 - 12, s / 2 + 2);
    ctx.quadraticCurveTo(s / 2 - 20, s / 2 - 6, s / 2 - 16, s / 2 - 14);
    ctx.stroke();

    // Legs braced
    ctx.strokeStyle = "#4ecb71";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s / 2 + 2, s / 2 + 8);
    ctx.lineTo(s / 2 + 6, s / 2 + 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s / 2 - 4, s / 2 + 8);
    ctx.lineTo(s / 2 - 8, s / 2 + 14);
    ctx.stroke();
  }

  private createHookTexture() {
    const s = 16;
    const tex = this.textures.createCanvas("hook-point", s, s)!;
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, s, s);

    // Ring/hook shape
    ctx.strokeStyle = "#ccaa44";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Inner glow
    ctx.fillStyle = "rgba(255, 200, 50, 0.4)";
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    tex.refresh();
  }

  private createTileTextures() {
    const ts = 32;

    // --- Stone wall tile ---
    const wall = this.textures.createCanvas("tile-wall", ts, ts)!;
    const wctx = wall.getContext();
    wctx.fillStyle = "#4a4a5e";
    wctx.fillRect(0, 0, ts, ts);
    // Brick lines
    wctx.strokeStyle = "#3a3a4e";
    wctx.lineWidth = 1;
    wctx.strokeRect(1, 1, ts - 2, ts / 2 - 1);
    wctx.strokeRect(ts / 2, ts / 2, ts / 2 - 1, ts / 2 - 1);
    wctx.strokeRect(1, ts / 2, ts / 2 - 1, ts / 2 - 1);
    // Noise dots for texture
    wctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 12; i++) {
      wctx.fillRect(
        Math.random() * ts,
        Math.random() * ts,
        1,
        1
      );
    }
    wall.refresh();

    // --- Platform tile ---
    const plat = this.textures.createCanvas("tile-platform", ts, ts)!;
    const pctx = plat.getContext();
    pctx.fillStyle = "#6b6b80";
    pctx.fillRect(0, 0, ts, ts);
    pctx.fillStyle = "#7a7a90";
    pctx.fillRect(0, 0, ts, 4);
    pctx.strokeStyle = "#5a5a6e";
    pctx.lineWidth = 1;
    pctx.strokeRect(0, 0, ts, ts);
    plat.refresh();

    // --- Bar tile (prison bars) ---
    const bar = this.textures.createCanvas("tile-bar", ts, ts)!;
    const bctx = bar.getContext();
    bctx.clearRect(0, 0, ts, ts);
    bctx.fillStyle = "#888";
    bctx.fillRect(6, 0, 3, ts);
    bctx.fillRect(15, 0, 3, ts);
    bctx.fillRect(24, 0, 3, ts);
    // Horizontal bar
    bctx.fillRect(0, ts / 2 - 1, ts, 3);
    bar.refresh();

    // --- Spike tile ---
    const spike = this.textures.createCanvas("tile-spike", ts, ts)!;
    const sctx = spike.getContext();
    sctx.clearRect(0, 0, ts, ts);
    sctx.fillStyle = "#cc3333";
    for (let i = 0; i < 4; i++) {
      const x = i * 8;
      sctx.beginPath();
      sctx.moveTo(x, ts);
      sctx.lineTo(x + 4, ts - 12);
      sctx.lineTo(x + 8, ts);
      sctx.closePath();
      sctx.fill();
    }
    spike.refresh();
  }

  private createBarrelTexture() {
    const s = 32;
    const tex = this.textures.createCanvas("barrel", s, s)!;
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, s, s);

    // Barrel body (brown circle)
    ctx.fillStyle = "#8b5e3c";
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 12, 0, Math.PI * 2);
    ctx.fill();

    // Barrel bands
    ctx.strokeStyle = "#5a3a1e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.arc(s / 2 - 3, s / 2 - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Skull & crossbones marking
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("!", s / 2, s / 2 + 4);

    tex.refresh();
  }

  private createGuardTextures() {
    const w = 32;
    const h = 32;

    for (let frame = 0; frame < 2; frame++) {
      const name = frame === 0 ? "guard-walk1" : "guard-walk2";
      const tex = this.textures.createCanvas(name, w, h)!;
      const ctx = tex.getContext();
      ctx.clearRect(0, 0, w, h);

      // Body (dark blue uniform)
      ctx.fillStyle = "#2a3a6e";
      ctx.fillRect(10, 8, 12, 14);

      // Head
      ctx.fillStyle = "#e8c090";
      ctx.beginPath();
      ctx.arc(w / 2, 7, 5, 0, Math.PI * 2);
      ctx.fill();

      // Hat
      ctx.fillStyle = "#1a2a4e";
      ctx.fillRect(10, 1, 12, 4);
      ctx.fillRect(8, 4, 16, 2);

      // Eyes (angry)
      ctx.fillStyle = "#111";
      ctx.fillRect(13, 6, 2, 2);
      ctx.fillRect(18, 6, 2, 2);
      // Angry eyebrows
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(12, 5);
      ctx.lineTo(15, 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(21, 5);
      ctx.lineTo(18, 4);
      ctx.stroke();

      // Belt
      ctx.fillStyle = "#111";
      ctx.fillRect(10, 18, 12, 2);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(14, 18, 4, 2);

      // Legs (alternate for walking)
      ctx.fillStyle = "#1a2a4e";
      if (frame === 0) {
        ctx.fillRect(12, 22, 4, 8);
        ctx.fillRect(18, 22, 4, 8);
      } else {
        ctx.fillRect(10, 22, 4, 8);
        ctx.fillRect(20, 22, 4, 8);
      }

      // Boots
      ctx.fillStyle = "#333";
      if (frame === 0) {
        ctx.fillRect(11, 28, 6, 3);
        ctx.fillRect(17, 28, 6, 3);
      } else {
        ctx.fillRect(9, 28, 6, 3);
        ctx.fillRect(19, 28, 6, 3);
      }

      tex.refresh();
    }
  }

  private createEliteGuardTextures() {
    const w = 32;
    const h = 32;

    for (let frame = 0; frame < 2; frame++) {
      const name = frame === 0 ? "elite-walk1" : "elite-walk2";
      const tex = this.textures.createCanvas(name, w, h)!;
      const ctx = tex.getContext();
      ctx.clearRect(0, 0, w, h);

      // Body (darker, more intimidating uniform)
      ctx.fillStyle = "#1a1a3e";
      ctx.fillRect(10, 8, 12, 14);

      // Shoulder pads
      ctx.fillStyle = "#cc2222";
      ctx.fillRect(8, 8, 4, 4);
      ctx.fillRect(20, 8, 4, 4);

      // Head
      ctx.fillStyle = "#e8c090";
      ctx.beginPath();
      ctx.arc(w / 2, 7, 5, 0, Math.PI * 2);
      ctx.fill();

      // RED hat (distinguishing feature)
      ctx.fillStyle = "#cc2222";
      ctx.fillRect(10, 1, 12, 4);
      ctx.fillRect(8, 4, 16, 2);
      // Hat badge
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(14, 2, 4, 2);

      // Eyes (angrier)
      ctx.fillStyle = "#c00";
      ctx.fillRect(13, 6, 2, 2);
      ctx.fillRect(18, 6, 2, 2);
      // Angry eyebrows (thicker)
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 5);
      ctx.lineTo(15, 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(21, 5);
      ctx.lineTo(18, 3);
      ctx.stroke();

      // Belt
      ctx.fillStyle = "#111";
      ctx.fillRect(10, 18, 12, 2);
      ctx.fillStyle = "#cc2222";
      ctx.fillRect(14, 18, 4, 2);

      // Legs (alternate for walking)
      ctx.fillStyle = "#1a1a3e";
      if (frame === 0) {
        ctx.fillRect(12, 22, 4, 8);
        ctx.fillRect(18, 22, 4, 8);
      } else {
        ctx.fillRect(10, 22, 4, 8);
        ctx.fillRect(20, 22, 4, 8);
      }

      // Red boots
      ctx.fillStyle = "#881111";
      if (frame === 0) {
        ctx.fillRect(11, 28, 6, 3);
        ctx.fillRect(17, 28, 6, 3);
      } else {
        ctx.fillRect(9, 28, 6, 3);
        ctx.fillRect(19, 28, 6, 3);
      }

      tex.refresh();
    }
  }

  private createMovingPlatformTexture() {
    const w = 32;
    const h = 16;
    const tex = this.textures.createCanvas("tile-moving", w, h)!;
    const ctx = tex.getContext();

    // Platform base
    ctx.fillStyle = "#7a6a50";
    ctx.fillRect(0, 0, w, h);
    // Top highlight
    ctx.fillStyle = "#9a8a70";
    ctx.fillRect(0, 0, w, 3);
    // Rivets
    ctx.fillStyle = "#555";
    ctx.beginPath();
    ctx.arc(4, h / 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w - 4, h / 2, 2, 0, Math.PI * 2);
    ctx.fill();
    // Arrow indicators
    ctx.fillStyle = "#ffd700";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("< >", w / 2, h / 2 + 3);

    tex.refresh();
  }

  private createBreakableWallTexture() {
    const ts = 32;
    const tex = this.textures.createCanvas("tile-breakable", ts, ts)!;
    const ctx = tex.getContext();

    // Cracked stone
    ctx.fillStyle = "#5a5a4e";
    ctx.fillRect(0, 0, ts, ts);
    // Brick pattern
    ctx.strokeStyle = "#4a4a3e";
    ctx.lineWidth = 1;
    ctx.strokeRect(1, 1, ts - 2, ts / 2 - 1);
    ctx.strokeRect(ts / 2, ts / 2, ts / 2 - 1, ts / 2 - 1);
    ctx.strokeRect(1, ts / 2, ts / 2 - 1, ts / 2 - 1);
    // Cracks
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, 4);
    ctx.lineTo(16, 12);
    ctx.lineTo(12, 20);
    ctx.lineTo(20, 28);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(24, 2);
    ctx.lineTo(20, 10);
    ctx.lineTo(26, 16);
    ctx.stroke();
    // Highlight to make it look different from regular wall
    ctx.fillStyle = "rgba(200,180,100,0.1)";
    ctx.fillRect(0, 0, ts, ts);

    tex.refresh();
  }

  private createDoorTexture() {
    const w = 32;
    const h = 48;
    const door = this.textures.createCanvas("door", w, h)!;
    const dctx = door.getContext();

    // Door frame
    dctx.fillStyle = "#8b6914";
    dctx.fillRect(0, 0, w, h);
    // Door panel
    dctx.fillStyle = "#a07818";
    dctx.fillRect(3, 3, w - 6, h - 6);
    // Light glow around door
    dctx.fillStyle = "rgba(255, 255, 150, 0.3)";
    dctx.fillRect(3, 3, w - 6, h - 6);
    // Handle
    dctx.fillStyle = "#ffd700";
    dctx.beginPath();
    dctx.arc(w - 8, h / 2, 3, 0, Math.PI * 2);
    dctx.fill();
    // "EXIT" text
    dctx.fillStyle = "#ffd700";
    dctx.font = "bold 7px monospace";
    dctx.fillText("EXIT", 5, 14);
    door.refresh();
  }

  private createBossTextures() {
    const w = 128;
    const h = 128;

    for (let frame = 0; frame < 2; frame++) {
      const name = frame === 0 ? "boss-walk1" : "boss-walk2";
      const tex = this.textures.createCanvas(name, w, h)!;
      const ctx = tex.getContext();
      ctx.clearRect(0, 0, w, h);

      // Body (dark armored uniform)
      ctx.fillStyle = "#0d0d2a";
      ctx.fillRect(40, 32, 48, 56);
      // Inner armor plate
      ctx.fillStyle = "#1a1a3e";
      ctx.fillRect(44, 36, 40, 48);

      // Large shoulder pads (red with gold trim)
      ctx.fillStyle = "#cc2222";
      ctx.fillRect(28, 28, 20, 20);
      ctx.fillRect(80, 28, 20, 20);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(28, 28, 20, 4);
      ctx.fillRect(80, 28, 20, 4);

      // Head
      ctx.fillStyle = "#d4a070";
      ctx.beginPath();
      ctx.arc(w / 2, 24, 20, 0, Math.PI * 2);
      ctx.fill();

      // Helmet (dark red with gold crest)
      ctx.fillStyle = "#881111";
      ctx.fillRect(36, 0, 56, 18);
      ctx.fillRect(28, 14, 72, 8);
      // Gold crest
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(52, 0, 24, 8);
      ctx.fillRect(60, -4, 8, 8);

      // Glowing red eyes
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(48, 20, 10, 8);
      ctx.fillRect(68, 20, 10, 8);
      // Eye glow
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(53, 24, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(73, 24, 14, 0, Math.PI * 2);
      ctx.fill();

      // Angry eyebrows
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(46, 16);
      ctx.lineTo(58, 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(82, 16);
      ctx.lineTo(70, 12);
      ctx.stroke();

      // Belt with gold buckle
      ctx.fillStyle = "#111";
      ctx.fillRect(40, 72, 48, 10);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(52, 72, 24, 10);

      // Legs
      ctx.fillStyle = "#0d0d2a";
      if (frame === 0) {
        ctx.fillRect(48, 84, 16, 32);
        ctx.fillRect(72, 84, 16, 32);
      } else {
        ctx.fillRect(40, 84, 16, 32);
        ctx.fillRect(80, 84, 16, 32);
      }

      // Heavy boots
      ctx.fillStyle = "#441111";
      if (frame === 0) {
        ctx.fillRect(44, 112, 24, 14);
        ctx.fillRect(68, 112, 24, 14);
      } else {
        ctx.fillRect(36, 112, 24, 14);
        ctx.fillRect(76, 112, 24, 14);
      }

      tex.refresh();
    }
  }
}
