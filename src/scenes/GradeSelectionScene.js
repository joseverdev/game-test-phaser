import Phaser from "phaser";

import { SCENE_HEIGHT, SCENE_WIDTH } from "@/modules/constanst";

export class GradeSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: "GradeSelectionScene", active: false });
  }

  create() {
    // Fondo
    this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2,
      SCENE_WIDTH,
      SCENE_HEIGHT,
      0x000000
    ).setAlpha(0.5);

    // Pregunta principal
    this.add.text(SCENE_WIDTH / 2, 150, "¿Qué grado eres?", {
      fontSize: "48px",
      fill: "#ffffff",
      strokeThickness: 4,
      stroke: "#000000",
      fontFamily: "Fredoka",
    }).setOrigin(0.5);

    // Botón "Primero"
    const firstGradeButton = this.add.rectangle(
      SCENE_WIDTH / 2 - 150,
      SCENE_HEIGHT / 2 + 50,
      200,
      80,
      0x27AE60
    );
    firstGradeButton.setInteractive();

    this.add.text(
      SCENE_WIDTH / 2 - 150,
      SCENE_HEIGHT / 2 + 50,
      "Primero",
      {
        fontSize: "32px",
        fill: "#ffffff",
        strokeThickness: 3,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }
    ).setOrigin(0.5);

    // Botón "Segundo"
    const secondGradeButton = this.add.rectangle(
      SCENE_WIDTH / 2 + 150,
      SCENE_HEIGHT / 2 + 50,
      200,
      80,
      0xE74C3C
    );
    secondGradeButton.setInteractive();

    this.add.text(
      SCENE_WIDTH / 2 + 150,
      SCENE_HEIGHT / 2 + 50,
      "Segundo",
      {
        fontSize: "32px",
        fill: "#ffffff",
        strokeThickness: 3,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }
    ).setOrigin(0.5);

    // Eventos de los botones
    firstGradeButton.on("pointerdown", () => {
      this.selectGrade("primero");
    });

    firstGradeButton.on("pointerover", () => {
      firstGradeButton.setFillStyle(0x2ECC71);
    });

    firstGradeButton.on("pointerout", () => {
      firstGradeButton.setFillStyle(0x27AE60);
    });

    secondGradeButton.on("pointerdown", () => {
      this.selectGrade("segundo");
    });

    secondGradeButton.on("pointerover", () => {
      secondGradeButton.setFillStyle(0xC0392B);
    });

    secondGradeButton.on("pointerout", () => {
      secondGradeButton.setFillStyle(0xE74C3C);
    });
  }

  selectGrade(grade) {
    console.log(`Grado seleccionado: ${grade}`);

    // Ir a CompleteSequenceScene pasando el grado seleccionado
    this.scene.start("PreferenceSelectionScene", { selectedGrade: grade });
  }
}
