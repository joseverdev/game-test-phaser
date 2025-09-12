import Phaser from "phaser";

import { SequenceGameScene } from "./minigames/sequence/scenes/SequenceGameScene";
import { SCENE_HEIGHT, SCENE_WIDTH } from "./modules/constanst";
import { MathMenuScene } from "./scenes/MathMenuScene";
import { CongratulationsScene } from "./scenes/CongratulationsScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
// import { MinigameSelectScene } from "./scenes/navigation/MinigameSelectScene.js";

const config = {
  type: Phaser.AUTO,
  transparent: true, // Cambia a false para permitir fondo
  parent: "game", // Indica el div donde se montará el canvas
  scale: {
    mode: Phaser.Scale.NONE, // No scaling, use exact pixel size
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: SCENE_WIDTH,   // píxeles exactos
    height: SCENE_HEIGHT   // píxeles exactos
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false
  },
  scene: [
    MainMenuScene,
    MathMenuScene,
    // MinigameSelectScene,     // Selección de minijuego
    SequenceGameScene,       // Tu minijuego de secuencias
    CongratulationsScene,    // Felicitaciones
    // TutoCSScene,            // Tutorial
  ],
  callbacks: {
    postBoot: function (game) {
      // Agrega un borde al canvas después de que Phaser lo crea
      // todo:quitar este borde para evitar resize
      game.canvas.style.border = "2px solid red";
    }
  }
};

// Función para entrar en pantalla completa
async function enterFullscreen() {
  const element = document.documentElement;

  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      await element.msRequestFullscreen();
    }

    // Intentar rotar a landscape después de entrar en pantalla completa
    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock("landscape");
        console.log("Pantalla rotada a landscape");
      } catch (orientationError) {
        console.log("No se pudo cambiar la orientación:", orientationError);
        // Intentar con landscape-primary como fallback
        try {
          await screen.orientation.lock("landscape-primary");
        } catch (fallbackError) {
          console.log("Tampoco se pudo usar landscape-primary:", fallbackError);
        }
      }
    }
  } catch (error) {
    console.error("Error al entrar en pantalla completa:", error);
  }
}

// Función para detectar si es móvil
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para detectar si es escritorio
function isDesktop() {
  return !isMobile() && !("ontouchstart" in globalThis);
}

// Función para ocultar barras del navegador en móviles
function hideAddressBar() {
  if (isMobile()) {
    // Scroll hacia arriba para ocultar la barra de direcciones
    globalThis.scrollTo(0, 1);
    setTimeout(() => globalThis.scrollTo(0, 0), 100);
  }
}

const game = new Phaser.Game(config);

// Configurar eventos al cargar
globalThis.addEventListener("load", () => {
  hideAddressBar();

  // Solo configurar el botón de pantalla completa en móviles
  const fullscreenBtn = document.querySelector("#fullscreen-btn");
  if (fullscreenBtn) {
    if (isMobile()) {
      // En móviles, mostrar y configurar el botón
      fullscreenBtn.style.display = "block";
      fullscreenBtn.addEventListener("click", enterFullscreen);
    } else {
      // En escritorio, ocultar el botón
      fullscreenBtn.style.display = "none";
    }
  }

  // Escuchar cambios en el estado de pantalla completa (solo si no es escritorio)
  if (!isDesktop()) {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  }

  // Escuchar cambios de orientación para debug
  if (screen.orientation) {
    screen.orientation.addEventListener("change", () => {
      console.log("Orientación cambiada a:", screen.orientation.angle, "grados");
      console.log("Tipo de orientación:", screen.orientation.type);
    });
  }

  // En móviles, ocultar el botón después de unos segundos si no se usa
  if (isMobile()) {
    setTimeout(() => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Solo sugerir pantalla completa en móviles
        const button = document.querySelector("#fullscreen-btn");
        if (button && button.style.display !== "none") {
          button.style.animation = "pulse 2s infinite";
        }
      }
    }, 3000);
  }
});

// Función para manejar el estado de pantalla completa (solo para móviles)
function handleFullscreenChange() {
  // Solo ejecutar si no es escritorio
  if (isDesktop()) return;

  const isFullscreen = !!(document.fullscreenElement ||
                          document.webkitFullscreenElement ||
                          document.mozFullScreenElement ||
                          document.msFullscreenElement);

  const button = document.querySelector("#fullscreen-btn");
  if (button) {
    // Remover event listeners anteriores
    button.removeEventListener("click", enterFullscreen);
    button.removeEventListener("click", exitFullscreen);

    if (isFullscreen) {
      button.textContent = "⏪ ";
      button.style.fontSize = "1.5rem";
      button.addEventListener("click", exitFullscreen);
    } else {
      button.textContent = "📱 Pantalla completa";
      button.addEventListener("click", enterFullscreen);
    }
  }

  if (isFullscreen) {
    hideAddressBar();
  }
}

// Función para salir de pantalla completa
async function exitFullscreen() {
  try {
    // Liberar el bloqueo de orientación primero
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
      console.log("Orientación liberada");
    }

    // Luego salir de pantalla completa
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
  } catch (error) {
    console.error("Error al salir de pantalla completa:", error);
  }
}

// Configurar eventos al cargar
globalThis.addEventListener("load", () => {
  hideAddressBar();

  // Configurar el botón de pantalla completa
  const fullscreenBtn = document.querySelector("#fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", enterFullscreen);
  }

  // Escuchar cambios en el estado de pantalla completa
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  document.addEventListener("MSFullscreenChange", handleFullscreenChange);

  // Escuchar cambios de orientación para debug
  if (screen.orientation) {
    screen.orientation.addEventListener("change", () => {
      console.log("Orientación cambiada a:", screen.orientation.angle, "grados");
      console.log("Tipo de orientación:", screen.orientation.type);
    });
  }

  // En móviles, ocultar el botón después de unos segundos si no se usa
  if (isMobile()) {
    setTimeout(() => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Solo sugerir pantalla completa en móviles
        const button = document.querySelector("#fullscreen-btn");
        if (button) {
          button.style.animation = "pulse 2s infinite";
        }
      }
    }, 3000);
  }
});

// Manejar cambios de orientación
globalThis.addEventListener("orientationchange", () => {
  setTimeout(() => {
    hideAddressBar();
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      // Ya estamos en pantalla completa, solo ajustar
      hideAddressBar();
      // Re-aplicar el bloqueo de orientación si se perdió
      if (screen.orientation && screen.orientation.lock && screen.orientation.type.includes("portrait")) {
        try {
          screen.orientation.lock("landscape");
        } catch (error) {
          console.log("No se pudo re-aplicar landscape:", error);
        }
      }
    }
  }, 500);
});

// Prevenir zoom con gestos
document.addEventListener("gesturestart", (e) => {
  e.preventDefault();
});

document.addEventListener("gesturechange", (e) => {
  e.preventDefault();
});

document.addEventListener("gestureend", (e) => {
  e.preventDefault();
});
