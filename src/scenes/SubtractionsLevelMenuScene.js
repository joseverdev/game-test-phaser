import Phaser from "phaser";
import { LevelMenuScene } from "./LevelMenuScene";

/**
 * Subtractions Level Menu Scene - Uses the reusable LevelMenuScene
 * Configured specifically for the "Aprende Restas" section
 */
export class SubtractionsLevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "SubtractionsLevelMenuScene", active: false });
  }

  create() {
    // Launch the reusable level menu with subtractions configuration
    this.scene.launch("LevelMenuScene", {
      title: "Aprende Restas",
      minigameType: "subtractions",
      targetScene: "SubtractionsGameScene",
      totalLevels: 20,
      cuyMessage: "¡Las restas están en camino! Sigue practicando con los números.",
      backTargetScene: "MathMenuScene"
    });

    // Stop this scene since we're using the reusable one
    this.scene.stop("SubtractionsLevelMenuScene");
  }
}