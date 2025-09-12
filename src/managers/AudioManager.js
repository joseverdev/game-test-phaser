export class AudioManager {
  static instance = null;

  constructor() {
    if (AudioManager.instance) {
      return AudioManager.instance;
    }

    this.music = null;
    this.isMuted = this.loadMuteState();
    this.hasUserInteracted = false;
    this.volume = 0.2;
    this.isPlaying = false;

    AudioManager.instance = this;
  }

  static getInstance() {
    if (!AudioManager.instance) {
      new AudioManager();
    }
    return AudioManager.instance;
  }

  // Load mute state from localStorage
  loadMuteState() {
    const saved = localStorage.getItem("bgMusicMuted");
    return saved ? JSON.parse(saved) : false;
  }

  // Save mute state to localStorage
  saveMuteState() {
    localStorage.setItem("bgMusicMuted", JSON.stringify(this.isMuted));
  }

  // Load audio in a scene
  loadAudio(scene) {
    if (!scene.load.audio) return; // Ensure scene has load method

    try {
      scene.load.audio("bgMusic", "./assets/sounds/bg.wav");
    } catch (error) {
      console.error("Failed to load background music:", error);
    }
  }

  // Initialize and start music in a scene
  initMusic(scene) {
    if (!scene.sound) return;

    try {
      // Create music instance if not exists
      if (!this.music) {
        this.music = scene.sound.add("bgMusic", {
          loop: true,
          volume: this.volume
        });
      }

      // Start music if user has interacted and not muted
      if (this.hasUserInteracted && !this.isMuted && !this.isPlaying) {
        this.play();
      }
    } catch (error) {
      console.error("Failed to initialize background music:", error);
    }
  }

  // Play music
  play() {
    if (this.music && !this.isMuted) {
      try {
        this.music.play();
        this.isPlaying = true;
      } catch (error) {
        console.error("Failed to play background music:", error);
      }
    }
  }

  // Pause music
  pause() {
    if (this.music) {
      try {
        this.music.pause();
        this.isPlaying = false;
      } catch (error) {
        console.error("Failed to pause background music:", error);
      }
    }
  }

  // Stop music
  stop() {
    if (this.music) {
      try {
        this.music.stop();
        this.isPlaying = false;
      } catch (error) {
        console.error("Failed to stop background music:", error);
      }
    }
  }

  // Toggle mute/unmute
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.saveMuteState();

    if (this.isMuted) {
      this.pause();
    } else if (this.hasUserInteracted) {
      this.play();
    }

    return this.isMuted;
  }

  // Set user interaction flag and start music if not muted
  setUserInteracted() {
    this.hasUserInteracted = true;
    if (!this.isMuted && !this.isPlaying) {
      this.play();
    }
  }

  // Get current state
  getState() {
    return {
      isMuted: this.isMuted,
      isPlaying: this.isPlaying,
      hasUserInteracted: this.hasUserInteracted,
      volume: this.volume
    };
  }

  // Clean up when scene changes (optional, for memory management)
  onSceneChange(newScene) {
    // If music exists and scene has sound, transfer or recreate if needed
    // For simplicity, keep the same instance
  }
}