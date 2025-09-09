import Phaser from "phaser";

import { SCENE_HEIGHT, SCENE_WIDTH } from "@/modules/constanst";

export class PreferenceSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreferenceSelectionScene", active: false });
  }

  preload() {
    // Aquí puedes cargar imágenes o assets si es necesario
    this.load.image("bana", "./assets/sprites/bana.png");
    this.load.audio("sape", "./assets/sounds/sape.mp3");
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

    // Pregunta principal - arriba de los botones
    this.add.text(SCENE_WIDTH / 2, 80, "¿Te gustan?", {
      fontSize: "48px",
      fill: "#ffffff",
      strokeThickness: 4,
      stroke: "#000000",
      fontFamily: "Fredoka",
    }).setOrigin(0.5);

    // Botón "Menores"
    const menoresButton = this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 - 20,
      300,
      60,
      0x27AE60
    );
    menoresButton.setInteractive();

    this.add.text(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 - 20,
      "Menores",
      {
        fontSize: "28px",
        fill: "#ffffff",
        strokeThickness: 3,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }
    ).setOrigin(0.5);

    // Botón "Mayores"
    const mayoresButton = this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 + 60,
      300,
      60,
      0xE74C3C
    );
    mayoresButton.setInteractive();

    this.add.text(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 + 60,
      "Mayores",
      {
        fontSize: "28px",
        fill: "#ffffff",
        strokeThickness: 3,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }
    ).setOrigin(0.5);

    // Botón "Es una pregunta muy personal"
    const personalButton = this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 + 140,
      400,
      60,
      0xF39C12
    );
    personalButton.setInteractive();

    this.add.text(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2 + 140,
      "Es una pregunta muy personal",
      {
        fontSize: "24px",
        fill: "#ffffff",
        strokeThickness: 3,
        stroke: "#000000",
        fontFamily: "Fredoka",
      }
    ).setOrigin(0.5);

    // Eventos del botón "Menores"
    menoresButton.on("pointerdown", () => {
      this.selectPreference("menores");
    });

    menoresButton.on("pointerover", () => {
      menoresButton.setFillStyle(0x2ECC71);
    });

    menoresButton.on("pointerout", () => {
      menoresButton.setFillStyle(0x27AE60);
    });

    // Eventos del botón "Mayores"
    mayoresButton.on("pointerdown", () => {
      this.selectPreference("mayores");
    });

    mayoresButton.on("pointerover", () => {
      mayoresButton.setFillStyle(0xC0392B);
    });

    mayoresButton.on("pointerout", () => {
      mayoresButton.setFillStyle(0xE74C3C);
    });

    // Eventos del botón "Personal"
    personalButton.on("pointerdown", () => {
      this.selectPreference("personal");
      this.add.image(SCENE_WIDTH / 2, SCENE_HEIGHT / 2, "bana").setScale();
      this.add.text(
        SCENE_WIDTH / 2,
        SCENE_HEIGHT / 2,
        "Estas Como Loquita !",
        {
          fontSize: "64px",
          fill: "#ffffff",
          strokeThickness: 6,
          stroke: "#000000",
          fontFamily: "Fredoka",
          fontStyle: "bold",
        }
      ).setOrigin(0.5);

      this.sound.play("sape");
      this.time.delayedCall(2000, () => {
        this.scene.start("CompleteSequenceScene");
      });
    });

    personalButton.on("pointerover", () => {
      personalButton.setFillStyle(0xE67E22);
    });

    personalButton.on("pointerout", () => {
      personalButton.setFillStyle(0xF39C12);
    });
  }

  selectPreference(preference) {
    console.log(`Preferencia seleccionada: ${preference}`);

    // Ir a la siguiente escena pasando la preferencia seleccionada
    // this.scene.start("NextSceneName", { selectedPreference: preference });
  }
}
