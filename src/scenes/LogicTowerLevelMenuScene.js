import Phaser from "phaser";
import { LevelMenuScene } from "./LevelMenuScene";

/**
 * Logic Tower Level Menu Scene - Uses the reusable LevelMenuScene
 * Configured specifically for the "Torre de Logica" section
 */
export class LogicTowerLevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "LogicTowerLevelMenuScene", active: false });
  }

  create() {
    // Launch the reusable level menu with logic tower configuration
    this.scene.launch("LevelMenuScene", {
      title: "Torre de Lógica",
      minigameType: "logic",
      targetScene: "LogicTowerScene",
      totalLevels: 30,
      cuyMessage: "¡Desafía tu mente con puzzles lógicos! Cada nivel es más desafiante que el anterior.",
      backTargetScene: "MainMenuScene"
    });

    // Stop this scene since we're using the reusable one
    this.scene.stop("LogicTowerLevelMenuScene");
  }
}