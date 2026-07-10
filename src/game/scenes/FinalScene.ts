import Phaser from 'phaser'
import { useMbtiStore } from '../../stores/useMbtiStore'
import {
  ASSET_KEYS,
  INNER_GUIDE_FRAMES,
  MORANDI_PALETTE,
  PERFECTIONISM_FRAMES,
} from '../assets/assetManifest'
import { type CharacterMarker } from '../entities/CharacterSprite'
import { MemoryShard } from '../entities/MemoryShard'
import { gameEventBus } from '../events/eventBus'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { formatMeowVerb, interactPrompt } from '../input/interactPrompt'
import { shouldShowTouchControls } from '../input/touchInputEnvironment'

const WORLD_WIDTH = 2520
const WORLD_HEIGHT = 540
const GROUND_Y = 484
const GROUND_HEIGHT = 112
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2
const INTERACT_RADIUS = 92
const RESONANCE_POINT_X = 1040
const INNER_GUIDE_X = 1450
const PERFECTIONISM_X = 2280

type PlatformSpec = {
  x: number
  y: number
  width: number
  height: number
  color?: number
}

const FINAL_PLATFORMS: PlatformSpec[] = [
  { x: 380, y: 392, width: 150, height: 22, color: MORANDI_PALETTE.cloud },
  { x: 640, y: 338, width: 130, height: 22, color: MORANDI_PALETTE.dustyBlue },
  { x: 940, y: 294, width: 120, height: 22 },
  { x: 1280, y: 334, width: 170, height: 22, color: MORANDI_PALETTE.sageGreen },
  { x: 1660, y: 268, width: 110, height: 22 },
  { x: 1940, y: 320, width: 150, height: 22, color: MORANDI_PALETTE.cloud },
  { x: 2240, y: 284, width: 180, height: 22, color: MORANDI_PALETTE.dustyBlue },
]

