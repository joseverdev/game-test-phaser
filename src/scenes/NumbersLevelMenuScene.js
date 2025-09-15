import Phaser from "phaser";
import { LevelMenuScene } from "./LevelMenuScene";

/**
 * Numbers Level Menu Scene - Uses the reusable LevelMenuScene
 * Configured specifically for the "Aprende los Números" section
 */
export class NumbersLevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "NumbersLevelMenuScene", active: false });
  }

  create() {
    // Launch the reusable level menu with numbers configuration
    this.scene.launch("LevelMenuScene", {
      title: "Aprende los Números",
      minigameType: "sequence",
      targetScene: "SequenceGameScene",
      totalLevels: 25,
      cuyMessage: "¡Elige un nivel para jugar! Los niveles bloqueados se desbloquean completando los anteriores.",
      backTargetScene: "MathMenuScene",
      // showCuyGuide will be automatically determined by shouldShowCuyGuide method
    });

    // Stop this scene since we're using the reusable one
    this.scene.stop("NumbersLevelMenuScene");
  }
}