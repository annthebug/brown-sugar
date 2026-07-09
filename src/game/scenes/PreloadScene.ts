import Phaser from 'phaser'
import { getPlayableChapter, getSceneKeyForChapter, isChapter } from '../../data/chapters'
import { useGameStore } from '../../stores/useGameStore'
import {
  MORANDI_PALETTE,
  type GameAsset,
  getAssetLabel,
  getPreloadAssets,
} from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'

export class PreloadScene extends Phaser.Scene {
  private failedAssets = new Map<string, string>()

  constructor() {
    super('PreloadScene')
  }

  preload() {
    const assets = getPreloadAssets()
    const assetsByKey = new Map(assets.map((asset) => [asset.key, asset]))
    const { width, height } = this.scale
    const barWidth = width * 0.46
    const barHeight = 18
    const barX = width / 2 - barWidth / 2
    const barY = height * 0.62

    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)
    this.add.rectangle(width / 2, height / 2, width, height, MORANDI_PALETTE.skyTop)
    this.add.rectangle(width / 2, height * 0.66, width, height * 0.7, MORANDI_PALETTE.skyBottom, 0.72)
    this.addCloud(width * 0.22, height * 0.22, 1)
    this.addCloud(width * 0.72, height * 0.28, 0.78)

    this.add
      .rectangle(width / 2, height * 0.5, width * 0.58, 148, MORANDI_PALETTE.cloud, 0.88)
      .setStrokeStyle(3, MORANDI_PALETTE.dustyBlue, 0.48)

    this.add
      .text(width / 2, height * 0.43, 'Gathering soft memories...', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '24px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, height * 0.5, 'Loading Brown Sugar and the pale blue sky', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '15px',
      })
      .setOrigin(0.5)

    this.add
      .rectangle(width / 2, barY, barWidth + 12, barHeight + 12, MORANDI_PALETTE.warmBeige, 0.9)
      .setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.5)

    const progressFill = this.add
      .rectangle(barX, barY, 1, barHeight, MORANDI_PALETTE.sageGreen)
      .setOrigin(0, 0.5)
    const progressText = this.add
      .text(width / 2, barY + 42, '0%', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '14px',
      })
      .setOrigin(0.5)

    const failureText = this.add
      .text(width / 2, barY + 70, '', {
        color: MORANDI_PALETTE.errorText,
        fontFamily: 'monospace',
        fontSize: '13px',
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.load.on('progress', (value: number) => {
      const progress = Math.round(value * 100)
      progressFill.width = Math.max(1, barWidth * value)
      progressText.setText(`${progress}%`)
      gameEventBus.emit('phaser:preload-progress', {
        scene: this.scene.key,
        progress,
      })
    })

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      const asset = assetsByKey.get(file.key)
      const assetLabel = asset ? getAssetLabel(asset) : file.key
      this.failedAssets.set(file.key, assetLabel)
      failureText
        .setText(`Could not load ${assetLabel}. Check assets/manifest.json.`)
        .setVisible(true)

      gameEventBus.emit('phaser:preload-error', {
        scene: this.scene.key,
        key: file.key,
        assetLabel,
        fileType: file.type,
        url: file.src,
      })
    })

    this.load.on('complete', () => {
      const failedAssets = [...this.failedAssets.values()]
      gameEventBus.emit('phaser:preloaded', {
        scene: this.scene.key,
        assetCount: assets.length,
        failedAssets,
      })
    })

    assets.forEach((asset) => {
      this.loadAsset(asset)
    })
  }

  create() {
    if (this.failedAssets.size > 0) {
      const { width, height } = this.scale
      this.add
        .text(width / 2, height * 0.77, 'Preload paused until placeholder assets are fixed.', {
          color: MORANDI_PALETTE.errorText,
          fontFamily: 'monospace',
          fontSize: '15px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)

      return
    }

    const state = useGameStore.getState()
    const requestedParam = new URLSearchParams(window.location.search).get('chapter')
    const requestedChapter = isChapter(requestedParam) ? requestedParam : null
    const chapter = getPlayableChapter({
      requestedChapter,
      currentChapter: state.currentChapter,
      forestChapterCleared: state.forestChapterCleared,
      cityChapterCleared: state.cityChapterCleared,
      snowChapterCleared: state.snowChapterCleared,
    })
    const sceneKey = getSceneKeyForChapter(chapter)
    this.scene.start(sceneKey)
  }

  private loadAsset(asset: GameAsset) {
    if (asset.kind === 'atlas') {
      this.load.atlas(asset.key, asset.textureUrl, asset.atlasUrl)
      return
    }

    this.load.image(asset.key, asset.url)
  }

  private addCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y)
    cloud.add([
      this.add.circle(-40 * scale, 8 * scale, 24 * scale, MORANDI_PALETTE.cloud, 0.72),
      this.add.circle(-8 * scale, -8 * scale, 34 * scale, MORANDI_PALETTE.cloud, 0.82),
      this.add.circle(28 * scale, 4 * scale, 28 * scale, MORANDI_PALETTE.cloud, 0.68),
      this.add.circle(56 * scale, 14 * scale, 18 * scale, MORANDI_PALETTE.cloud, 0.58),
    ])
  }
}
