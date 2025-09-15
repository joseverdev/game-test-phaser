/**
 * Asset Manager
 * Handles safe loading of assets to prevent conflicts during scene restoration
 */
export class AssetManager {
  /**
   * Safely load an image asset, checking if it already exists
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {string} key - The texture key
   * @param {string} path - The asset path
   */
  static loadImageSafe(scene, key, path) {
    // Check if texture already exists
    if (scene.textures.exists(key)) {
      console.log(`Texture "${key}" already exists, skipping load`);
      return;
    }

    try {
      scene.load.image(key, path);
      console.log(`Loading texture: ${key}`);
    } catch (error) {
      console.warn(`Failed to load texture "${key}":`, error);
    }
  }

  /**
   * Safely load an audio asset, checking if it already exists
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {string} key - The audio key
   * @param {string} path - The asset path
   */
  static loadAudioSafe(scene, key, path) {
    // Check if audio already exists in cache
    if (scene.cache.audio && scene.cache.audio.exists && scene.cache.audio.exists(key)) {
      console.log(`Audio "${key}" already exists, skipping load`);
      return;
    }

    try {
      scene.load.audio(key, path);
      console.log(`Loading audio: ${key}`);
    } catch (error) {
      console.warn(`Failed to load audio "${key}":`, error);
    }
  }

  /**
   * Preload common assets that might be shared across scenes
   * @param {Phaser.Scene} scene - The Phaser scene
   */
  static preloadCommonAssets(scene) {
    // Common UI assets
    this.loadImageSafe(scene, "bgMath", "./assets/bg/bg-math.jpg");
    this.loadImageSafe(scene, "avatar", "./assets/avatar/gato.png");
    this.loadImageSafe(scene, "flame", "./assets/objects/flame-64.png");
    this.loadImageSafe(scene, "trophy", "./assets/objects/trophy.svg");

    // Background music (only load if not already loaded)
    if (!scene.cache.audio || !scene.cache.audio.exists || !scene.cache.audio.exists("bgMusic")) {
      scene.load.audio("bgMusic", "./assets/sounds/bg.wav");
    }
  }

  /**
   * Check if all required textures are loaded
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {string[]} textureKeys - Array of texture keys to check
   * @returns {boolean} - True if all textures are loaded
   */
  static areTexturesLoaded(scene, textureKeys) {
    return textureKeys.every(key => scene.textures.exists(key));
  }

  /**
   * Wait for textures to be loaded
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {string[]} textureKeys - Array of texture keys to wait for
   * @returns {Promise} - Promise that resolves when all textures are loaded
   */
  static waitForTextures(scene, textureKeys) {
    return new Promise((resolve) => {
      const checkTextures = () => {
        if (this.areTexturesLoaded(scene, textureKeys)) {
          resolve();
        } else {
          // Check again on next frame
          scene.time.delayedCall(16, checkTextures);
        }
      };
      checkTextures();
    });
  }
}