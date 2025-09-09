export class DialogBox {
  constructor(scene) {
    this.scene = scene;
  }

  // Método principal para crear diálogos
  create(x, y, message, options = {}) {
    // Configuración por defecto que se puede personalizar
    const config = {
      width: 250,
      height: 110,
      fontSize: "16px",
      fontFamily: "Fredoka",
      backgroundColor: 0xFFFFFF,
      borderColor: 0x333333,
      textColor: "#333",
      offsetX: 70, // Distancia del personaje al diálogo
      offsetY: -55, // Altura del diálogo respecto al personaje
      ...options // Sobrescribe con opciones personalizadas
    };

    // Crear fondo del diálogo con cola integrada
    const dialogBg = this.scene.add.graphics();
    dialogBg.fillStyle(config.backgroundColor, 0.95);
    dialogBg.lineStyle(2, config.borderColor);

    // Dibujar todo como un solo path
    dialogBg.beginPath();

    // Comenzar desde la esquina superior izquierda del rectángulo
    const rectX = config.offsetX;
    const rectY = config.offsetY - config.height / 2;
    const rectWidth = config.width;
    const rectHeight = config.height;
    const radius = 12;

    // Esquina superior izquierda (redondeada)
    dialogBg.moveTo(rectX + radius, rectY);

    // Lado superior
    dialogBg.lineTo(rectX + rectWidth - radius, rectY);

    // Esquina superior derecha (redondeada)
    dialogBg.arc(rectX + rectWidth - radius, rectY + radius, radius, -Math.PI / 2, 0);

    // Lado derecho
    dialogBg.lineTo(rectX + rectWidth, rectY + rectHeight - radius);

    // Esquina inferior derecha (redondeada)
    dialogBg.arc(rectX + rectWidth - radius, rectY + rectHeight - radius, radius, 0, Math.PI / 2);

    // Lado inferior hasta donde empieza la cola (esquina inferior izquierda)
    dialogBg.lineTo(rectX + 30, rectY + rectHeight); // Dejar espacio para la cola

    // Cola del diálogo en esquina inferior izquierda
    dialogBg.lineTo(rectX - 20, rectY + rectHeight + 20); // Punto de la cola hacia abajo
    dialogBg.lineTo(rectX + 10, rectY + rectHeight); // Regreso al rectángulo

    // Continuar con esquina inferior izquierda (redondeada parcial)
    dialogBg.lineTo(rectX + radius, rectY + rectHeight);

    // Esquina inferior izquierda (redondeada)
    dialogBg.arc(rectX + radius, rectY + rectHeight - radius, radius, Math.PI / 2, Math.PI);

    // Lado izquierdo
    dialogBg.lineTo(rectX, rectY + radius);

    // Esquina superior izquierda (redondeada)
    dialogBg.arc(rectX + radius, rectY + radius, radius, Math.PI, -Math.PI / 2);

    dialogBg.closePath();
    dialogBg.fillPath();
    dialogBg.strokePath();

    // Crear texto principal
    const dialogText = this.scene.add.text(
      config.offsetX + config.width / 2,
      config.offsetY - 10,
      message, {
        fontSize: config.fontSize,
        fill: config.textColor,
        fontFamily: config.fontFamily,
        align: "center",
        wordWrap: { width: config.width - 20 }
      }
    ).setOrigin(0.5, 0.5);

    // Hacer que el texto no bloquee eventos del contenedor padre
    dialogText.setInteractive({ pixelPerfect: true, useHandCursor: false });
    dialogText.disableInteractive();

    // Crear texto parpadeante "Toca la pantalla para continuar"
    const continueText = this.scene.add.text(
      config.offsetX + config.width / 2,
      config.offsetY + 33,
      "Toca aqui para continuar",
      {
        fontSize: "12px",
        fill: config.textColor,
        fontFamily: config.fontFamily,
        align: "center"
      }
    ).setOrigin(0.5, 0.5);

    // Hacer que el texto no bloquee eventos del contenedor padre
    continueText.setInteractive({ pixelPerfect: true, useHandCursor: false });
    continueText.disableInteractive();

    // Animación de parpadeo
    this.scene.tweens.add({
      targets: continueText,
      alpha: 0.3,
      duration: 800,
      ease: "Power2",
      yoyo: true,
      repeat: -1
    });

    // Retornar container con todos los elementos
    return this.scene.add.container(x, y, [dialogBg, dialogText, continueText]);
  }

  // Método para crear diálogo sin texto de continuar
  createWithoutContinue(x, y, message, options = {}) {
    const config = {
      width: 250,
      height: 90,
      fontSize: "16px",
      fontFamily: "Fredoka",
      backgroundColor: 0xFFFFFF,
      borderColor: 0x333333,
      textColor: "#333",
      offsetX: 70,
      offsetY: -55,
      ...options
    };

    // Crear fondo del diálogo (mismo código que en create)
    const dialogBg = this.scene.add.graphics();
    dialogBg.fillStyle(config.backgroundColor, 0.95);
    dialogBg.lineStyle(2, config.borderColor);

    // Dibujar todo como un solo path
    dialogBg.beginPath();

    const rectX = config.offsetX;
    const rectY = config.offsetY - config.height / 2;
    const rectWidth = config.width;
    const rectHeight = config.height;
    const radius = 12;

    dialogBg.moveTo(rectX + radius, rectY);
    dialogBg.lineTo(rectX + rectWidth - radius, rectY);
    dialogBg.arc(rectX + rectWidth - radius, rectY + radius, radius, -Math.PI / 2, 0);
    dialogBg.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
    dialogBg.arc(rectX + rectWidth - radius, rectY + rectHeight - radius, radius, 0, Math.PI / 2);
    dialogBg.lineTo(rectX + 30, rectY + rectHeight);
    dialogBg.lineTo(rectX - 20, rectY + rectHeight + 20);
    dialogBg.lineTo(rectX + 10, rectY + rectHeight);
    dialogBg.lineTo(rectX + radius, rectY + rectHeight);
    dialogBg.arc(rectX + radius, rectY + rectHeight - radius, radius, Math.PI / 2, Math.PI);
    dialogBg.lineTo(rectX, rectY + radius);
    dialogBg.arc(rectX + radius, rectY + radius, radius, Math.PI, -Math.PI / 2);

    dialogBg.closePath();
    dialogBg.fillPath();
    dialogBg.strokePath();

    // Crear solo texto principal (sin texto de continuar)
    const dialogText = this.scene.add.text(
      config.offsetX + config.width / 2,
      config.offsetY,
      message, {
        fontSize: config.fontSize,
        fill: config.textColor,
        fontFamily: config.fontFamily,
        align: "center",
        wordWrap: { width: config.width - 20 }
      }
    ).setOrigin(0.5, 0.5);

    // Hacer que el texto no bloquee eventos del contenedor padre
    dialogText.setInteractive({ pixelPerfect: true, useHandCursor: false });
    dialogText.disableInteractive();

    return this.scene.add.container(x, y, [dialogBg, dialogText]);
  }

  // Método específico para crear diálogo con cuy
  createWithCuy(x, y, message, options = {}, onClickCallback = null) {
    const cuy = this.scene.add.image(0, 0, "cuy").setScale();
    const dialog = this.create(0, 0, message, options);

    const container = this.scene.add.container(x, y, [cuy, dialog]);

    // Si se proporciona una función callback, crear zonas clickeables
    if (onClickCallback && typeof onClickCallback === "function") {
      // Zona clickeable 1: Alrededor del personaje cuy (lado izquierdo)
      const cuyClickArea = this.scene.add.graphics();
      cuyClickArea.lineStyle(2, 0x00FF00, 0.5); // Verde semi-transparente
      cuyClickArea.strokeRect(-80, -60, 120, 120); // Área alrededor del cuy
      cuyClickArea.setInteractive({ hitArea: { x: -80, y: -60, width: 120, height: 120 }, hitAreaCallback: function (hitArea, x, y) { return x >= hitArea.x && x <= hitArea.x + hitArea.width && y >= hitArea.y && y <= hitArea.y + hitArea.height; } });
      cuyClickArea.on("pointerdown", onClickCallback);

      // Zona clickeable 2: Alrededor del diálogo (lado derecho)
      const dialogClickArea = this.scene.add.graphics();
      dialogClickArea.lineStyle(2, 0xFF0000, 0.5); // Rojo semi-transparente
      dialogClickArea.strokeRect(40, -110, 280, 140); // Área alrededor del diálogo
      dialogClickArea.setInteractive({ hitArea: { x: 40, y: -110, width: 280, height: 140 }, hitAreaCallback: function (hitArea, x, y) { return x >= hitArea.x && x <= hitArea.x + hitArea.width && y >= hitArea.y && y <= hitArea.y + hitArea.height; } });
      dialogClickArea.on("pointerdown", onClickCallback);

      // Agregar ambas áreas al container
      container.add([cuyClickArea, dialogClickArea]);
    }

    return container;
  }

  // Método para crear diálogo con cuy sin texto de continuar
  createWithCuySimple(x, y, message, options = {}, onClickCallback = null) {
    const cuy = this.scene.add.image(0, 0, "cuy").setScale();
    const dialog = this.createWithoutContinue(0, 0, message, { ...options, showContinue: false });

    const container = this.scene.add.container(x, y, [cuy, dialog]);

    // Si se proporciona una función callback, crear zonas clickeables
    if (onClickCallback && typeof onClickCallback === "function") {
      // Zona clickeable 1: Alrededor del personaje cuy (lado izquierdo)
      const cuyClickArea = this.scene.add.graphics();
      cuyClickArea.lineStyle(2, 0x00FF00, 0.5); // Verde semi-transparente
      cuyClickArea.strokeRect(-80, -60, 120, 120); // Área alrededor del cuy
      cuyClickArea.setInteractive({ hitArea: { x: -80, y: -60, width: 120, height: 120 }, hitAreaCallback: function (hitArea, x, y) { return x >= hitArea.x && x <= hitArea.x + hitArea.width && y >= hitArea.y && y <= hitArea.y + hitArea.height; } });
      cuyClickArea.on("pointerdown", onClickCallback);

      // Zona clickeable 2: Alrededor del diálogo (lado derecho)
      const dialogClickArea = this.scene.add.graphics();
      dialogClickArea.lineStyle(2, 0xFF0000, 0.5); // Rojo semi-transparente
      dialogClickArea.strokeRect(40, -110, 280, 140); // Área alrededor del diálogo
      dialogClickArea.setInteractive({ hitArea: { x: 40, y: -110, width: 280, height: 140 }, hitAreaCallback: function (hitArea, x, y) { return x >= hitArea.x && x <= hitArea.x + hitArea.width && y >= hitArea.y && y <= hitArea.y + hitArea.height; } });
      dialogClickArea.on("pointerdown", onClickCallback);

      // Agregar ambas áreas al container
      container.add([cuyClickArea, dialogClickArea]);
    }

    return container;
  }

  // Método para crear múltiples diálogos con animación
  createAnimated(x, y, message, options = {}) {
    const dialogContainer = this.create(x, y, message, options);

    // Animación de entrada
    dialogContainer.setAlpha(0).setScale(0.8);
    this.scene.tweens.add({
      targets: dialogContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut"
    });

    return dialogContainer;
  }
}
