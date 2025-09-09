import { DialogBox } from "../modules/DialogBox.js";

export class TutoCSScene extends Phaser.Scene {
  constructor() {
    super({ key: "TutoCSScene" });
  }

  preload() {
    this.load.image("cuy", "./assets/sprites/cuy.png");
  }

  create() {
    // Crear instancia de DialogBox
    this.dialogBox = new DialogBox(this);

    // Usar el método createWithCuy para crear cuy + diálogo
    this.cuyWithDialog = this.dialogBox.createWithCuy(
      100, 250,
      "Arrastra las manzanas\nDe la parte de abajo\nPara completar la secuencia.",
      {}, // opciones de configuración
      () => {
        // Esta función se ejecutará cuando se haga click/touch
        console.log("Cuy o diálogo clickeado");
        this.scene.stop("TutoCSScene");
      }
    );
  }

  // Método para cambiar el diálogo
  changeDialog(newMessage, options = {}) {
    // Destruir el diálogo anterior
    if (this.cuyWithDialog) {
      this.cuyWithDialog.destroy();
    }

    // Crear nuevo diálogo
    this.cuyWithDialog = this.dialogBox.createWithCuy(100, 250, newMessage, options);
  }
}
