import Phaser from "phaser";

import { BackBtn } from "./BackBtn";

export class NavigationUI extends Phaser.GameObjects.Container {
  constructor(scene, {
    showBackButton = true,
    showUserInfo = true,
    showStreakInfo = true,
    userInfo = {
      name: "Jose",
      avatar: "avatar"
    },
    streakInfo = {
      count: 7,
      icon: "flame"
    },
    onBackClick = () => console.log("Back clicked")
  } = {}) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.scene = scene;
    this.config = {
      showBackButton,
      showUserInfo,
      showStreakInfo,
      userInfo,
      streakInfo,
      onBackClick
    };

    this.createNavigation();
  }

  createNavigation() {
    const { showBackButton, showUserInfo, showStreakInfo } = this.config;

    // Botón de atrás
    if (showBackButton) {
      this.createBackButton();
    }

    // Información del usuario
    if (showUserInfo) {
      this.createUserInfo();
    }

    // Información de racha
    if (showStreakInfo) {
      this.createStreakInfo();
    }
  }

  createBackButton() {
    this.backBtn = new BackBtn(this.scene, 45, 36, {
      onClick: this.config.onBackClick
    });
  }

  createUserInfo() {
    const { userInfo } = this.config;

    // Rectángulo principal
    const topRightRect = this.scene.add.graphics();
    topRightRect.fillStyle(0x1D293D, 1);

    const topRightRectWidth = 130;
    const topRightRectHeight = 50;
    const topRightCornerRadius = 10;
    const centerXRect = this.scene.scale.width - 180;
    const centerYRect = 36;

    topRightRect.fillRoundedRect(
      centerXRect - topRightRectWidth / 2,
      centerYRect - topRightRectHeight / 2,
      topRightRectWidth,
      topRightRectHeight,
      topRightCornerRadius
    );

    // Avatar
    const avatarSize = 32;
    const avatarX = centerXRect - 35;
    const avatarY = centerYRect;

    const avatar = this.scene.add.image(avatarX, avatarY, userInfo.avatar)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(avatarSize, avatarSize);

    // Máscara circular
    const avatarMask = this.scene.add.graphics()
      .fillStyle(0xFFFFFF)
      .fillCircle(avatarX, avatarY, avatarSize / 2);

    avatar.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    avatar.setMask(avatarMask.createGeometryMask());
    avatarMask.setVisible(false);

    // Nombre del usuario
    const userNameText = this.scene.add.text(centerXRect, centerYRect, userInfo.name, {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Fredoka",
      fontWeight: "bold"
    }).setOrigin(0, 0.5);

    this.add([topRightRect, avatar, userNameText]);
    this.userElements = { topRightRect, avatar, avatarMask, userNameText };
  }

  createStreakInfo() {
    const { streakInfo } = this.config;

    const centerXRect = this.scene.scale.width - 180;
    const centerYRect = 36;
    const topRightRectWidth = 130;
    const rightRectSpacing = 10;

    // Rectángulo de racha
    const rightRect = this.scene.add.graphics();
    rightRect.fillStyle(0xFFCACA, 1);
    rightRect.lineStyle(0.5, 0xFF6666, 1);

    const rightRectWidth = 64;
    const rightRectHeight = 49;
    const rightRectCornerRadius = 10;
    const centerXRightRect = centerXRect + (topRightRectWidth / 2) + rightRectSpacing + (rightRectWidth / 2);
    const centerYRightRect = centerYRect;

    rightRect.fillRoundedRect(
      centerXRightRect - rightRectWidth / 2,
      centerYRightRect - rightRectHeight / 2,
      rightRectWidth,
      rightRectHeight,
      rightRectCornerRadius
    );

    rightRect.strokeRoundedRect(
      centerXRightRect - rightRectWidth / 2,
      centerYRightRect - rightRectHeight / 2,
      rightRectWidth,
      rightRectHeight,
      rightRectCornerRadius
    );

    // Contenido: número y icono
    const flameSize = 32;
    const contentSpacing = 2;
    const contentCenterX = centerXRightRect;
    const contentCenterY = centerYRightRect;

    const numberText = this.scene.add.text(
      contentCenterX - contentSpacing - 5,
      contentCenterY,
      streakInfo.count.toString(),
      {
        fontSize: "24px",
        fill: "#DC2626",
        fontFamily: "Fredoka",
        fontWeight: "bold",
        stroke: "#DC2626",
        strokeThickness: 1
      }
    ).setOrigin(1, 0.5);

    const flameIcon = this.scene.add.image(
      contentCenterX + contentSpacing - 5,
      contentCenterY - 2,
      streakInfo.icon
    )
      .setOrigin(0, 0.5)
      .setDisplaySize(flameSize, flameSize);

    this.add([rightRect, numberText, flameIcon]);
    this.streakElements = { rightRect, numberText, flameIcon };
  }

  // Métodos para actualizar información
  updateUserInfo(newUserInfo) {
    this.config.userInfo = { ...this.config.userInfo, ...newUserInfo };
    if (this.userElements) {
      this.userElements.userNameText.setText(this.config.userInfo.name);
      // Actualizar avatar si es necesario
    }
  }

  updateStreakCount(newCount) {
    this.config.streakInfo.count = newCount;
    if (this.streakElements) {
      this.streakElements.numberText.setText(newCount.toString());
    }
  }

  // Ocultar/mostrar elementos
  setBackButtonVisible(visible) {
    if (this.backBtn) {
      this.backBtn.setVisible(visible);
    }
  }

  setUserInfoVisible(visible) {
    if (this.userElements) {
      Object.values(this.userElements).forEach(element => {
        element.setVisible(visible);
      });
    }
  }

  setStreakInfoVisible(visible) {
    if (this.streakElements) {
      Object.values(this.streakElements).forEach(element => {
        element.setVisible(visible);
      });
    }
  }

  destroy(fromScene) {
    if (this.backBtn) {
      this.backBtn.destroy();
    }
    super.destroy(fromScene);
  }
}
