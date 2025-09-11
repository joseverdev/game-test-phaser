export const SEQUENCE_LEVELS = {
  // === NIVELES BÁSICOS (1-5) ===
  1: {
    id: "seq_001",
    sequence: [1, 2, "?", 4, 5],
    missingNumber: 3,
    availableOptions: [1, 2, 3],
    targetPosition: 2,
    difficulty: "easy",
    category: "sequential",
    title: "Números del 1 al 5",
    description: "Completa la secuencia básica",
    hints: ["Los números van uno tras otro", "¿Qué número va entre 2 y 4?"],
    backgroundColor: 0x4CAF50,
    requiredStars: 0,
    maxTime: 60, // segundos
    points: 100
  },

  2: {
    id: "seq_002",
    sequence: [3, 4, 5, "?", 7],
    missingNumber: 6,
    availableOptions: [5, 6, 7],
    targetPosition: 3,
    difficulty: "easy",
    category: "sequential",
    title: "Continuando secuencias",
    description: "Sigue el patrón numérico",
    hints: ["Cada número es uno más que el anterior"],
    backgroundColor: 0x4CAF50,
    requiredStars: 1,
    maxTime: 55,
    points: 110
  },

  // === NÚMEROS PARES (6-10) ===
  6: {
    id: "seq_006",
    sequence: [2, 4, "?", 8, 10],
    missingNumber: 6,
    availableOptions: [5, 6, 7],
    targetPosition: 2,
    difficulty: "easy",
    category: "even_numbers",
    title: "Números pares",
    description: "Completa la secuencia de números pares",
    hints: ["Solo números que se pueden dividir entre 2", "2, 4, ?, 8, 10"],
    backgroundColor: 0x2196F3,
    requiredStars: 5,
    maxTime: 50,
    points: 120
  },

  // === NÚMEROS IMPARES (11-15) ===
  11: {
    id: "seq_011",
    sequence: [1, 3, 5, "?", 9],
    missingNumber: 7,
    availableOptions: [6, 7, 8],
    targetPosition: 3,
    difficulty: "medium",
    category: "odd_numbers",
    title: "Números impares",
    description: "Secuencia de números impares",
    hints: ["Números que no se dividen entre 2", "Van de 2 en 2"],
    backgroundColor: 0xFF9800,
    requiredStars: 10,
    maxTime: 45,
    points: 150
  },

  // === MÚLTIPLOS (16-20) ===
  16: {
    id: "seq_016",
    sequence: [5, 10, 15, "?", 25],
    missingNumber: 20,
    availableOptions: [18, 20, 22],
    targetPosition: 3,
    difficulty: "medium",
    category: "multiples",
    title: "Múltiplos de 5",
    description: "Cuenta de 5 en 5",
    hints: ["Todos terminan en 0 o 5", "5, 10, 15, ?, 25"],
    backgroundColor: 0x9C27B0,
    requiredStars: 15,
    maxTime: 40,
    points: 180
  },

  // === NIVELES AVANZADOS (21-25) ===
  21: {
    id: "seq_021",
    sequence: [100, 90, 80, "?", 60],
    missingNumber: 70,
    availableOptions: [65, 70, 75],
    targetPosition: 3,
    difficulty: "hard",
    category: "decreasing",
    title: "Secuencia descendente",
    description: "Los números van hacia atrás",
    hints: ["Cada número es 10 menos", "100, 90, 80, ?, 60"],
    backgroundColor: 0xE91E63,
    requiredStars: 20,
    maxTime: 35,
    points: 220
  }
};

// Configuración del minijuego
export const SEQUENCE_MINIGAME_CONFIG = {
  id: "sequence",
  name: "Completar Secuencias",
  description: "Encuentra el número que falta en la secuencia",
  icon: "sequence_icon.png",
  thumbnail: "sequence_thumb.png",
  totalLevels: Object.keys(SEQUENCE_LEVELS).length,
  unlockRequirement: 0, // Siempre desbloqueado
  categories: [
    { id: "sequential", name: "Números seguidos", levels: [1, 2, 3, 4, 5] },
    { id: "even_numbers", name: "Números pares", levels: [6, 7, 8, 9, 10] },
    { id: "odd_numbers", name: "Números impares", levels: [11, 12, 13, 14, 15] },
    { id: "multiples", name: "Múltiplos", levels: [16, 17, 18, 19, 20] },
    { id: "decreasing", name: "Descendentes", levels: [21, 22, 23, 24, 25] }
  ],
  rewards: {
    completion: 1000,
    perfectScore: 500,
    speedBonus: 200
  }
};
