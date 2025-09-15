import Phaser from "phaser";

import { BackBtn } from "@/shared/components/BackBtn";
import { CuyGuide } from "@/shared/components/CuyGuide";
import { NavigationUI } from "@/shared/components/NavigationUI";
import { OverlayBox } from "@/shared/components/OverlayBox";
import { AudioManager } from "@/managers/AudioManager";
import { ScenePersistenceManager } from "@/managers/ScenePersistenceManager";
import { AssetManager } from "@/managers/AssetManager";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene", active: false });
  }

  /**
   * Check if CuyGuide should be shown for the main menu
   * @returns {boolean} - True if it's the first visit
   */
  shouldShowMainMenuCuyGuide() {
    const storageKey = "cuyguide_mainmenu_visited";
    const hasVisited = localStorage.getItem(storageKey) === "true";

    if (!hasVisited) {
      // Mark as visited for future visits
      localStorage.setItem(storageKey, "true");
      return true; // Show CuyGuide on first visit
    }

    return false; // Don't show on subsequent visits
  }

  /**
   * Reset MainMenu CuyGuide tracking (for testing)
   */
  static resetMainMenuCuyGuideTracking() {
    localStorage.removeItem("cuyguide_mainmenu_visited");
  }

  preload() {
    // Use AssetManager for safe loading to prevent conflicts on scene restoration
    AssetManager.loadImageSafe(this, "bg", "./assets/bg/main-menu-bg.jpg");
    AssetManager.loadImageSafe(this, "castle", "./assets/objects/castle.svg");
    AssetManager.loadImageSafe(this, "tower", "./assets/objects/logic-tower.svg");
    AssetManager.loadImageSafe(this, "world", "./assets/objects/english-world.svg");
    AssetManager.loadImageSafe(this, "cuy", "./assets/sprites/cuy.png");
    AssetManager.loadImageSafe(this, "avatar", "./assets/avatar/gato.png");
    AssetManager.loadImageSafe(this, "flame", "./assets/objects/flame-64.png");

    // Load background music
    const audioManager = AudioManager.getInstance();
    audioManager.loadAudio(this);
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

    // Initialize background music
    const audioManager = AudioManager.getInstance();
    audioManager.initMusic(this);

    // Set user interacted on first click to allow autoplay
    this.input.once("pointerdown", () => {
      audioManager.setUserInteracted();
    });

    // Crear botón de salir en la esquina superior izquierda

    // Crear navegación - AQUÍ ES DONDE LA USAS
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
      }
    });

    this.overlay = new OverlayBox(this);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Estilo de texto reutilizable
    const textStyle = {
      fontSize: "24px",
      fill: "#ffffff",
      fontFamily: "Fredoka",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4
    };

    const menuConfig = [
      { image: "castle", text: "Castillo de\nMatemáticas" },
      { image: "tower", text: "Torre de\nLógica" },
      { image: "world", text: "Mundo del\nInglés" }
    ];

    const spacing = 200;
    const startX = centerX - spacing;

    menuConfig.forEach((config, index) => {
      const x = startX + (index * spacing);

      const menuImage = index === 1
        ? this.add.image(x, centerY, config.image).setOrigin(0.5, 0.4)
          .setDisplaySize(160, 160)
          .setInteractive()
          .on("pointerdown", () => {
            console.log("Clicked on", config.text);
          })
        : this.add.image(x, centerY, config.image)
          .setOrigin(0.5, 0.4)
          .setDisplaySize(180, 180)
          .setInteractive()
          .on("pointerdown", () => {
            console.log("Clicked on", config.text);
            if (index === 0) {
              // Save current scene before navigating
              ScenePersistenceManager.saveCurrentScene("MathMenuScene");
              this.scene.start("MathMenuScene");
            }
          });

      // Configurar animación diferente para index 1 (tower)
      if (index === 1) {
        // Animación más sutil para la torre (index 1)
        this.tweens.add({
          targets: menuImage,
          scaleX: 0.92,
          scaleY: 0.92,
          duration: 2000, // Duración más larga para que sea más lenta
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
          delay: 500
        });
      } else {
        // Animación normal para castle (index 0) y world (index 2)
        this.tweens.add({
          targets: menuImage,
          scaleX: 1.03, // Reducir de 1.05 a 1.03 para que sea más sutil
          scaleY: 1.03,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
          delay: 500
        });
      }

      this.add.text(x, centerY - 90, config.text, textStyle).setOrigin(0.5, 0.5)
        .setInteractive()
        .on("pointerdown", () => {
          console.log("Clicked on", config.text);
          if (index === 0) {
            // Save current scene before navigating
            ScenePersistenceManager.saveCurrentScene("MathMenuScene");
            this.scene.start("MathMenuScene");
          }
        });
    });

    // Cuy Guide - Only show on first visit to main menu
    if (this.shouldShowMainMenuCuyGuide()) {
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

      // Mostrar mensaje de bienvenida
      this.cuyGuide.showDialog("¡Hola! Soy tu guía. Selecciona una de las tres aventuras para comenzar.", 4000);
    }

    this.backBtn = new BackBtn(this, 45, 36, {
      onClick: () => {
        console.log("Atras");
      },
    });
  }
}
