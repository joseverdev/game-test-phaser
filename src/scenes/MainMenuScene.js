import Phaser from "phaser";

import { BackBtn } from "@/shared/components/BackBtn";
import { CuyGuide } from "@/shared/components/CuyGuide";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene", active: false });
  }

  preload() {
    this.load.image("bg", "./assets/bg/main-menu-bg.jpg");
    this.load.image("castle", "./assets/objects/castle.svg");
    this.load.image("tower", "./assets/objects/logic-tower.svg");
    this.load.image("world", "./assets/objects/english-world.svg");
    this.load.image("cuy", "./assets/sprites/cuy.png");
    this.load.image("avatar", "./assets/avatar/gato.png");
    this.load.image("flame", "./assets/objects/flame-64.png");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

    // Crear botón de salir en la esquina superior izquierda

    // Rectángulo en esquina superior derecha
    const topRightRect = this.add.graphics();
    topRightRect.fillStyle(0x1D293D, 1);

    // Definir dimensiones
    const topRightRectWidth = 130;
    const topRightRectHeight = 50;
    const topRightCornerRadius = 10;

    // Calcular posición para que el centro esté donde quieres
    const centerXRect = this.scale.width - 180; // Centro del rectángulo a 120px del borde derecho (movido hacia la izquierda)
    const centerYRect = 36; // Centro del rectángulo a 45px desde arriba

    topRightRect.fillRoundedRect(
      centerXRect - topRightRectWidth / 2,  // X desde esquina superior izquierda
      centerYRect - topRightRectHeight / 2, // Y desde esquina superior izquierda
      topRightRectWidth,
      topRightRectHeight,
      topRightCornerRadius
    );

    // Rectángulo adicional a la derecha del topRightRect
    const rightRect = this.add.graphics();
    rightRect.fillStyle(0xFFCACA, 1); // Color #FFCACA (rosa claro)
    rightRect.lineStyle(0.5, 0xFF6666, 1); // Borde rojo menos intenso de 1px

    // Definir dimensiones del rectángulo derecho
    const rightRectWidth = 64;
    const rightRectHeight = 49; // Reducir 1px para compensar el borde
    const rightRectCornerRadius = 10;

    // Posición a la derecha del topRightRect con un pequeño espacio
    const rightRectSpacing = 10; // Espacio entre rectángulos
    const centerXRightRect = centerXRect + (topRightRectWidth / 2) + rightRectSpacing + (rightRectWidth / 2);
    const centerYRightRect = centerYRect; // Misma altura que topRightRect

    rightRect.fillRoundedRect(
      centerXRightRect - rightRectWidth / 2,  // X desde esquina superior izquierda
      centerYRightRect - rightRectHeight / 2, // Y desde esquina superior izquierda
      rightRectWidth,
      rightRectHeight,
      rightRectCornerRadius
    );

    // Dibujar el borde interno después del relleno
    rightRect.strokeRoundedRect(
      centerXRightRect - rightRectWidth / 2,  // X desde esquina superior izquierda
      centerYRightRect - rightRectHeight / 2, // Y desde esquina superior izquierda
      rightRectWidth,
      rightRectHeight,
      rightRectCornerRadius
    );

    // Contenido dentro del rightRect: número "7" y imagen flame
    const flameSize = 32;
    const contentSpacing = 2; // Espacio entre el texto y la imagen

    // Calcular posiciones centradas dentro del rectángulo
    const contentCenterX = centerXRightRect;
    const contentCenterY = centerYRightRect;

    // Número "7" a la izquierda
    const numberText = this.add.text(
      contentCenterX - contentSpacing - 5,
      contentCenterY,
      "7",
      {
        fontSize: "24px",
        fill: "#DC2626",
        fontFamily: "Fredoka",
        fontWeight: "bold",
        stroke: "#DC2626",         // Color del borde igual al texto
        strokeThickness: 1        // Grosor del borde (ajusta el valor para hacerlo más grueso)
      }
    ).setOrigin(1, 0.5); // Alineado a la derecha del texto, centrado verticalmente

    // Imagen flame a la derecha
    const flameIcon = this.add.image(
      contentCenterX + contentSpacing - 5,
      contentCenterY - 2,
      "flame"
    )
      .setOrigin(0, 0.5) // Alineado a la izquierda de la imagen, centrado verticalmente
      .setDisplaySize(flameSize, flameSize);

    // Avatar del usuario (imagen circular) - VERSIÓN OPTIMIZADA
    const avatarSize = 32;
    const avatarX = centerXRect - 35;
    const avatarY = centerYRect;

    const avatar = this.add.image(avatarX, avatarY, "avatar")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(avatarSize, avatarSize);

    // Crear máscara circular para el avatar (optimizada)
    const avatarMask = this.add.graphics()
      .fillStyle(0xFFFFFF)
      .fillCircle(avatarX, avatarY, avatarSize / 2);

    avatar.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);

    // Aplicar máscara y ocultar el graphics de la máscara
    avatar.setMask(avatarMask.createGeometryMask());
    avatarMask.setVisible(false); // Ocultar la máscara para que no se vea el círculo blanco

    // Nombre del usuario
    const userName = "Jose"; // Puedes hacerlo dinámico más adelante
    const userNameText = this.add.text(centerXRect, centerYRect, userName, {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Fredoka",
      fontWeight: "bold"
    }).setOrigin(0, 0.5); // Alineado a la izquierda del texto, centrado verticalmente

    // Rectángulo redondeado centrado con color negro y opacidad 0.5
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const rectWidth = 760;
    const rectHeight = 260;
    const cornerRadius = 20;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5); // Negro con opacidad 0.5
    overlay.fillRoundedRect(
      centerX - rectWidth / 2,  // X centrado
      centerY - rectHeight / 2, // Y centrado
      rectWidth,
      rectHeight,
      cornerRadius
    );

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

      let menuImage;

      menuImage = index === 1
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
        });
    });

    // Con el nuevo componente:
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

    this.backBtn = new BackBtn(this, 45, 36, {
      onClick: () => {
        console.log("Atras");
      },
    });
  }
}
