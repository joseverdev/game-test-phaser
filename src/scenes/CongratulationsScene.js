import Phaser from "phaser";

import { SCENE_HEIGHT, SCENE_WIDTH } from "@/modules/constanst";

export class CongratulationsScene extends Phaser.Scene {
  constructor() {
    super({ key: "CongratulationsScene" });
  }

  preload() {
    this.load.image("trophy", "./assets/objects/trophy.svg");
    this.load.image("pennants", "./assets/objects/pennants.svg");
    this.load.audio("celebration", "./assets/sounds/children-celebration.wav");
  }

  create() {
    // Desactivar la escena CompleteSequenceScene
    this.scene.setVisible(false, "CompleteSequenceScene");
    this.scene.pause("CompleteSequenceScene");
    this.sound.play("celebration", { volume: 0.3 });
    // Rectángulo semitransparente de overlay
    this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2,
      SCENE_WIDTH,
      SCENE_HEIGHT,
      0x000000,
      0.4
    );

    this.add.image(SCENE_WIDTH / 2, (SCENE_HEIGHT / 2) - 50, "trophy").setScale(0.6);
    this.add.image(150, (SCENE_HEIGHT / 2) - 50, "pennants").setScale(0.5);
    this.add.image(SCENE_WIDTH - 150, (SCENE_HEIGHT / 2) - 50, "pennants").setScale(-0.5, 0.5);
    this.add.text(SCENE_WIDTH / 2, 300, "Eres un genio!", {
      fontSize: "44px",
      fill: "#ffffff",
      strokeThickness: 4,
      stroke: "#000000",
      fontFamily: "Fredoka",
    }).setOrigin(0.5);

    // Crear botón de flecha derecha para siguiente nivel
    const nextButton = this.add.graphics();
    nextButton.fillStyle(0x4CAF50); // Verde
    nextButton.lineStyle(3, 0x2E7D32); // Borde verde oscuro
    nextButton.fillRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);
    nextButton.strokeRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);

    // Dibujar flecha derecha dentro del botón (mejor diseño)
    const arrow = this.add.graphics();
    arrow.fillStyle(0xFFFFFF); // Blanco
    arrow.beginPath();
    // Dibujar flecha más clara y simétrica
    const centerX = SCENE_WIDTH - 70; // Centro del botón
    const centerY = SCENE_HEIGHT - 50; // Centro vertical del botón

    // Punta de la flecha (derecha)
    arrow.moveTo(centerX + 15, centerY);
    // Parte superior de la flecha
    arrow.lineTo(centerX, centerY - 12);
    arrow.lineTo(centerX + 5, centerY - 12);
    arrow.lineTo(centerX + 5, centerY - 6);
    // Base de la flecha (rectángulo central)
    arrow.lineTo(centerX - 15, centerY - 6);
    arrow.lineTo(centerX - 15, centerY + 6);
    // Parte inferior de la flecha
    arrow.lineTo(centerX + 5, centerY + 6);
    arrow.lineTo(centerX + 5, centerY + 12);
    arrow.lineTo(centerX, centerY + 12);
    // Cerrar en la punta
    arrow.lineTo(centerX + 15, centerY);
    arrow.closePath();
    arrow.fillPath();

    // Hacer el botón interactivo
    const buttonContainer = this.add.container(0, 0, [nextButton, arrow]);
    buttonContainer.setSize(100, 60);
    buttonContainer.setInteractive();

    // Efectos hover
    buttonContainer.on("pointerover", () => {
      nextButton.clear();
      nextButton.fillStyle(0x66BB6A, 0.9); // Verde más claro
      nextButton.lineStyle(3, 0x2E7D32);
      nextButton.fillRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);
      nextButton.strokeRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);
    });

    buttonContainer.on("pointerout", () => {
      nextButton.clear();
      nextButton.fillStyle(0x4CAF50, 0.9); // Verde original
      nextButton.lineStyle(3, 0x2E7D32);
      nextButton.fillRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);
      nextButton.strokeRoundedRect(SCENE_WIDTH - 120, SCENE_HEIGHT - 80, 100, 60, 10);
    });

    // TODO: Agregar funcionalidad para siguiente nivel
    buttonContainer.on("pointerdown", () => {
      // Obtener managers desde el registry
      const gameManager = this.registry.get("gameManager");
      const minigameManager = this.registry.get("currentMinigameManager");

      if (!minigameManager) {
        console.error("No minigame manager found");
        return;
      }

      // Completar nivel actual y obtener información
      const completionResult = minigameManager.completeCurrentLevel({
        time: this.registry.get("levelTime") || 60,
        attempts: this.registry.get("levelAttempts") || 1
      });

      if (completionResult.hasNextLevel) {
        // Ir al siguiente nivel del mismo minijuego
        const nextLevel = minigameManager.goToNextLevel();

        // Regresar a la escena del minijuego con el nuevo nivel
        this.scene.stop("CongratulationsScene");
        this.scene.start("SequenceGameScene", {
          level: nextLevel,
          minigameManager,
          showLevelIntro: true
        });
      } else {
        // Minijuego completado - mostrar estadísticas y opciones
        this.scene.stop("CongratulationsScene");
        this.scene.start("MinigameCompletedScene", {
          minigameType: minigameManager.minigameType,
          progress: minigameManager.getMinigameProgress()
        });
      }
    });
  }
}
