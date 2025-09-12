export class OverlayBox {
  constructor(scene, {
    x = scene.scale.width / 2,
    y = scene.scale.height / 2,
    width = 760,
    height = 260,
    color = 0x000000,
    alpha = 0.5,
    cornerRadius = 20
  } = {}) {
    this.scene = scene;
    this.graphics = scene.add.graphics();

    this.config = {
      x,
      y,
      width,
      height,
      color,
      alpha,
      cornerRadius
    };

    // Llamar createOverlay directamente en el constructor
    this.createOverlay();
  }

  createOverlay() {
    const { x, y, width, height, color, alpha, cornerRadius } = this.config;

    this.graphics.fillStyle(color, alpha);
    this.graphics.fillRoundedRect(
      x - width / 2,  // X centrado
      y - height / 2, // Y centrado
      width,
      height,
      cornerRadius
    );
  }

  // Método para cambiar configuración dinámicamente
  updateOverlay(newConfig = {}) {
    this.config = { ...this.config, ...newConfig };

    this.graphics.clear();

    this.createOverlay();
  }

  // Métodos de utilidad
  setSize(width, height) {
    this.updateOverlay({ width, height });
  }

  setPosition(x, y) {
    this.updateOverlay({ x, y });
  }

  setColor(color, alpha = this.config.alpha) {
    this.updateOverlay({ color, alpha });
  }

  setAlpha(alpha) {
    this.updateOverlay({ alpha });
  }
}
