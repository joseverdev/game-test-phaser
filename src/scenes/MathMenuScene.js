import Phaser from "phaser";

import { NavigationUI } from "@/shared/components/NavigationUI";
import { OverlayBox } from "@/shared/components/OverlayBox";

import { RoundedTextBox } from "../shared/components/RoundedTextBox";
import { AudioManager } from "@/managers/AudioManager";
import { ScenePersistenceManager } from "@/managers/ScenePersistenceManager";
import { AssetManager } from "@/managers/AssetManager";

export class MathMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MathMenuScene", active: false });
  }

  preload() {
    // Use AssetManager for safe loading to prevent conflicts on scene restoration
    AssetManager.loadImageSafe(this, "bgMath", "./assets/bg/bg-math.jpg");
    AssetManager.loadImageSafe(this, "avatar", "./assets/avatar/gato.png");
    AssetManager.loadImageSafe(this, "flame", "./assets/objects/flame-64.png");

    // Load background music
    const audioManager = AudioManager.getInstance();
    audioManager.loadAudio(this);
  }

  create() {
    // Fondo
    this.add.image(400, 300, "bgMath");
    this.overlay = new OverlayBox(this);

    // Initialize background music
    const audioManager = AudioManager.getInstance();
    audioManager.initMusic(this);
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
        this.scene.stop("MathMenuScene");
        this.scene.start("MainMenuScene");
      }
    });
    // Crear caja de texto redondeada
    this.roundedTextBox = new RoundedTextBox(this, 150, 200, "Aprende los numeros", {
      bgColor: 0x4FC3F7,
      onClick: () => {
        console.log("aprende los numeros");
        // Save current scene before navigating
        ScenePersistenceManager.saveCurrentScene("NumbersLevelMenuScene");
        this.scene.stop("MathMenuScene");
        this.scene.start("NumbersLevelMenuScene");
      }
    });
    this.roundedTextBox = new RoundedTextBox(this, 400, 200, "Aprende Sumas", {
      bgColor: 0xF06292,
      onClick: () => {
        console.log("aprende sumas");
        // Save current scene before navigating
        ScenePersistenceManager.saveCurrentScene("AdditionsLevelMenuScene");
        this.scene.stop("MathMenuScene");
        this.scene.start("AdditionsLevelMenuScene");
      }
    });
    this.roundedTextBox = new RoundedTextBox(this, 650, 200, "Aprende Restas", {
      bgColor: 0x81C784,
      onClick: () => {
        console.log("aprende restas");
        // Save current scene before navigating
        ScenePersistenceManager.saveCurrentScene("SubtractionsLevelMenuScene");
        this.scene.stop("MathMenuScene");
        this.scene.start("SubtractionsLevelMenuScene");
      }
    });
  }
}
