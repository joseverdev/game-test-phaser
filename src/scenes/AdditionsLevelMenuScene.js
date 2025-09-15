import Phaser from "phaser";
import { LevelMenuScene } from "./LevelMenuScene";

/**
 * Additions Level Menu Scene - Uses the reusable LevelMenuScene
 * Configured specifically for the "Aprende Sumas" section
 */
export class AdditionsLevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "AdditionsLevelMenuScene", active: false });
  }

  create() {
    // Launch the reusable level menu with additions configuration
    this.scene.launch("LevelMenuScene", {
      title: "Aprende Sumas",
      minigameType: "additions",
      targetScene: "AdditionsGameScene",
      totalLevels: 20,
      cuyMessage: "¡Las sumas llegarán pronto! Mientras tanto, practica con los números.",
      backTargetScene: "MathMenuScene"
    });

    // Stop this scene since we're using the reusable one
    this.scene.stop("AdditionsLevelMenuScene");
  }
}