import Phaser from "phaser";

import { MinigameManager } from "../../../managers/MinigameManager.js";
import { DialogBox } from "../../../shared/components/DialogBox.js";

export class SequenceGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "SequenceGameScene" });
  }

  init(data) {
    // Configurar el nivel y manager
    this.targetLevel = data.level || 1;
    this.minigameManager = data.minigameManager || new MinigameManager("sequence");
    this.minigameManager.setCurrentLevel(this.targetLevel);

    // Obtener datos del nivel
    this.levelData = this.minigameManager.getCurrentLevelData();

    // Registrar en el game registry para acceso global
    this.registry.set("currentMinigameManager", this.minigameManager);
    this.registry.set("currentLevel", this.targetLevel);

    // Variables de rendimiento
    this.startTime = null;
    this.attempts = 0;
    this.levelCompleted = false;
  }

  preload() {
    // Assets específicos del minijuego
    this.load.image("apple", "./assets/sprites/apple.svg");
    this.load.image("cuy", "./assets/sprites/cuy.png");
    this.load.audio("correct", "./assets/sounds/correct.wav");
    this.load.audio("error", "./assets/sounds/error.wav");
  }

  create() {
    this.startTime = this.time.now;

    // Crear fondo con color del nivel
    this.createBackground();

    // Mostrar información del nivel
    this.createLevelHeader();

    // Crear la secuencia del nivel actual
    this.createSequence();

    // Crear opciones disponibles
    this.createAvailableOptions();

    // Crear tutorial si es el primer nivel
    if (this.targetLevel === 1) {
      this.createTutorialDialog();
    }

    // Crear UI (tiempo, intentos, etc.)
    this.createUI();
  }

  createBackground() {
    const bg = this.add.graphics();
    bg.fillStyle(this.levelData.backgroundColor, 0.1);
    bg.fillRect(0, 0, 800, 600);
  }

  createLevelHeader() {
    // Título del nivel
    this.add.text(400, 50, `Nivel ${this.targetLevel}: ${this.levelData.title}`, {
      fontSize: "24px",
      fill: "#333",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    // Descripción
    this.add.text(400, 80, this.levelData.description, {
      fontSize: "16px",
      fill: "#666",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);
  }

  createSequence() {
    const { sequence, targetPosition } = this.levelData;
    const startX = 200;
    const startY = 180;
    const spacing = 80;

    this.sequenceContainers = [];

    sequence.forEach((value, index) => {
      const x = startX + (index * spacing);

      if (value === "?") {
        // Crear área objetivo
        this.createTargetArea(x, startY, index);
      } else {
        // Crear número de la secuencia
        this.createSequenceNumber(x, startY, value, index);
      }
    });
  }

  createTargetArea(x, y, index) {
    const targetArea = this.add.graphics();
    targetArea.lineStyle(3, 0x999999, 0.8);
    targetArea.strokeRoundedRect(-30, -30, 60, 60, 10);
    targetArea.x = x;
    targetArea.y = y;

    // Agregar texto de interrogación
    const questionMark = this.add.text(x, y, "?", {
      fontSize: "32px",
      fill: "#999",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    // Configurar como zona de drop
    targetArea.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60),
      Phaser.Geom.Rectangle.Contains);

    // Guardar referencia
    this.targetArea = { graphics: targetArea, text: questionMark, index };
  }

  createSequenceNumber(x, y, value, index) {
    const numberBg = this.add.graphics();
    numberBg.fillStyle(0x4CAF50, 0.2);
    numberBg.lineStyle(2, 0x4CAF50);
    numberBg.fillRoundedRect(-25, -25, 50, 50, 8);
    numberBg.strokeRoundedRect(-25, -25, 50, 50, 8);

    const numberText = this.add.text(0, 0, value.toString(), {
      fontSize: "24px",
      fill: "#2E7D32",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [numberBg, numberText]);
    this.sequenceContainers.push(container);
  }

  createAvailableOptions() {
    const { availableOptions, missingNumber } = this.levelData;
    const startX = 250;
    const startY = 350;
    const spacing = 100;

    this.optionContainers = [];

    availableOptions.forEach((number, index) => {
      const x = startX + (index * spacing);
      const isCorrect = number === missingNumber;

      const option = this.createDraggableOption(x, startY, number, isCorrect);
      this.optionContainers.push(option);
    });
  }

  createDraggableOption(x, y, number, isCorrect) {
    // Crear fondo de la opción
    const optionBg = this.add.graphics();
    optionBg.fillStyle(0x2196F3, 0.8);
    optionBg.lineStyle(2, 0x1976D2);
    optionBg.fillRoundedRect(-25, -25, 50, 50, 8);
    optionBg.strokeRoundedRect(-25, -25, 50, 50, 8);

    // Texto del número
    const optionText = this.add.text(0, 0, number.toString(), {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    // Container draggable
    const container = this.add.container(x, y, [optionBg, optionText]);
    container.setSize(50, 50);
    container.setInteractive();
    this.input.setDraggable(container);

    // Guardar datos
    container.number = number;
    container.isCorrect = isCorrect;
    container.initialX = x;
    container.initialY = y;

    // Eventos de drag
    container.on("dragstart", () => {
      container.setScale(1.1);
      optionBg.clear();
      optionBg.fillStyle(0x1976D2, 0.9);
      optionBg.strokeRoundedRect(-25, -25, 50, 50, 8);
    });

    container.on("drag", (pointer, dragX, dragY) => {
      container.x = dragX;
      container.y = dragY;
    });

    container.on("dragend", () => {
      this.handleDropAttempt(container);
    });

    return container;
  }

  handleDropAttempt(draggedContainer) {
    this.attempts++;
    this.registry.set("levelAttempts", this.attempts);

    // Verificar si está cerca del área objetivo
    const distance = Phaser.Math.Distance.Between(
      draggedContainer.x, draggedContainer.y,
      this.targetArea.graphics.x, this.targetArea.graphics.y
    );

    if (distance < 50) {
      // Está cerca del área objetivo
      if (draggedContainer.isCorrect) {
        this.handleCorrectAnswer(draggedContainer);
      } else {
        this.handleWrongAnswer(draggedContainer);
      }
    } else {
      // No está cerca, regresar a posición inicial
      this.returnToInitialPosition(draggedContainer);
    }
  }

  handleCorrectAnswer(container) {
    // Sonido de éxito
    this.sound.play("correct", { volume: 0.5 });

    // Animación de éxito
    container.x = this.targetArea.graphics.x;
    container.y = this.targetArea.graphics.y;
    container.setScale(1);

    // Ocultar área objetivo
    this.targetArea.graphics.setVisible(false);
    this.targetArea.text.setVisible(false);

    // Marcar como completado
    this.levelCompleted = true;

    // Calcular tiempo
    const completionTime = (this.time.now - this.startTime) / 1000;
    this.registry.set("levelTime", completionTime);

    // Mostrar congratulaciones
    this.time.delayedCall(500, () => {
      this.scene.launch("CongratulationsScene");
    });
  }

  handleWrongAnswer(container) {
    // Sonido de error
    this.sound.play("error", { volume: 0.3 });

    // Animación de error
    this.tweens.add({
      targets: container,
      x: container.x + 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.returnToInitialPosition(container);
      }
    });
  }

  returnToInitialPosition(container) {
    this.tweens.add({
      targets: container,
      x: container.initialX,
      y: container.initialY,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut"
    });
  }

  createTutorialDialog() {
    this.dialogBox = new DialogBox(this);
    this.cuyDialog = this.dialogBox.createWithCuy(
      150, 450,
      "¡Arrastra el número correcto\npara completar la secuencia!",
      {},
      () => {
        this.cuyDialog.setVisible(false);
      }
    );
  }

  createUI() {
    // Timer
    this.timeText = this.add.text(700, 30, "Tiempo: 0s", {
      fontSize: "16px",
      fill: "#333",
      fontFamily: "Fredoka"
    });

    // Intentos
    this.attemptsText = this.add.text(700, 55, "Intentos: 0", {
      fontSize: "16px",
      fill: "#333",
      fontFamily: "Fredoka"
    });
  }

  update() {
    if (!this.levelCompleted && this.startTime) {
      const currentTime = (this.time.now - this.startTime) / 1000;
      this.timeText.setText(`Tiempo: ${Math.floor(currentTime)}s`);
      this.attemptsText.setText(`Intentos: ${this.attempts}`);
    }
  }
}