export class FinalScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private innerGuide?: CharacterMarker
  private perfectionism?: CharacterMarker
  private resonanceBloom?: Phaser.GameObjects.Container
  private interactPrompt?: Phaser.GameObjects.Text
  private cutsceneText?: Phaser.GameObjects.Text
  private guidanceReceived = false
  private resonanceAwakened = false
  private bossEncounterReady = false
  private bossCleared = false
  private prefersTouchControls = false
  private unsubscribeDialogueClosed?: () => void
  private unsubscribeBossDialogueDone?: () => void
  private unsubscribeMeow?: () => void

  constructor() {
    super('FinalScene')
  }

  create() {
    this.guidanceReceived = false
    this.resonanceAwakened = false
    this.bossEncounterReady = false
    this.bossCleared = false
    this.prefersTouchControls = shouldShowTouchControls(this)
    this.shards = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, 110, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMemoryShards()
    this.placeResonancePoint()
    this.placeInnerGuide()
    this.placePerfectionism()

    this.inputCtrl = new InputController(this)
    const isTouch = this.prefersTouchControls

    this.player.setTalkHandler(() => {
      this.handleInteract()
    })

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setDeadzone(120, 40)

    this.interactPrompt = this.add
      .text(0, 0, '按 E 對話', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '12px',
        backgroundColor: 'rgba(248, 251, 249, 0.82)',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(15)

    this.cutsceneText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.36, '', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '18px',
        align: 'center',
        backgroundColor: 'rgba(248, 251, 249, 0.92)',
        padding: { x: 18, y: 12 },
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(30)
      .setScrollFactor(0)

    this.add
      .text(16, 16, '最終章', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        backgroundColor: 'rgba(248, 251, 249, 0.72)',
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0)
      .setDepth(20)

    if (!isTouch) {
      this.add
        .text(this.scale.width / 2, 16, '← → 移動　Space 跳躍　Shift 衝刺　M 喵叫　E 對話／互動', {
          color: MORANDI_PALETTE.mutedText,
          fontFamily: 'monospace',
          fontSize: '12px',
          backgroundColor: 'rgba(248, 251, 249, 0.72)',
          padding: { x: 10, y: 6 },
        })
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(20)
    }

    gameEventBus.emit('phaser:ready', {
      scene: this.scene.key,
      message: '最終章已就緒。',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()

      if (this.bossEncounterReady && !this.bossCleared) {
        this.finishJourney()
      }
    })

    this.unsubscribeBossDialogueDone = gameEventBus.on('boss:perfectionism-understood', () => {
      this.bossEncounterReady = true
    })

    this.unsubscribeMeow = gameEventBus.on('player:meow', ({ x, y }) => {
      this.handleMeowResonance(x, y)
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
    this.updateResonanceBloom(delta)
    this.updateInteractPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.unsubscribeBossDialogueDone?.()
    this.unsubscribeMeow?.()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.1)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.52, WORLD_WIDTH, WORLD_HEIGHT * 0.74, MORANDI_PALETTE.skyBottom, 0.24)
    this.add.rectangle(WORLD_WIDTH / 2, 210, WORLD_WIDTH, 180, MORANDI_PALETTE.dustyBlue, 0.07)

    this.addCloud(240, 92, 0.86)
    this.addCloud(820, 66, 0.7)
    this.addCloud(1560, 104, 0.78)
    this.addCloud(2240, 74, 0.72)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.cloud, 0.46)
    ground.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.24)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    FINAL_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.cloud,
        0.84,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.32)
      group.add(rect)
    })

    return group
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 420, y: 356 },
      { x: 940, y: 254 },
      { x: 1660, y: 228 },
      { x: 2240, y: 244 },
    ]

    shardPositions.forEach(({ x, y }) => {
      const shard = new MemoryShard(this, x, y)
      this.shards.push(shard)

      if (this.player) {
        this.physics.add.overlap(this.player, shard, () => {
          shard.collect(this.player as Player)
        })
      }
    })
  }

  private placeResonancePoint() {
    this.resonanceBloom = this.add.container(RESONANCE_POINT_X, GROUND_TOP - 20)
    const ring = this.add.circle(0, 0, 24, MORANDI_PALETTE.warmBeige, 0.22)
    ring.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.32)
    const core = this.add.circle(0, 0, 8, MORANDI_PALETTE.cloud, 0.68)
    const label = this.add
      .text(0, 28, '共鳴', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
      })
      .setOrigin(0.5)
    this.resonanceBloom.add([ring, core, label])
    this.resonanceBloom.setAlpha(0.55)
  }

  private placeInnerGuide() {
    const container = this.add.container(INNER_GUIDE_X, GROUND_TOP) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.innerGuide, INNER_GUIDE_FRAMES.sideIdle)
    sprite.setOrigin(0.5, 1).setScale(0.44)

    const label = this.add
      .text(0, 8, '內在嚮導', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setVisible(false)

    container.add([sprite, label])
    container.sprite = sprite
    container.label = label
    this.innerGuide = container

    this.tweens.add({
      targets: sprite,
      y: -2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private placePerfectionism() {
    this.registerPerfectionismAnimation()

    const container = this.add.container(PERFECTIONISM_X, 312) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.perfectionism, PERFECTIONISM_FRAMES.idle)
    sprite.setOrigin(0.5, 1).setScale(0.48)
    sprite.setAlpha(0.7)
    sprite.play('perfectionism-mist')

    const label = this.add
      .text(0, 8, '完美主義', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    container.add([sprite, label])
    container.sprite = sprite
    container.label = label
    this.perfectionism = container
  }

  private registerPerfectionismAnimation() {
    if (this.anims.exists('perfectionism-mist')) {
      return
    }

    this.anims.create({
      key: 'perfectionism-mist',
      frames: [
        { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse1 },
        { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse2 },
        { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.pulse3 },
        { key: ASSET_KEYS.perfectionism, frame: PERFECTIONISM_FRAMES.idle },
      ],
      frameRate: 3,
      repeat: -1,
    })
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (this.isNearInnerGuide()) {
      this.guidanceReceived = true
      this.player.triggerTalk('innerGuide')
      return
    }

    if (!this.isNearPerfectionism()) {
      return
    }

    if (!this.resonanceAwakened) {
      this.showMomentText('還有一聲輕柔回音在等著。\n在附近輕輕喵叫看看。')
      return
    }

    if (!this.guidanceReceived && !useMbtiStore.getState().isComplete()) {
      this.showMomentText('還有幾個溫柔的問題尚未回答。\n先與內在嚮導對話吧。')
      return
    }

    this.player.triggerTalk('perfectionismBoss')
  }

  private handleMeowResonance(playerX: number, playerY: number) {
    if (this.resonanceAwakened) {
      return
    }

    const distance = Phaser.Math.Distance.Between(playerX, playerY, RESONANCE_POINT_X, GROUND_TOP)
    if (distance > INTERACT_RADIUS + 20) {
      return
    }

    this.resonanceAwakened = true
    this.showMomentText('霧氣輕輕回應。\n前方的路變得安靜了。')
  }

  private updateResonanceBloom(delta: number) {
    if (!this.resonanceBloom) {
      return
    }

    const pulse = 1 + Math.sin(this.time.now / 340) * 0.05
    this.resonanceBloom.setScale(pulse)

    if (this.resonanceAwakened) {
      const fade = 0.82 + Math.sin(delta + this.time.now / 280) * 0.08
      this.resonanceBloom.setAlpha(fade)
      return
    }

    this.resonanceBloom.setAlpha(0.55)
  }

  private finishJourney() {
    if (this.bossCleared || !this.player) {
      return
    }

    this.bossCleared = true
    this.bossEncounterReady = false
    this.player.playEmote('happy')

    this.tweens.add({
      targets: this.perfectionism,
      alpha: 0.24,
      duration: 1400,
      ease: 'Sine.easeInOut',
    })

    this.cutsceneText
      ?.setText('有些禮物，不用完美。\n真正重要的是：心意。')
      .setVisible(true)

    this.time.delayedCall(2600, () => {
      gameEventBus.emit('chapter:final-cleared', { scene: this.scene.key })
    })
  }

  private showMomentText(message: string) {
    this.cutsceneText?.setText(message).setVisible(true)
    this.time.delayedCall(2200, () => {
      this.cutsceneText?.setVisible(false)
    })
  }

  private updateInteractPrompt() {
    if (!this.player || !this.interactPrompt) {
      return
    }

    let promptText: string | null = null
    this.innerGuide?.label.setVisible(false)

    if (this.isNearPerfectionism()) {
      if (!this.resonanceAwakened) {
        promptText = '還有一聲輕柔回音在等你的喵叫'
      } else if (!this.guidanceReceived && !useMbtiStore.getState().isComplete()) {
        promptText = interactPrompt(this.prefersTouchControls, '與內在嚮導對話')
      } else {
        promptText = interactPrompt(this.prefersTouchControls, '面對完美主義')
      }
    } else if (this.isNearInnerGuide()) {
      promptText = interactPrompt(this.prefersTouchControls, '聽聽內心')
      this.innerGuide?.label.setVisible(true)
    } else if (!this.resonanceAwakened && this.isNearResonancePoint()) {
      promptText = `${formatMeowVerb(this.prefersTouchControls)} 讓霧氣回應你`
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
  }

  private isNearResonancePoint() {
    if (!this.player) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, RESONANCE_POINT_X, GROUND_TOP) <= INTERACT_RADIUS + 18
  }

  private isNearInnerGuide() {
    if (!this.player || !this.innerGuide) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.innerGuide.x, this.innerGuide.y) <= INTERACT_RADIUS
  }

  private isNearPerfectionism() {
    if (!this.player || !this.perfectionism || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.perfectionism.x, this.perfectionism.y) <= INTERACT_RADIUS + 16
  }

  private addCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y)
    cloud.add([
      this.add.circle(-44 * scale, 8 * scale, 28 * scale, MORANDI_PALETTE.cloud, 0.78),
      this.add.circle(-12 * scale, -10 * scale, 38 * scale, MORANDI_PALETTE.cloud, 0.84),
      this.add.circle(30 * scale, 4 * scale, 30 * scale, MORANDI_PALETTE.cloud, 0.72),
      this.add.circle(60 * scale, 14 * scale, 20 * scale, MORANDI_PALETTE.cloud, 0.6),
    ])
  }
}
