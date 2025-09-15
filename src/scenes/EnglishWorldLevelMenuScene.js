import Phaser from "phaser";
import { LevelMenuScene } from "./LevelMenuScene";

/**
 * English World Level Menu Scene - Uses the reusable LevelMenuScene
 * Configured specifically for the "Mundo del Ingles" section
 */
export class EnglishWorldLevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "EnglishWorldLevelMenuScene", active: false });
  }

  create() {
    // Launch the reusable level menu with english world configuration
    this.scene.launch("LevelMenuScene", {
      title: "Mundo del Inglés",
      minigameType: "english",
      targetScene: "EnglishWorldScene",
      totalLevels: 25,
      cuyMessage: "¡Aprende inglés de manera divertida! Completa palabras, frases y conversaciones.",
      backTargetScene: "MainMenuScene"
    });

    // Stop this scene since we're using the reusable one
    this.scene.stop("EnglishWorldLevelMenuScene");
  }
}