import Phaser from "phaser";
export class BackBtn extends Phaser.GameObjects.Container {
  constructor(scene, x = 45, y = 36, {
    radius = 23,
    onClick = () => console.log("Botón salir clickeado"),
    baseColor = 0x2196F3,
    hoverColor = 0x42A5F5,
    borderColor = 0x1976D2,
    depth = 999
  } = {}) {
    super(scene, x, y);
    scene.add.existing(this);

    this.opts = { radius, onClick, baseColor, hoverColor, borderColor };
    this.setDepth(depth);

    // Graphics
    this.buttonCircle = scene.add.graphics();
    this.arrow = scene.add.graphics();
    this.add([this.buttonCircle, this.arrow]);

    this.drawBase(baseColor, borderColor, radius);
    this.drawArrow(radius);

    // No interactividad - solo visual
    this.setSize(radius * 2, radius * 2);

    this.setInteractive();
    this.on("pointerdown", () => this.opts.onClick());
  }

  drawBase(fill, border, radius) {
    this.buttonCircle.clear();
    this.buttonCircle.fillStyle(fill, 1);
    this.buttonCircle.lineStyle(3, border, 1);
    this.buttonCircle.fillCircle(0, 0, radius);
    this.buttonCircle.strokeCircle(0, 0, radius);
  }

  drawArrow(radius) {
    // Redibujar flecha clásica (no cambiar diseño original)
    this.arrow.clear();
    this.arrow.fillStyle(0xFFFFFF, 1);
    this.arrow.beginPath();
    this.arrow.moveTo(-14, 0);
    this.arrow.lineTo(-3, -10);
    this.arrow.lineTo(-3, -5);
    this.arrow.lineTo(10, -5);
    this.arrow.lineTo(10, 5);
    this.arrow.lineTo(-3, 5);
    this.arrow.lineTo(-3, 10);
    this.arrow.closePath();
    this.arrow.fillPath();
  }

  setHover(active) {
    const { baseColor, hoverColor, borderColor, radius } = this.opts;
    if (active) {
      this.drawBase(hoverColor, borderColor, radius);
      this.setScale(1.1);
      this.scene.input.setDefaultCursor("pointer");
    } else {
      this.drawBase(baseColor, borderColor, radius);
      this.setScale(1);
      this.scene.input.setDefaultCursor("default");
    }
  }

  setOnClick(cb) {
    if (typeof cb === "function") this.opts.onClick = cb;
  }

  setEnabled(enabled) {
    if (enabled) {
      this.setInteractive();
      this.setAlpha(1);
    } else {
      this.disableInteractive();
      this.setAlpha(0.5);
    }
  }

  destroy(fromScene) {
    this.buttonCircle.destroy();
    this.arrow.destroy();
    super.destroy(fromScene);
  }
}
