import Phaser from "phaser";

export class RoundedTextBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, options = {}) {
    super(scene, x, y);

    const width = options.width || 200;
    const height = options.height || 100;
    const radius = options.radius || 10;
    const bgColor = options.bgColor || 0xFFFFFF;
    const alpha = options.alpha || 1;
    const fontSize = options.fontSize || "24px";
    const fill = options.fill || "#fff";
    const fontFamily = options.fontFamily || "Fredoka";
    const wordWrapWidth = options.wordWrapWidth || width - 20;
    const stroke = options.stroke || "#000000";
    const strokeThickness = options.strokeThickness || 2;
    const onClick = options.onClick || (() => {});

    // Crear rectángulo redondeado
    const graphics = scene.add.graphics();
    graphics.fillStyle(bgColor, alpha);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    this.add(graphics);

    // Establecer el tamaño del contenedor para la interacción
    this.setSize(width, height);

    // Crear texto
    const textObj = scene.add.text(0, 0, text, {
      fontSize,
      fill,
      fontFamily,
      wordWrap: { width: wordWrapWidth },
      align: "center",
      stroke,
      strokeThickness,
      fontStyle: "bold"
    });
    textObj.setOrigin(0.5);
    this.add(textObj);

    scene.add.existing(this);

    // Hacer interactivo
    this.setInteractive();
    this.on("pointerdown", () => onClick(this));
  }
}
