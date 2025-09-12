import Phaser from "phaser";

import { NavigationUI } from "@/shared/components/NavigationUI";
import { OverlayBox } from "@/shared/components/OverlayBox";

import { RoundedTextBox } from "../shared/components/RoundedTextBox";

export class MathMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MathMenuScene", active: false });
  }

  preload() {
    this.load.image("bgMath", "./assets/bg/bg-math.jpg");
    this.load.image("avatar", "./assets/avatar/gato.png");
    this.load.image("flame", "./assets/objects/flame-64.png");
  }

  create() {
    // Fondo
    this.add.image(400, 300, "bgMath");
    this.overlay = new OverlayBox(this);
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
        this.scene.stop("MathMenuScene");
        this.scene.start("SequenceGameScene", { level: 1 });
      }
    });
    this.roundedTextBox = new RoundedTextBox(this, 400, 200, "Aprende los numeros", {
      bgColor: 0xF06292,
      onClick: () => { console.log("segundo"); }
    });
    this.roundedTextBox = new RoundedTextBox(this, 650, 200, "Aprende los numeros", {
      bgColor: 0x81C784,
      onClick: () => { console.log("terce cuadrado"); }
    });
  }
}
