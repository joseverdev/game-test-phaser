import Phaser from "phaser";

export class CompleteSequenceScene extends Phaser.Scene {
  constructor() {
    super({ key: "CompleteSequenceScene" });
  }

  preload() {
    this.load.image("apple", "./assets/sprites/apple.svg");
  }

  create() {
    const bg = this.add.rectangle(400, 195, 844, 390, 0x000000);
    bg.setAlpha(0.5);

    // Variable para guardar la posición del área objetivo (donde está el "?")
    let targetArea = null;

    for (let i = 0; i < 5; i++) {
      if (i === 2) {
        this.add.image(200 + i * 100, 110, "apple").setScale(0.25).setAlpha(0.5);
        this.add.text(185 + i * 100, 100, "?",
          {
            fontSize: "44px",
            fill: "#fff",
            fontStyle: "bold",
            strokeThickness: 4,
            stroke: "#000"
          });

        // Guardar la posición del área objetivo
        targetArea = {
          x: 200 + i * 100,
          y: 110,
          radius: 50 // Radio de detección
        };
      } else {
        this.add.image(200 + i * 100, 110, "apple").setScale(0.25);
        this.add.text(185 + i * 100, 100, `${i + 1}`,
          {
            fontSize: "44px",
            fill: "#fff",
            fontStyle: "bold",
            strokeThickness: 4,
            stroke: "#000"
          });
      }
    }

    // Crear 3 containers de manzanas con diferentes posiciones
    const appleContainers = [];

    // const bgOptions = this.add.rectangle(400, 300, 400, 190, 0x000000);
    // bgOptions.setAlpha(0.5);

    const bgOptions = this.add.graphics();
    bgOptions.fillStyle(0x000000, 0.5);
    const cx = 400; const cy = 300;
    const w = 400; const h = 160;
    bgOptions.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 20);
    // último parámetro = radio de las esquinas

    for (let i = 0; i < 3; i++) {
      const apple = this.add.image(0, 0, "apple").setScale(0.25);
      const text = this.add.text(-15, -10, `${i + 1}`, {
        fontSize: "44px",
        fill: "#fff",
        fontStyle: "bold",
        strokeThickness: 4,
        stroke: "#000"
      });

      // Posición inicial diferente para cada manzana
      const initialX = 300 + i * 100; // 300, 400, 500
      const initialY = 300;

      // Crear el container y añadir ambos elementos
      const appleContainer = this.add.container(initialX, initialY, [apple, text]);
      appleContainer.setSize(apple.displayWidth, apple.displayHeight);
      appleContainer.setInteractive({ draggable: true });

      // Guardar la posición inicial en el propio container
      appleContainer.initialX = initialX;
      appleContainer.initialY = initialY;
      appleContainer.appleNumber = i + 1; // Guardar qué número es esta manzana

      // Añadir al array para referencia
      appleContainers.push(appleContainer);
    }

    // Función para verificar si está cerca del área objetivo
    const isNearTarget = (container, target) => {
      const distance = Phaser.Math.Distance.Between(
        container.x, container.y,
        target.x, target.y
      );
      return distance < target.radius;
    };

    // Lógica de drag para todos los containers (un solo listener)
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      // Verificar si es uno de nuestros containers
      if (appleContainers.includes(gameObject)) {
        const bounds = gameObject.getBounds();
        const halfWidth = bounds.width / 2;
        const halfHeight = bounds.height / 2;
        const minX = halfWidth;
        const maxX = 800 - halfWidth;
        const minY = halfHeight;
        const maxY = 390 - halfHeight;

        gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);
        gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);
      }
    });

    // Cuando se suelta el arrastre
    this.input.on("dragend", (pointer, gameObject) => {
      if (appleContainers.includes(gameObject)) {
        // Verificar si es la manzana "3" y está cerca del área objetivo
        if (gameObject.appleNumber === 3 && isNearTarget(gameObject, targetArea)) {
          // ¡Respuesta correcta! Pegar en la posición objetivo
          this.tweens.add({
            targets: gameObject,
            x: targetArea.x,
            y: targetArea.y,
            duration: 200,
            ease: "Back.easeOut",
            onComplete: () => {
              // Opcional: Desactivar el arrastre de este objeto
              gameObject.disableInteractive();
              // Opcional: Añadir efectos visuales de éxito
              console.log("¡Respuesta correcta!");
              this.scene.launch("CongratulationsScene");
            }
          });
        } else {
          // Respuesta incorrecta o manzana incorrecta, volver a posición inicial
          this.tweens.add({
            targets: gameObject,
            x: gameObject.initialX,
            y: gameObject.initialY,
            duration: 300,
            ease: "Back.easeOut"
          });
        }
      }
    });
  }

  // Ya no necesitas apple1.disableInteractive() porque nunca fue draggable
}
