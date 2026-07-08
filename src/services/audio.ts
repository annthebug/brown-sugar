import { Howl, Howler } from 'howler';

/**
 * 音訊服務（見 docs/10_Audio.md）。
 * 提供 BGM 與 SFX 兩軌音量控制。實際音檔與資源清單於 Task 015 填入。
 */

type SfxKey = string;

class AudioService {
  private bgm: Howl | null = null;
  private sfx = new Map<SfxKey, Howl>();
  private bgmVolume = 0.6;
  private soundVolume = 0.8;

  setBgmVolume(v: number): void {
    this.bgmVolume = clamp01(v);
    this.bgm?.volume(this.bgmVolume);
  }

  setSoundVolume(v: number): void {
    this.soundVolume = clamp01(v);
  }

  /** 播放背景音樂（同時只播一首，會停止前一首）。 */
  playBgm(src: string): void {
    this.bgm?.stop();
    this.bgm = new Howl({ src: [src], loop: true, volume: this.bgmVolume });
    this.bgm.play();
  }

  stopBgm(): void {
    this.bgm?.stop();
    this.bgm = null;
  }

  /** 播放音效。首次使用某音效時建立並快取 Howl 實例。 */
  playSfx(key: SfxKey, src: string): void {
    let sound = this.sfx.get(key);
    if (!sound) {
      sound = new Howl({ src: [src], volume: this.soundVolume });
      this.sfx.set(key, sound);
    }
    sound.volume(this.soundVolume);
    sound.play();
  }

  muteAll(muted: boolean): void {
    Howler.mute(muted);
  }
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export const audio = new AudioService();
