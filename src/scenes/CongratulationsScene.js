import Phaser from "phaser";

import { SCENE_HEIGHT, SCENE_WIDTH } from "@/modules/constanst";
import { NavigationUI } from "@/shared/components/NavigationUI";

export class CongratulationsScene extends Phaser.Scene {
  constructor() {
    super({ key: "CongratulationsScene" });
  }

  init(data) {
    // Recibir datos del nivel completado
    this.levelResult = data || {};
    console.log("CongratulationsScene received data:", this.levelResult);
  }

  preload() {
    this.load.image("trophy", "./assets/objects/trophy.svg");
    this.load.image("pennants", "./assets/objects/pennants.svg");
    this.load.audio("celebration", "./assets/sounds/children-celebration.wav");
    this.load.image("bgMath", "./assets/bg/bg-math.jpg");
  }

  create() {

    this.navigationUI = new NavigationUI(this, {

      showBackButton: true,
      showUserInfo: true,
      showStreakInfo: true,
      userInfo: {
        name: "Jose",
        avatar: "avatar"
      },
      streakInfo: {
        count: 7,
        icon: "flame"
      },
      onBackClick: () => {
        console.log("Salir del juego");
        // Aquí puedes agregar lógica para salir o ir a otra escena
        this.scene.stop("CongratulationsScene");
        this.scene.start("MathMenuScene");
      }
    });

    
    this.add.image(400, 300, "bgMath").setDisplaySize(800, 600);

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

    // Título de felicitación
    this.add.text(SCENE_WIDTH / 2, 300, "¡Eres un genio!", {
      fontSize: "44px",
      fill: "#ffffff",
      strokeThickness: 4,
      stroke: "#000000",
      fontFamily: "Fredoka",
    }).setOrigin(0.5);

    // Mostrar estadísticas del nivel si están disponibles
    if (this.levelResult.time || this.levelResult.attempts) {
      const timeText = this.levelResult.time ? `Tiempo: ${Math.floor(this.levelResult.time)}s` : "";
      const attemptsText = this.levelResult.attempts ? `Intentos: ${this.levelResult.attempts}` : "";

      this.add.text(SCENE_WIDTH / 2, 350, `${timeText} ${attemptsText}`, {
        fontSize: "24px",
        fill: "#ffff00",
        strokeThickness: 2,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }).setOrigin(0.5);
    }

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

    // Funcionalidad para siguiente nivel
    buttonContainer.on("pointerdown", () => {
      console.log("Next level button clicked");

      // Por ahora, simplemente regresar al menú principal
      // En el futuro, esto podría navegar al siguiente nivel
      this.scene.stop("CongratulationsScene");
      this.scene.start("MathMenuScene");

      // TODO: Implementar navegación a siguiente nivel cuando esté disponible
      // const nextLevel = this.levelResult.nextLevel || 1;
      // this.scene.start("SequenceGameScene", { level: nextLevel });
    });
  }
}
