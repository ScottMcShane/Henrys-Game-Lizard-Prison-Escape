import Phaser from "phaser";

export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super({ key: "InstructionsScene" });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;

    // Dark overlay background
    this.add.rectangle(cx, height / 2, width, height, 0x0d0d1a);

    // Title
    this.add
      .text(cx, 36, "LIZARD ESCAPE", {
        fontSize: "28px",
        color: "#ffd700",
        fontFamily: "monospace",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 68, "— HOW TO PLAY —", {
        fontSize: "13px",
        color: "#aaaacc",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Ability cards
    const cards: { key: string; title: string; desc: string; color: number; textColor: string }[] = [
      {
        key: "SPACE / W / ↑\n(twice in the air)",
        title: "DOUBLE JUMP",
        desc: "Jump once to leap, then jump\nagain mid-air for extra height.",
        color: 0x1a3a5e,
        textColor: "#66ccff",
      },
      {
        key: "X",
        title: "TAIL WHIP",
        desc: "Spin your tail to stun guards\nand smash breakable walls.",
        color: 0x3a1a1a,
        textColor: "#ff6666",
      },
      {
        key: "Z",
        title: "TONGUE GRAPPLE",
        desc: "Latch onto golden hook points\nand swing. Jump to release\nwith a speed boost.",
        color: 0x1a3a1a,
        textColor: "#66ff99",
      },
    ];

    const cardW = 210;
    const cardH = 160;
    const cardY = 220;
    const spacing = 230;
    const startX = cx - spacing;

    cards.forEach((card, i) => {
      const x = startX + i * spacing;

      // Card background
      const bg = this.add.rectangle(x, cardY, cardW, cardH, card.color);
      bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(card.textColor).color);

      // Key badge
      const badge = this.add.rectangle(x, cardY - cardH / 2 + 28, cardW - 16, 40, 0x000000, 0.5);
      badge.setStrokeStyle(1, 0x555577);

      this.add
        .text(x, cardY - cardH / 2 + 28, card.key, {
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: "monospace",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5);

      // Ability title
      this.add
        .text(x, cardY - cardH / 2 + 68, card.title, {
          fontSize: "14px",
          color: card.textColor,
          fontFamily: "monospace",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      // Description
      this.add
        .text(x, cardY - cardH / 2 + 106, card.desc, {
          fontSize: "11px",
          color: "#ccccdd",
          fontFamily: "monospace",
          align: "center",
          lineSpacing: 4,
        })
        .setOrigin(0.5);
    });

    // Other controls hint
    this.add
      .text(cx, 340, "Move: Arrow keys / WASD     Wall jump: Jump while against a wall     R: Restart", {
        fontSize: "10px",
        color: "#666688",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Divider line
    const line = this.add.graphics();
    line.lineStyle(1, 0x333355);
    line.lineBetween(cx - 340, 358, cx + 340, 358);

    // Flashing "press any key" prompt
    const prompt = this.add
      .text(cx, 400, "PRESS ANY KEY TO START", {
        fontSize: "16px",
        color: "#ffd700",
        fontFamily: "monospace",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Lizard sprite preview using existing texture
    const lizardX = cx - 10;
    const lizardY = 440;
    this.add.image(lizardX, lizardY, "lizard-idle").setScale(2);

    // Tongue lick animation (fires every 5 seconds)
    const tongue = this.add.graphics();
    const lick = () => {
      tongue.clear();
      tongue.lineStyle(2, 0xff44aa);
      // Tongue base at the lizard's mouth (head right edge in world space)
      // Head ellipse center at texture (24,12), x-radius 6 → right edge at x≈30
      // World x = lizardX - 32 + 30*2 = lizardX + 28, y = lizardY - 32 + 12*2 = lizardY - 8
      const mx = lizardX + 28;
      const my = lizardY - 8;
      tongue.beginPath();
      tongue.moveTo(mx, my);
      tongue.lineTo(mx + 16, my);
      // Forked tip
      tongue.moveTo(mx + 16, my);
      tongue.lineTo(mx + 20, my - 3);
      tongue.moveTo(mx + 16, my);
      tongue.lineTo(mx + 20, my + 3);
      tongue.strokePath();
      this.time.delayedCall(400, () => tongue.clear());
    };
    this.time.addEvent({ delay: 5000, callback: lick, loop: true });

    // Author credit — right aligned
    this.add
      .text(width - 12, height - 10, "by Henry", {
        fontSize: "12px",
        color: "#666688",
        fontFamily: "monospace",
        fontStyle: "italic",
      })
      .setOrigin(1, 1);

    // Start on any key or pointer
    this.input.keyboard!.once("keydown", () => this.scene.start("GameScene"));
    this.input.once("pointerdown", () => this.scene.start("GameScene"));
  }
}
