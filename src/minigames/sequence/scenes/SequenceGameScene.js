import Phaser from "phaser";
import { AudioManager } from "../../../managers/AudioManager";

import { MinigameManager } from "../../../managers/MinigameManager.js";
import { OverlayBox } from "@/shared/components/OverlayBox.js";
import { NavigationUI } from "@/shared/components/NavigationUI.js";

export class SequenceGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "SequenceGameScene" });
  }

  init(data) {
    // Obtener instancia del manager (singleton)
    this.minigameManager = MinigameManager.getInstance("sequence");

    // Configurar el nivel
    this.targetLevel = data.level || 1;
    this.minigameManager.setCurrentLevel(this.targetLevel);

    // Obtener datos del nivel con validación
    try {
      this.levelData = this.minigameManager.getCurrentLevelData();
    } catch (error) {
      console.error("Error loading level data:", error);
      // Podrías mostrar una escena de error o volver al menú
      this.scene.start("MainMenuScene");
      return;
    }

    // Registrar en el game registry para acceso global
    this.registry.set("currentMinigameManager", this.minigameManager);
    this.registry.set("currentLevel", this.targetLevel);

    // Variables de rendimiento
    this.startTime = null;
    this.attempts = 0;
    this.levelCompleted = false;

    // Escuchar eventos del manager
    this.minigameManager.events.on("levelCompleted", this.handleLevelCompleted, this);
  }

  preload() {
    // Assets específicos del minijuego
    this.load.image("apple", "./assets/sprites/apple.svg");
    this.load.image("cuy", "./assets/sprites/cuy.png");
    this.load.audio("correct", "./assets/sounds/sape.mp3");
    this.load.audio("error", "./assets/sounds/error.wav");
    this.load.image("bgMath", "./assets/bg/bg-level.jpg");

    // Load background music
    const audioManager = AudioManager.getInstance();
    audioManager.loadAudio(this);
  }

  create() {
    
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
        console.log("Salir del juego");
        // Aquí puedes agregar lógica para salir o ir a otra escena
        this.scene.stop("MathMenuScene");
        this.scene.start("MainMenuScene");
      }
    });

    // Initialize background music
    const audioManager = AudioManager.getInstance();
    audioManager.initMusic(this);
    this.halfWidth = this.scale.width / 2;
    this.startTime = this.time.now;

    // Crear fondo con color del nivel
    this.createBackground();
    this.overlaySequence = new OverlayBox(this,{
      y: 120,
      height: 200
    });
    this.overlayOptions = new OverlayBox(this, {
      y: 320,
      width: 400,
      height: 150
    });
    // Mostrar información del nivel
    // this.createLevelHeader();

    // Crear la secuencia del nivel actual
    this.createSequence();

    // Crear opciones disponibles
    this.createAvailableOptions();

  
    // Crear UI (tiempo, intentos, etc.)
    this.createUI();
  }

  createBackground() {
    // Crear fondo con la imagen bgMath
    this.add.image(400, 300, "bgMath").setDisplaySize(800, 600);
  }

  createLevelHeader() {
    // Título del nivel
    this.add.text(400, 50, `Nivel ${this.targetLevel}: ${this.levelData.title}`, {
      fontSize: "24px",
      fill: "#333",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    // Descripción
    this.add.text(400, 80, this.levelData.description, {
      fontSize: "16px",
      fill: "#666",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);
  }

  createSequence() {
    const { sequence, targetPosition } = this.levelData;
    const startY = 120;
    const spacing = 40;
    const elementWidth = 60; // Ancho aumentado para mejor usabilidad

    // Calcular el ancho total de la secuencia
    const totalWidth = (sequence.length * elementWidth) + ((sequence.length - 1) * spacing);

    // Centrar horizontalmente en la escena
    const startX = this.halfWidth - (totalWidth / 2) + (elementWidth / 2);

    this.sequenceContainers = [];

    sequence.forEach((value, index) => {
      const x = startX + (index * (elementWidth + spacing));

      if (value === "?") {
        // Crear área objetivo
        this.createTargetArea(x, startY, index);
      } else {
        // Crear número de la secuencia
        this.createSequenceNumber(x, startY, value, index);
      }
    });
  }

  createTargetArea(x, y, index) {
    const targetArea = this.add.graphics();

    // Fondo blanco con opacidad de 0.1
    targetArea.fillStyle(0xFFFFFF, 0.2);
    targetArea.fillRoundedRect(-30, -30, 60, 60, 10);

    // Borde blanco
    targetArea.lineStyle(3, 0xffffff,0.8);
    targetArea.strokeRoundedRect(-30, -30, 60, 60, 10);
    targetArea.x = x;
    targetArea.y = y;

    // Agregar texto de interrogación
    const questionMark = this.add.text(x, y, "?", {
      fontSize: "36px",
      fill: "#fff",
      fontFamily: "Fredoka"
    }).setOrigin(0.5);

    // Configurar como zona de drop
    targetArea.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60),
      Phaser.Geom.Rectangle.Contains);

    // Guardar referencia
    this.targetArea = { graphics: targetArea, text: questionMark, index };
  }

  createSequenceNumber(x, y, value, index) {
    // Crear fondo con gradiente y sombra
    const numberBg = this.add.graphics();

    // Sombra sutil aumentada
    numberBg.fillStyle(0x000000, 0.1);
    numberBg.fillRoundedRect(-32, -32, 64, 64, 12);

    // Fondo principal vibrante aumentado
    numberBg.fillStyle(0x4CAF50, 0.9); // Verde medio vibrante
    numberBg.fillRoundedRect(-30, -30, 60, 60, 10);

    // Borde definido aumentado
    numberBg.lineStyle(3, 0x2E7D32, 1);
    numberBg.strokeRoundedRect(-30, -30, 60, 60, 10);

    // Resaltado superior para efecto 3D aumentado
    numberBg.fillStyle(0x81C784, 0.4);
    numberBg.fillRoundedRect(-28, -28, 56, 24, 8);

    // Texto con mejor estilo aumentado
    const numberText = this.add.text(0, 0, value.toString(), {
      fontSize: "36px",
      fill: "#E8F5E8",
      fontFamily: "Fredoka",
      fontWeight: "bold",
      stroke: "#1B5E20",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Efecto de brillo vibrante aumentado
    const glowEffect = this.add.graphics();
    glowEffect.fillStyle(0x4CAF50, 0.2);
    glowEffect.fillRoundedRect(-35, -35, 70, 70, 15);

    const container = this.add.container(x, y, [glowEffect, numberBg, numberText]);

    // Animación sutil de entrada
    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      delay: index * 100,
      ease: "Back.easeOut"
    });

    this.sequenceContainers.push(container);
  }

  createAvailableOptions() {
    const { availableOptions, missingNumber } = this.levelData;
    const startY = 350;
    const spacing = 30;
    const elementWidth = 60; // Ancho aumentado para mejor usabilidad

    // Calcular el ancho total de las opciones disponibles
    const totalWidth = (availableOptions.length * elementWidth) + ((availableOptions.length - 1) * spacing);

    // Centrar horizontalmente en la escena
    const startX = this.halfWidth - (totalWidth / 2) + (elementWidth / 2);

    this.optionContainers = [];

    availableOptions.forEach((number, index) => {
      const x = startX + (index * (elementWidth + spacing));
      const isCorrect = number === missingNumber;

      const option = this.createDraggableOption(x, startY, number, isCorrect);
      this.optionContainers.push(option);
    });
  }

  createDraggableOption(x, y, number, isCorrect) {
    // Estilos uniformes para todas las opciones (sin indicadores de corrección)
    const baseColor = 0xB2DFDB; // Verde pastel uniforme
    const borderColor = 0x4DB6AC; // Verde pastel más oscuro para borde
    const textColor = "#fff"; // Verde oscuro para texto

    // Crear capas visuales uniformes aumentadas
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.12);
    shadow.fillRoundedRect(-32, -32, 64, 64, 15);

    const glow = this.add.graphics();
    glow.fillStyle(0x42A5F5, 0.18); // Azul más vibrante para glow
    glow.fillRoundedRect(-35, -35, 70, 70, 18);

    const optionBg = this.add.graphics();
    optionBg.fillStyle(0x42A5F5, 0.9); // Azul vibrante menos suave
    optionBg.fillRoundedRect(-30, -30, 60, 60, 15);

    // Borde azul más oscuro aumentado
    optionBg.lineStyle(3, 0x1565C0, 1);
    optionBg.strokeRoundedRect(-30, -30, 60, 60, 15);

    // Resaltado superior para efecto 3D uniforme aumentado
    optionBg.fillStyle(0xB2DFDB, 0.5);
    optionBg.fillRoundedRect(-28, -28, 56, 22, 12);

    // Texto del número (sin iconos indicadores)
    const optionText = this.add.text(0, 0, number.toString(), {
      fontSize: "36px",
      fill: textColor,
      fontFamily: "Fredoka",
      fontWeight: "bold",
      stroke: "#1565C0",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Container con todas las capas aumentado
    const container = this.add.container(x, y, [glow, shadow, optionBg, optionText]);
    container.setSize(60, 60);
    container.setInteractive();

    // Propiedades para drag (mantener funcionalidad interna)
    container.number = number;
    container.isCorrect = isCorrect; // Mantener para lógica, pero no visual
    container.initialX = x;
    container.initialY = y;

    // Animaciones de hover uniformes
    container.on("pointerover", () => {
      this.tweens.add({
        targets: container,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 150,
        ease: "Power2"
      });
    });

    container.on("pointerout", () => {
      if (!container.isDragging) {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: "Power2"
        });
      }
    });

    // Eventos de drag uniformes
    container.on("dragstart", () => {
      // Verificar que la escena aún sea válida antes de iniciar drag
      if (!this.scene || this.scene.isDestroyed ||
          !this.cameras || !this.cameras.main ||
          this.levelCompleted) {
        console.warn("Drag start cancelled: Scene/camera invalidated");
        return;
      }

      container.isDragging = true;
      this.tweens.add({
        targets: container,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 100,
        ease: "Power2"
      });

      // Cambiar apariencia durante drag (uniforme) aumentado
      optionBg.clear();
      optionBg.fillStyle(0x1976D2, 0.95); // Azul más oscuro durante drag
      optionBg.fillRoundedRect(-30, -30, 60, 60, 15);
      optionBg.lineStyle(3, 0x0D47A1, 1);
      optionBg.strokeRoundedRect(-30, -30, 60, 60, 15);
    });

    container.on("drag", (pointer, dragX, dragY) => {
      // Verificar que la escena y cámara aún sean válidas durante el drag
      if (!this.scene || this.scene.isDestroyed ||
          !this.cameras || !this.cameras.main ||
          this.levelCompleted) {
        console.warn("Drag cancelled: Scene/camera invalidated during drag");
        return;
      }

      // Verificar que las coordenadas sean válidas
      if (isNaN(dragX) || isNaN(dragY)) {
        console.warn("Drag cancelled: Invalid coordinates");
        return;
      }

      container.x = dragX;
      container.y = dragY;
    });

    container.on("dragend", () => {
      // Verificar que la escena aún sea válida antes de procesar el drop
      if (!this.scene || this.scene.isDestroyed ||
          !this.cameras || !this.cameras.main) {
        console.warn("Drag end cancelled: Scene/camera invalidated");
        return;
      }

      container.isDragging = false;
      this.handleDropAttempt(container);

      // Restaurar apariencia después del drag
      this.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Back.easeOut"
      });
    });

    // Hacer draggable
    this.input.setDraggable(container);

    // Animación de entrada uniforme
    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 200,
      ease: "Back.easeOut"
    });

    return container;
  }

  handleDropAttempt(draggedContainer) {
    // Verificar que el nivel no haya sido completado ya
    if (this.levelCompleted) {
      console.log("Drop attempt ignored: Level already completed");
      return;
    }

    // Verificar que la escena aún sea válida
    if (!this.scene || this.scene.isDestroyed ||
        !this.cameras || !this.cameras.main) {
      console.warn("Drop attempt cancelled: Scene invalidated");
      return;
    }

    this.attempts++;
    this.registry.set("levelAttempts", this.attempts);

    // Verificar si está cerca del área objetivo
    const distance = Phaser.Math.Distance.Between(
      draggedContainer.x, draggedContainer.y,
      this.targetArea.graphics.x, this.targetArea.graphics.y
    );

    if (distance < 50) {
      // Está cerca del área objetivo
      if (draggedContainer.isCorrect) {
        this.handleCorrectAnswer(draggedContainer);
      } else {
        this.handleWrongAnswer(draggedContainer);
      }
    } else {
      // No está cerca, regresar a posición inicial
      this.returnToInitialPosition(draggedContainer);
    }
  }

  handleCorrectAnswer(container) {
    // Marcar como completado inmediatamente para prevenir más interacciones
    this.levelCompleted = true;

    // Desactivar todos los drags inmediatamente
    this.disableAllDrags();

    // Sonido de éxito
    this.sound.play("correct", { volume: 0.5 });

    // Animación de éxito
    container.x = this.targetArea.graphics.x;
    container.y = this.targetArea.graphics.y;
    container.setScale(1);

    // Ocultar área objetivo
    this.targetArea.graphics.setVisible(false);
    this.targetArea.text.setVisible(false);

    // Calcular tiempo y completar nivel en el manager
    const completionTime = (this.time.now - this.startTime) / 1000;
    this.registry.set("levelTime", completionTime);

    // Completar nivel usando el manager
    const result = this.minigameManager.completeCurrentLevel({
      time: completionTime,
      attempts: this.attempts
    });

    // Mostrar congratulaciones con retraso mínimo
    this.time.delayedCall(100, () => {
      // this.safeSceneTransition("CongratulationsScene", result);
      this.scene.stop("SequenceGameScene");
      this.scene.start("CongratulationsScene");
    });
  }

  handleLevelCompleted(data) {
    console.log("Level completed:", data);
    // Aquí puedes agregar lógica adicional cuando se complete un nivel
    // Por ejemplo, actualizar UI, reproducir sonidos, etc.
  }

  handleWrongAnswer(container) {
    // Sonido de error
    this.sound.play("error", { volume: 0.3 });

    // Animación de error
    this.tweens.add({
      targets: container,
      x: container.x + 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.returnToInitialPosition(container);
      }
    });
  }

  returnToInitialPosition(container) {
    this.tweens.add({
      targets: container,
      x: container.initialX,
      y: container.initialY,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: "Back.easeOut"
    });
  }

  // Método para desactivar todos los drags y prevenir errores de cámara
  disableAllDrags() {
    try {
      // Desactivar drag en todos los containers de opciones
      if (this.optionContainers) {
        this.optionContainers.forEach(container => {
          if (container && this.input && !this.input.isDestroyed) {
            // Remover event listeners de drag
            container.removeAllListeners();

            // Desactivar drag
            this.input.setDraggable(container, false);

            // Marcar como no arrastrable
            container.isDragging = false;
          }
        });
      }

      // Limpiar cualquier referencia de input activa
      if (this.input && !this.input.isDestroyed) {
        // Desactivar temporalmente el procesamiento de input para prevenir errores
        this.input.enabled = false;

        // Re-habilitar después de un breve delay para permitir la transición
        this.time.delayedCall(50, () => {
          if (this.input && !this.input.isDestroyed) {
            this.input.enabled = true;
          }
        });
      }

      console.log("All drags disabled successfully");
    } catch (error) {
      console.warn("Error disabling drags:", error);
    }
  }

  // Método seguro para transiciones de escena
  safeSceneTransition(sceneKey, data) {
    try {
      // Verificar que la escena actual aún sea válida
      if (!this.scene || this.scene.isDestroyed ||
          !this.cameras || !this.cameras.main) {
        console.warn("Scene transition cancelled: Current scene invalidated");
        return false;
      }

      // Detener todos los tweens activos
      if (this.tweens) {
        this.tweens.killAll();
      }

      // Realizar la transición
      this.scene.launch(sceneKey, data);
      console.log(`Scene transition to ${sceneKey} completed successfully`);
      return true;

    } catch (error) {
      console.warn(`Error during scene transition to ${sceneKey}:`, error);
      return false;
    }
  }

 
  createUI() {
    // Timer
    this.timeText = this.add.text(700, 30, "Tiempo: 0s", {
      fontSize: "16px",
      fill: "#333",
      fontFamily: "Fredoka"
    });

    // Intentos
    this.attemptsText = this.add.text(700, 55, "Intentos: 0", {
      fontSize: "16px",
      fill: "#333",
      fontFamily: "Fredoka"
    });
  }

  update() {
    // Verificar que la escena aún sea válida
    if (!this.scene || this.scene.isDestroyed ||
        !this.cameras || !this.cameras.main) {
      return;
    }

    if (!this.levelCompleted && this.startTime) {
      const currentTime = (this.time.now - this.startTime) / 1000;
      this.timeText.setText(`Tiempo: ${Math.floor(currentTime)}s`);
      this.attemptsText.setText(`Intentos: ${this.attempts}`);
    }
  }

  destroy(fromScene) {
    // Limpiar event listeners
    if (this.minigameManager && this.minigameManager.events) {
      this.minigameManager.events.off("levelCompleted", this.handleLevelCompleted, this);
    }
    super.destroy(fromScene);
  }
}
