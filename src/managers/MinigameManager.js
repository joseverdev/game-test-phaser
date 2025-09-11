import { SEQUENCE_LEVELS, SEQUENCE_MINIGAME_CONFIG } from "../minigames/sequence/levels/sequenceLevels.js";

export class MinigameManager {
  constructor(minigameType) {
    this.minigameType = minigameType;
    this.currentLevel = 1;
    this.levelData = this.getLevelData();
    this.config = this.getConfig();
    this.progress = this.loadProgress();
  }

  // === GESTIÓN DE DATOS ===
  getLevelData() {
    switch (this.minigameType) {
      case "sequence": {
        return SEQUENCE_LEVELS;
      }
      // case "matching":
      //   return MATCHING_LEVELS;
      default: {
        throw new Error(`Unknown minigame type: ${this.minigameType}`);
      }
    }
  }

  getConfig() {
    switch (this.minigameType) {
      case "sequence": {
        return SEQUENCE_MINIGAME_CONFIG;
      }
      default: {
        throw new Error(`Unknown minigame type: ${this.minigameType}`);
      }
    }
  }

  // === GESTIÓN DE NIVEL ACTUAL ===
  getCurrentLevelData() {
    return this.levelData[this.currentLevel];
  }

  setCurrentLevel(levelNumber) {
    if (this.isLevelUnlocked(levelNumber)) {
      this.currentLevel = levelNumber;
      return true;
    }
    return false;
  }

  // === PROGRESIÓN ===
  completeCurrentLevel(performanceData = {}) {
    const levelData = this.getCurrentLevelData();

    // Calcular estrellas basadas en rendimiento
    const stars = this.calculateStars(performanceData, levelData);

    // Actualizar progreso
    this.progress.levels[this.currentLevel] = {
      completed: true,
      stars: Math.max(stars, this.progress.levels[this.currentLevel]?.stars || 0),
      bestTime: Math.min(performanceData.time || Infinity,
        this.progress.levels[this.currentLevel]?.bestTime || Infinity),
      attempts: (this.progress.levels[this.currentLevel]?.attempts || 0) + 1,
      completedAt: new Date().toISOString()
    };

    // Desbloquear siguiente nivel
    const nextLevel = this.currentLevel + 1;
    if (nextLevel <= this.config.totalLevels) {
      this.progress.unlockedLevels = [...new Set([...this.progress.unlockedLevels, nextLevel])];
    }

    // Calcular puntos totales
    this.progress.totalStars = Object.values(this.progress.levels)
      .reduce((sum, level) => sum + (level.stars || 0), 0);

    this.progress.totalPoints += (levelData.points * stars);

    this.saveProgress();
    return {
      hasNextLevel: this.hasNextLevel(),
      stars,
      totalStars: this.progress.totalStars,
      unlockedNextLevel: nextLevel <= this.config.totalLevels
    };
  }

  calculateStars(performanceData, levelData) {
    let stars = 1; // Mínimo por completar

    // Estrella por tiempo
    if (performanceData.time && performanceData.time <= levelData.maxTime * 0.7) {
      stars++;
    }

    // Estrella por primer intento
    if (performanceData.attempts === 1) {
      stars++;
    }

    return Math.min(stars, 3); // Máximo 3 estrellas
  }

  // === NAVEGACIÓN ===
  goToNextLevel() {
    if (this.hasNextLevel()) {
      this.currentLevel++;
      return this.currentLevel;
    }
    return false;
  }

  goToPreviousLevel() {
    if (this.currentLevel > 1) {
      this.currentLevel--;
      return this.currentLevel;
    }
    return false;
  }

  hasNextLevel() {
    return this.currentLevel < this.config.totalLevels;
  }

  // === DESBLOQUEADO Y VALIDACIÓN ===
  isLevelUnlocked(levelNumber) {
    return this.progress.unlockedLevels.includes(levelNumber);
  }

  getLevelProgress(levelNumber) {
    return this.progress.levels[levelNumber] || {
      completed: false,
      stars: 0,
      bestTime: null,
      attempts: 0
    };
  }

  getMinigameProgress() {
    const completedLevels = Object.keys(this.progress.levels).length;
    const completionPercentage = (completedLevels / this.config.totalLevels) * 100;

    return {
      completedLevels,
      totalLevels: this.config.totalLevels,
      completionPercentage: Math.round(completionPercentage),
      totalStars: this.progress.totalStars,
      maxStars: this.config.totalLevels * 3,
      totalPoints: this.progress.totalPoints,
      isCompleted: completedLevels === this.config.totalLevels
    };
  }

  // === PERSISTENCIA ===
  loadProgress() {
    const saved = localStorage.getItem(`${this.minigameType}_progress`);
    const defaultProgress = {
      unlockedLevels: [1],
      levels: {},
      totalStars: 0,
      totalPoints: 0,
      firstPlayedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString()
    };

    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  }

  saveProgress() {
    this.progress.lastPlayedAt = new Date().toISOString();
    localStorage.setItem(`${this.minigameType}_progress`, JSON.stringify(this.progress));
  }

  resetProgress() {
    localStorage.removeItem(`${this.minigameType}_progress`);
    this.progress = this.loadProgress();
  }
}
