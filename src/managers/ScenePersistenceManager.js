/**
 * Scene Persistence Manager
 * Handles saving and restoring the current scene across page reloads
 */
export class ScenePersistenceManager {
  static STORAGE_KEY = "game_current_scene";
  static SCENE_DATA_KEY = "game_scene_data";

  /**
   * Save the current scene key and optional data
   * @param {string} sceneKey - The scene key to save
   * @param {object} sceneData - Optional data to save with the scene
   */
  static saveCurrentScene(sceneKey, sceneData = null) {
    try {
      const sceneState = {
        sceneKey: sceneKey,
        timestamp: Date.now(),
        sceneData: sceneData
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sceneState));
      console.log(`Scene saved: ${sceneKey}`);
    } catch (error) {
      console.warn("Failed to save scene state:", error);
    }
  }

  /**
   * Get the saved scene state
   * @returns {object|null} - The saved scene state or null if none exists
   */
  static getSavedSceneState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const sceneState = JSON.parse(saved);

        // Optional: Check if the saved scene is too old (e.g., more than 24 hours)
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        if (Date.now() - sceneState.timestamp > MAX_AGE) {
          console.log("Saved scene state is too old, clearing...");
          this.clearSavedScene();
          return null;
        }

        return sceneState;
      }
    } catch (error) {
      console.warn("Failed to load scene state:", error);
      this.clearSavedScene(); // Clear corrupted data
    }
    return null;
  }

  /**
   * Clear the saved scene state
   */
  static clearSavedScene() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("Saved scene state cleared");
    } catch (error) {
      console.warn("Failed to clear scene state:", error);
    }
  }

  /**
   * Check if a saved scene exists
   * @returns {boolean} - True if a scene is saved
   */
  static hasSavedScene() {
    return this.getSavedSceneState() !== null;
  }

  /**
   * Get the saved scene key
   * @returns {string|null} - The saved scene key or null
   */
  static getSavedSceneKey() {
    const state = this.getSavedSceneState();
    return state ? state.sceneKey : null;
  }

  /**
   * Get the saved scene data
   * @returns {object|null} - The saved scene data or null
   */
  static getSavedSceneData() {
    const state = this.getSavedSceneState();
    return state ? state.sceneData : null;
  }

  /**
   * Validate if a scene key exists in the registered scenes
   * @param {string} sceneKey - The scene key to validate
   * @param {Array} registeredScenes - Array of registered scene keys
   * @returns {boolean} - True if the scene is valid
   */
  static isValidScene(sceneKey, registeredScenes = []) {
    // Always allow MainMenuScene as fallback
    if (sceneKey === "MainMenuScene") return true;

    // Check if the scene exists in registered scenes
    return registeredScenes.includes(sceneKey);
  }

  /**
   * Setup automatic scene tracking for a Phaser game instance
   * @param {Phaser.Game} game - The Phaser game instance
   */
  static setupAutoTracking(game) {
    // Track scene starts
    game.events.on("scene.start", (scene) => {
      // Only save non-menu scenes to avoid saving intermediate navigation
      const persistentScenes = [
        "SequenceGameScene",
        "LevelMenuScene",
        "NumbersLevelMenuScene",
        "AdditionsLevelMenuScene",
        "SubtractionsLevelMenuScene",
        "LogicTowerLevelMenuScene",
        "EnglishWorldLevelMenuScene"
      ];

      if (persistentScenes.includes(scene.scene.key)) {
        this.saveCurrentScene(scene.scene.key);
      }
    });

    // Track scene stops (for cleanup if needed)
    game.events.on("scene.stop", (scene) => {
      // Optional: Handle scene stop logic if needed
    });

    console.log("Scene persistence auto-tracking enabled");
  }
}