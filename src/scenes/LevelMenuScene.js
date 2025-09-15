import Phaser from "phaser";

import { NavigationUI } from "@/shared/components/NavigationUI";
import { OverlayBox } from "@/shared/components/OverlayBox";
import { CuyGuide } from "@/shared/components/CuyGuide";
import { AudioManager } from "@/managers/AudioManager";
import { MinigameManager } from "@/managers/MinigameManager";
import { ScenePersistenceManager } from "@/managers/ScenePersistenceManager";
import { AssetManager } from "@/managers/AssetManager";

/**
 * Reusable Level Selection Menu Scene
 * Can be configured for different game sections
 */
export class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelMenuScene", active: false });
  }

  /**
   * Check if CuyGuide should be shown for this minigame type
   * @param {string} minigameType - The type of minigame
   * @returns {boolean} - True if it's the first visit
   */
  shouldShowCuyGuide(minigameType) {
    const storageKey = `cuyguide_${minigameType}_visited`;
    const hasVisited = localStorage.getItem(storageKey) === "true";

    if (!hasVisited) {
      // Mark as visited for future visits
      localStorage.setItem(storageKey, "true");
      return true; // Show CuyGuide on first visit
    }

    return false; // Don't show on subsequent visits
  }

  /**
   * Reset CuyGuide tracking for a specific minigame type (for testing)
   * @param {string} minigameType - The type of minigame to reset
   */
  static resetCuyGuideTracking(minigameType) {
    const storageKey = `cuyguide_${minigameType}_visited`;
    localStorage.removeItem(storageKey);
  }

  /**
   * Reset all CuyGuide tracking (for testing)
   */
  static resetAllCuyGuideTracking() {
    // Get all localStorage keys that start with 'cuyguide_'
    const keys = Object.keys(localStorage).filter(key => key.startsWith("cuyguide_"));
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Initialize the scene with configuration
   * @param {Object} config - Configuration object
   * @param {string} config.title - Menu title
   * @param {string} config.minigameType - Type for MinigameManager
   * @param {string} config.targetScene - Scene to navigate to when level is selected
   * @param {number} config.totalLevels - Total number of levels
   * @param {string} config.cuyMessage - Message for CuyGuide
   * @param {string} config.backTargetScene - Scene to go back to
   * @param {boolean} config.showCuyGuide - Whether to show CuyGuide (default: true for first visit)
   */
  init(config) {
    this.config = {
      title: "Selecciona Nivel",
      minigameType: "sequence",
      targetScene: "SequenceGameScene",
      totalLevels: 25,
      cuyMessage: "¡Elige un nivel para jugar!",
      backTargetScene: "MathMenuScene",
      showCuyGuide: this.shouldShowCuyGuide(config.minigameType),
      ...config
    };
  }

  preload() {
    // Use AssetManager for safe loading to prevent conflicts on scene restoration
    AssetManager.loadImageSafe(this, "bgMath", "./assets/bg/bg-math.jpg");
    AssetManager.loadImageSafe(this, "avatar", "./assets/avatar/gato.png");
    AssetManager.loadImageSafe(this, "flame", "./assets/objects/flame-64.png");
    // Using trophy as star alternative
    AssetManager.loadImageSafe(this, "trophy", "./assets/objects/trophy.svg");

    // Load background music
    const audioManager = AudioManager.getInstance();
    audioManager.loadAudio(this);
  }

  create() {
    // Background
    this.add.image(400, 300, "bgMath");

    // Initialize managers
    this.minigameManager = MinigameManager.getInstance(this.config.minigameType);
    this.audioManager = AudioManager.getInstance();
    this.audioManager.initMusic(this);

    // Navigation UI
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
        this.scene.stop("LevelMenuScene");
        this.scene.start(this.config.backTargetScene);
      }
    });

    // Overlay
    this.overlay = new OverlayBox(this);

    // Title
    this.add.text(400, 80, this.config.title, {
      fontSize: "32px",
      fill: "#ffffff",
      fontFamily: "Fredoka",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Create level grid
    this.createLevelGrid();

    // Cuy Guide - Only show on first visit
    if (this.config.showCuyGuide) {
      this.cuyGuide = new CuyGuide(this, 530, 390, {
        dialogPosition: "left",
        dialogConfig: {
          width: 280,
          height: 120,
          textStyle: {
            fontSize: "16px",
            fill: "#333333",
            fontFamily: "Fredoka"
          }
        }
      });

      this.cuyGuide.showDialog(this.config.cuyMessage, 5000);
    }
  }

  createLevelGrid() {
    const levelsPerRow = 5;
    const levelSpacing = 80;
    const startX = 400 - ((levelsPerRow - 1) * levelSpacing) / 2;
    const startY = 150;

    const totalLevels = Math.min(this.config.totalLevels, 25); // Max 25 levels in 5x5 grid

    for (let level = 1; level <= totalLevels; level++) {
      const row = Math.floor((level - 1) / levelsPerRow);
      const col = (level - 1) % levelsPerRow;

      const x = startX + (col * levelSpacing);
      const y = startY + (row * levelSpacing);

      this.createLevelButton(level, x, y);
    }
  }

  createLevelButton(levelNumber, x, y) {
    const isUnlocked = this.minigameManager.isLevelUnlocked(levelNumber);
    const levelProgress = this.minigameManager.getLevelProgress(levelNumber);

    // Button background
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(isUnlocked ? 0x4CAF50 : 0x666666, 0.9);
    buttonBg.fillRoundedRect(-25, -25, 50, 50, 10);
    buttonBg.lineStyle(3, isUnlocked ? 0x2E7D32 : 0x333333, 1);
    buttonBg.strokeRoundedRect(-25, -25, 50, 50, 10);

    // Level number text
    const levelText = this.add.text(0, 0, levelNumber.toString(), {
      fontSize: "20px",
      fill: isUnlocked ? "#ffffff" : "#cccccc",
      fontFamily: "Fredoka",
      fontWeight: "bold"
    }).setOrigin(0.5);

    // Lock icon for locked levels
    let lockIcon;
    if (!isUnlocked) {
      lockIcon = this.add.image(0, 0, "flame").setScale(0.4);
    }

    // Stars for completed levels
    const stars = [];
    // if (levelProgress.completed && levelProgress.stars > 0) {
    //   for (let i = 0; i < levelProgress.stars; i++) {
    //     const star = this.add.image(-15 + (i * 10), -35, "trophy").setScale(0.2);
    //     stars.push(star);
    //   }
    // }

    // Container for all elements
    const container = this.add.container(x, y, [buttonBg, levelText, ...(lockIcon ? [lockIcon] : []), ...stars]);
    container.setSize(50, 50);

    if (isUnlocked) {
      container.setInteractive();
      container.on("pointerover", () => {
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 150,
          ease: "Power2"
        });
      });

      container.on("pointerout", () => {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: "Power2"
        });
      });

      container.on("pointerdown", () => {
        this.startLevel(levelNumber);
      });

      // Animation for unlocked levels
      container.setScale(0);
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: levelNumber * 50,
        ease: "Back.easeOut"
      });
    } else {
      // Gray out locked levels
      buttonBg.setAlpha(0.5);
      levelText.setAlpha(0.5);
    }
  }

  startLevel(levelNumber) {
    // Set the current level in the manager
    this.minigameManager.setCurrentLevel(levelNumber);

    // Save current scene before navigating to game
    ScenePersistenceManager.saveCurrentScene(this.config.targetScene, { level: levelNumber });

    // Start the target scene with level data
    this.scene.stop("LevelMenuScene");
    this.scene.start(this.config.targetScene, { level: levelNumber });
  }
}