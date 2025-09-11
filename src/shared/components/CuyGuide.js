import Phaser from "phaser";

export class CuyGuide extends Phaser.GameObjects.Container {
  constructor(scene, x = 530, y = 250, {
    dialogConfig = {
      width: 300,
      height: 100,
      // backgroundColor: 0xFFFFFF,
      borderColor: 0x333333,
      textStyle: {
        fontSize: "16px",
        fill: "#333333",
        fontFamily: "Fredoka",
        wordWrap: { width: 280 }
      }
    },
    cuyScale = 1,
    dialogPosition = "right" // "left", "right", "top", "bottom"
  } = {}) {
    super(scene, x, y);
    scene.add.existing(this);

    this.scene = scene;
    this.dialogConfig = dialogConfig;
    this.dialogPosition = dialogPosition;
    this.currentDialog = null;
    this.dialogQueue = [];
    this.isDialogActive = false;

    // Crear el personaje Cuy
    this.cuy = scene.add.image(0, 0, "cuy")
      .setOrigin(0.5, 1) // Origen en la parte inferior para mejor posicionamiento
      .setScale(cuyScale);

    this.add(this.cuy);

    // Configurar eventos
    this.setupEvents();
  }

  setupEvents() {
    // Animación idle del cuy (opcional)
    this.scene.tweens.add({
      targets: this.cuy,
      y: -10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  // Mostrar un diálogo simple
  showDialog(text, duration = 3000) {
    if (this.isDialogActive) {
      this.dialogQueue.push({ text, duration });
      return;
    }

    this.createDialogBox(text);
    this.isDialogActive = true;

    // Auto-cerrar después del tiempo especificado
    if (duration > 0) {
      this.scene.time.delayedCall(duration, () => {
        this.hideDialog();
      });
    }
  }

  // Mostrar diálogo con botón de continuar
  showDialogWithButton(text, buttonText = "Continuar", onComplete = null) {
    if (this.isDialogActive) {
      this.dialogQueue.push({ text, buttonText, onComplete, withButton: true });
      return;
    }

    this.createDialogBox(text, true, buttonText, onComplete);
    this.isDialogActive = true;
  }

  createDialogBox(text, withButton = false, buttonText = "Continuar", onComplete = null) {
    const { width, height, borderColor, textStyle } = this.dialogConfig;

    // Calcular posición del diálogo
    const dialogPos = this.getDialogPosition();

    // Crear container para el diálogo
    this.currentDialog = this.scene.add.container(dialogPos.x, dialogPos.y);

    // Fondo del diálogo
    const dialogBg = this.scene.add.graphics()
      .fillStyle(0xFFFFFF, 0.95)
      .lineStyle(2, borderColor, 1)
      .fillRoundedRect(-width / 2, -height / 2, width, height, 10)
      .strokeRoundedRect(-width / 2, -height / 2, width, height, 10);

    // Texto del diálogo con wordWrap correcto
    const dialogText = this.scene.add.text(0, withButton ? -10 : 0, text, {
      ...textStyle,
      align: "center",
      wordWrap: {
        width: width - 20, // Ancho del cuadro menos padding (20px total)
        useAdvancedWrap: true // Permite mejor control del wrapping
      }
    }).setOrigin(0.5, 0.5);

    this.currentDialog.add([dialogBg, dialogText]);

    // Botón si es necesario
    if (withButton) {
      const button = this.createDialogButton(buttonText, () => {
        this.hideDialog();
        if (onComplete) onComplete();
      });
      this.currentDialog.add(button);
    }

    // Animación de aparición
    this.currentDialog.setScale(0.1);
    this.scene.tweens.add({
      targets: this.currentDialog,
      scale: 1,
      duration: 300,
      ease: "Back.easeOut"
    });

    this.add(this.currentDialog);
  }

  createDialogButton(text, onClick) {
    const buttonContainer = this.scene.add.container(0, 25);

    const buttonBg = this.scene.add.graphics()
      .fillStyle(0x4CAF50, 1)
      .fillRoundedRect(-40, -12, 80, 24, 12);

    const buttonText = this.scene.add.text(0, 0, text, {
      fontSize: "14px",
      fill: "#FFFFFF",
      fontFamily: "Fredoka"
    }).setOrigin(0.5, 0.5);

    buttonContainer.add([buttonBg, buttonText]);
    buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-40, -12, 80, 24), Phaser.Geom.Rectangle.Contains);
    buttonContainer.on("pointerdown", onClick);
    buttonContainer.on("pointerover", () => {
      buttonBg.clear().fillStyle(0x45A049, 1).fillRoundedRect(-40, -12, 80, 24, 12);
    });
    buttonContainer.on("pointerout", () => {
      buttonBg.clear().fillStyle(0x4CAF50, 1).fillRoundedRect(-40, -12, 80, 24, 12);
    });

    return buttonContainer;
  }

  getDialogPosition() {
    const offset = 120;
    switch (this.dialogPosition) {
      case "left": {
        return { x: -offset, y: -50 };
      }
      case "right": {
        return { x: offset, y: -50 };
      }
      case "top": {
        return { x: 0, y: -offset };
      }
      case "bottom": {
        return { x: 0, y: offset };
      }
      default: {
        return { x: offset, y: -50 };
      }
    }
  }

  hideDialog() {
    if (!this.currentDialog) return;

    this.scene.tweens.add({
      targets: this.currentDialog,
      scale: 0.1,
      alpha: 0,
      duration: 200,
      ease: "Back.easeIn",
      onComplete: () => {
        this.currentDialog.destroy();
        this.currentDialog = null;
        this.isDialogActive = false;
        this.processQueue();
      }
    });
  }

  processQueue() {
    if (this.dialogQueue.length > 0) {
      const next = this.dialogQueue.shift();
      if (next.withButton) {
        this.showDialogWithButton(next.text, next.buttonText, next.onComplete);
      } else {
        this.showDialog(next.text, next.duration);
      }
    }
  }

  // Método para secuencias de diálogos
  showDialogSequence(dialogs) {
    dialogs.forEach((dialog, index) => {
      if (index === 0) {
        this.showDialogWithButton(dialog.text, dialog.buttonText || "Continuar", dialog.onComplete);
      } else {
        this.dialogQueue.push({
          text: dialog.text,
          buttonText: dialog.buttonText || "Continuar",
          onComplete: dialog.onComplete,
          withButton: true
        });
      }
    });
  }

  // Cambiar posición del cuy
  setCuyPosition(x, y) {
    this.setPosition(x, y);
  }

  // Cambiar escala del cuy
  setCuyScale(scale) {
    this.cuy.setScale(scale);
  }

  // Limpiar diálogos
  clearDialogs() {
    this.dialogQueue = [];
    this.hideDialog();
  }

  destroy(fromScene) {
    this.clearDialogs();
    if (this.currentDialog) {
      this.currentDialog.destroy();
    }
    super.destroy(fromScene);
  }
}
