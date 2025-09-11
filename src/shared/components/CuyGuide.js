import Phaser from "phaser";

export class CuyGuide extends Phaser.GameObjects.Container {
  constructor(scene, x = 530, y = 250, {
    dialogConfig = {
      width: 300,
      height: 100,
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
    // Animación idle del cuy (más lenta)
    this.scene.tweens.add({
      targets: this.cuy,
      y: -5,
      duration: 2000, // Aumentado de 2000 a 3500ms para hacer la animación más lenta
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  // Mostrar un diálogo simple
  showDialog(text) {
    if (this.isDialogActive) {
      this.dialogQueue.push({ text });
      return;
    }

    this.createDialogBox(text);
    this.isDialogActive = true;
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
    const dialogText = this.scene.add.text(0, withButton ? -15 : -10, text, {
      ...textStyle,
      align: "center",
      wordWrap: {
        width: width - 20,
        useAdvancedWrap: true
      }
    }).setOrigin(0.5, 0.5);

    // Letrero "Toca para continuar" en la parte inferior con parpadeo
    const tapToContinueText = this.scene.add.text(0, (height / 2) - 15, "Toca para continuar", {
      fontSize: "12px",
      fill: "#666666",
      fontFamily: "Fredoka",
      fontStyle: "italic"
    }).setOrigin(0.5, 0.5);

    // Agregar animación de parpadeo al letrero
    this.scene.tweens.add({
      targets: tapToContinueText,
      alpha: 0.3, // Fade hacia semi-transparente
      duration: 800, // Duración del parpadeo
      yoyo: true, // Volver al estado original
      repeat: -1, // Repetir infinitamente
      ease: "Sine.easeInOut" // Transición suave
    });

    this.currentDialog.add([dialogBg, dialogText, tapToContinueText]);

    // Hacer el diálogo interactivo - VERSIÓN SIMPLE
    this.currentDialog.setSize(width, height);
    this.currentDialog.setInteractive();

    // Evento para cerrar el diálogo al tocar
    this.currentDialog.on("pointerdown", () => {
      this.hideDialog();
      if (onComplete) onComplete();
    });

    // Efectos visuales al hacer hover
    this.currentDialog.on("pointerover", () => {
      this.scene.input.setDefaultCursor("pointer");
      this.scene.tweens.add({
        targets: this.currentDialog,
        scale: 1.02,
        duration: 100,
        ease: "Power2"
      });
    });

    this.currentDialog.on("pointerout", () => {
      this.scene.input.setDefaultCursor("default");
      this.scene.tweens.add({
        targets: this.currentDialog,
        scale: 1,
        duration: 100,
        ease: "Power2"
      });
    });

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
    const offset = 160; // Separación horizontal
    switch (this.dialogPosition) {
      case "left": {
        return { x: -offset, y: -180 }; // Movido hacia arriba de -80 a -180
      }
      case "right": {
        return { x: offset, y: -180 }; // Movido hacia arriba de -80 a -180
      }
      case "top": {
        return { x: 0, y: -offset };
      }
      case "bottom": {
        return { x: 0, y: offset };
      }
      default: {
        return { x: offset, y: -180 }; // Por defecto movido hacia arriba
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
        this.showDialog(next.text);
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
