import Phaser from "phaser";

import { SCENE_HEIGHT, SCENE_WIDTH } from "@/modules/constanst";

export class CongratulationsScene extends Phaser.Scene {
  constructor() {
    super({ key: "CongratulationsScene" });
  }

  preload() {
    this.load.image("trophy", "./assets/objects/trophy.svg");
    this.load.image("pennants", "./assets/objects/pennants.svg");
  }

  create() {
    this.add.rectangle(
      SCENE_WIDTH / 2,
      SCENE_HEIGHT / 2,
      SCENE_WIDTH,
      SCENE_HEIGHT,
      0x000000,
      0.5 // Opacidad (0 = transparente, 1 = opaco)
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
  }
}
