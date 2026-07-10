import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import {
  ASSET_KEYS,
  GLASS_BLOW_STATION_FRAMES,
  GLASS_FURNACE_FRAMES,
  GLASS_MASTER_BOSS_FRAMES,
  GLASS_MASTER_FRAMES,
  MORANDI_PALETTE,
} from '../assets/assetManifest'
import { type CharacterMarker } from '../entities/CharacterSprite'
import { gameEventBus } from '../events/eventBus'
import { MemoryShard } from '../entities/MemoryShard'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { formatInteractVerb, interactPrompt } from '../input/interactPrompt'
import { shouldShowTouchControls } from '../input/touchInputEnvironment'

const WORLD_WIDTH = 2520
const WORLD_HEIGHT = 540
const GROUND_Y = 484
const GROUND_HEIGHT = 112
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2
const INTERACT_RADIUS = 92

const GLASS_TUBE_BLUE = 0xb8d4e8
const WINDOW_GLOW = 0xd8edf4

const MASTER_NPC_X = 240
const FURNACE_X = 820
const BLOW_GLASS_X = 1680
const BOSS_X = 2280

const BLOW_GLASS_TARGET_HITS = 3
const BLOW_GLASS_TIMING_THRESHOLD = 0.72

type PlatformSpec = {
  x: number
  y: number
  width: number
  height: number
  color?: number
}

const STUDIO_PLATFORMS: PlatformSpec[] = [
  { x: 420, y: 392, width: 180, height: 24, color: MORANDI_PALETTE.warmBeige },
  { x: 700, y: 348, width: 140, height: 24 },
  { x: 1040, y: 376, width: 200, height: 24, color: MORANDI_PALETTE.dustyBlue },
  { x: 1380, y: 320, width: 160, height: 24 },
  { x: 1760, y: 356, width: 180, height: 24, color: MORANDI_PALETTE.warmBeige },
  { x: 2100, y: 308, width: 200, height: 24 },
]

type BlowGlassState = 'idle' | 'active' | 'success'

export class GlassStudioScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private glassMasterNpc?: CharacterMarker
  private glassMasterBoss?: CharacterMarker
  private blowGlassSprite?: Phaser.GameObjects.Sprite
  private imperfectBowl?: Phaser.GameObjects.Container
  private interactPrompt?: Phaser.GameObjects.Text
  private blowGlassHint?: Phaser.GameObjects.Text
  private cutsceneText?: Phaser.GameObjects.Text
  private bossCleared = false
  private bossEncounterReady = false
  private blowGlassState: BlowGlassState = 'idle'
  private blowGlassHits = 0
  private blowGlassPhase = 0
  private prefersTouchControls = false
  private furnaceMessageTimer?: Phaser.Time.TimerEvent
  private unsubscribeDialogueClosed?: () => void
  private unsubscribeBossDialogueDone?: () => void

  constructor() {
    super('GlassStudioScene')
  }

  create() {
    this.bossCleared = useGameStore.getState().glassChapterCleared
    this.bossEncounterReady = false
    this.blowGlassState = this.bossCleared ? 'success' : 'idle'
    this.blowGlassHits = 0
    this.blowGlassPhase = 0
    this.prefersTouchControls = shouldShowTouchControls(this)
    this.shards = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, 100, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMemoryShards()
    this.placeGlassMasterNpc()
    this.registerPropAnimations()
    this.placeFurnace()
    this.placeBlowGlassStation()
    this.placeGlassMasterBoss()

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

    this.blowGlassHint = this.add
      .text(BLOW_GLASS_X, 250, '', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        backgroundColor: 'rgba(248, 251, 249, 0.88)',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(16)

    this.cutsceneText = this.add
      .text(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.38, '', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '14px',
        align: 'center',
        backgroundColor: 'rgba(248, 251, 249, 0.9)',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(25)
      .setScrollFactor(0)

    this.add
      .text(16, 16, '第四章・玻璃工坊', {
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
        .text(this.scale.width / 2, 16, '← → 移動　Space 跳躍　Shift 衝刺　E 對話／互動', {
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
      message: '玻璃工坊章節已就緒。',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()

      if (this.bossEncounterReady && !this.bossCleared) {
        this.playImperfectBowlCutscene()
      }
    })

    this.unsubscribeBossDialogueDone = gameEventBus.on('boss:glass-master-understood', () => {
      this.bossEncounterReady = true
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
    this.updateBlowGlassMinigame(snap.talkJustDown)
    this.updateInteractPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.unsubscribeBossDialogueDone?.()
    this.furnaceMessageTimer?.destroy()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.1)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.55, WORLD_WIDTH, WORLD_HEIGHT * 0.7, MORANDI_PALETTE.skyBottom, 0.2)

    this.addCloud(180, 88, 0.86)
    this.addCloud(720, 64, 0.74)
    this.addCloud(1380, 96, 0.8)
    this.addCloud(2040, 72, 0.7)

    this.buildStudioWalls()
    this.buildWindowLight()

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.warmBeige, 0.42)
    ground.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.32)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 18, WORLD_WIDTH, 36, MORANDI_PALETTE.dustyBlue, 0.35)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildStudioWalls() {
    const backWall = this.add.rectangle(WORLD_WIDTH / 2, 180, WORLD_WIDTH, 220, MORANDI_PALETTE.cloud, 0.35)
    backWall.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.28)
    backWall.setDepth(-3)

    const beam = this.add.rectangle(WORLD_WIDTH / 2, 88, WORLD_WIDTH, 12, MORANDI_PALETTE.dustyBlue, 0.22)
    beam.setDepth(-2)
  }

  private buildWindowLight() {
    const windowX = 1260
    const windowFrame = this.add.rectangle(windowX, 148, 180, 120, WINDOW_GLOW, 0.55)
    windowFrame.setStrokeStyle(3, MORANDI_PALETTE.dustyBlue, 0.4)
    windowFrame.setDepth(-1)

    const windowGlow = this.add.rectangle(windowX, 260, 220, 180, WINDOW_GLOW, 0.12)
    windowGlow.setDepth(-1)

    this.tweens.add({
      targets: windowGlow,
      alpha: 0.2,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    STUDIO_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.cloud,
        0.88,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.3)
      group.add(rect)
    })

    return group
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 280, y: GROUND_TOP - 36 },
      { x: 420, y: 352 },
      { x: 700, y: 308 },
      { x: 900, y: GROUND_TOP - 36 },
      { x: 1040, y: 336 },
      { x: 1380, y: 280 },
      { x: 1680, y: GROUND_TOP - 36 },
      { x: 1760, y: 316 },
      { x: 2100, y: 268 },
      { x: 2380, y: GROUND_TOP - 36 },
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

  private placeGlassMasterNpc() {
    const container = this.add.container(MASTER_NPC_X, GROUND_TOP) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.glassMaster, GLASS_MASTER_FRAMES.sideIdle)
    sprite.setOrigin(0.5, 1).setScale(0.44)

    const label = this.add
      .text(0, 8, '玻璃師傅', {
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
    this.glassMasterNpc = container

    this.tweens.add({
      targets: sprite,
      y: -2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private registerPropAnimations() {
    if (!this.anims.exists('furnace-glow')) {
      this.anims.create({
        key: 'furnace-glow',
        frames: [
          { key: ASSET_KEYS.glassFurnace, frame: GLASS_FURNACE_FRAMES.glow1 },
          { key: ASSET_KEYS.glassFurnace, frame: GLASS_FURNACE_FRAMES.glow2 },
          { key: ASSET_KEYS.glassFurnace, frame: GLASS_FURNACE_FRAMES.glow3 },
          { key: ASSET_KEYS.glassFurnace, frame: GLASS_FURNACE_FRAMES.glow2 },
          { key: ASSET_KEYS.glassFurnace, frame: GLASS_FURNACE_FRAMES.glow1 },
        ],
        frameRate: 1.1,
        repeat: -1,
      })
    }

    if (!this.anims.exists('glass-blob-pulse')) {
      this.anims.create({
        key: 'glass-blob-pulse',
        frames: [
          { key: ASSET_KEYS.glassBlowStation, frame: GLASS_BLOW_STATION_FRAMES.blobPulse1 },
          { key: ASSET_KEYS.glassBlowStation, frame: GLASS_BLOW_STATION_FRAMES.blobPulse2 },
          { key: ASSET_KEYS.glassBlowStation, frame: GLASS_BLOW_STATION_FRAMES.blobPulse3 },
          { key: ASSET_KEYS.glassBlowStation, frame: GLASS_BLOW_STATION_FRAMES.blobPulse2 },
        ],
        frameRate: 3,
        repeat: -1,
      })
    }
  }

  private placeFurnace() {
    const sprite = this.add.sprite(FURNACE_X, GROUND_TOP - 20, ASSET_KEYS.glassFurnace, GLASS_FURNACE_FRAMES.idle)
    sprite.setOrigin(0.5, 1).setScale(0.58).setDepth(2)
    sprite.play('furnace-glow')
  }

  private placeBlowGlassStation() {
    const initialFrame =
      this.blowGlassState === 'success'
        ? GLASS_BLOW_STATION_FRAMES.blobSet
        : GLASS_BLOW_STATION_FRAMES.benchIdle

    const sprite = this.add.sprite(BLOW_GLASS_X, GROUND_TOP - 8, ASSET_KEYS.glassBlowStation, initialFrame)
    sprite.setOrigin(0.5, 1).setScale(0.58).setDepth(3)
    this.blowGlassSprite = sprite
  }

  private placeGlassMasterBoss() {
    this.registerGlassMasterBossAnimation()

    const container = this.add.container(BOSS_X, 320) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.glassMasterBoss, GLASS_MASTER_BOSS_FRAMES.idle)
    sprite.setOrigin(0.5, 1).setScale(0.48)
    sprite.setAlpha(this.bossCleared ? 0.35 : 1)
    sprite.play('glass-master-boss-glow')

    const label = this.add
      .text(0, 8, '玻璃師傅', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    container.add([sprite, label])
    container.sprite = sprite
    container.label = label
    this.glassMasterBoss = container
  }

  private registerGlassMasterBossAnimation() {
    if (this.anims.exists('glass-master-boss-glow')) {
      return
    }

    this.anims.create({
      key: 'glass-master-boss-glow',
      frames: [
        { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse1 },
        { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse2 },
        { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.pulse3 },
        { key: ASSET_KEYS.glassMasterBoss, frame: GLASS_MASTER_BOSS_FRAMES.idle },
      ],
      frameRate: 3,
      repeat: -1,
    })
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (this.isNearGlassMasterNpc()) {
      this.player.triggerTalk('glassMaster')
      return
    }

    if (this.isNearFurnace()) {
      this.showFurnaceMessage()
      return
    }

    if (!this.bossCleared && this.blowGlassState === 'success' && this.isNearGlassMasterBoss()) {
      this.player.triggerTalk('glassMasterBoss')
      return
    }

    if (!this.bossCleared && this.isNearBlowGlass() && this.blowGlassState === 'idle') {
      this.startBlowGlassMinigame()
    }
  }

  private startBlowGlassMinigame() {
    this.blowGlassState = 'active'
    this.blowGlassHits = 0
    this.blowGlassPhase = 0
    this.blowGlassSprite?.play('glass-blob-pulse')
    this.blowGlassHint?.setText(`${this.blowGlassTimingHint()}（0/3）`).setVisible(true)
  }

  private blowGlassTimingHint() {
    return `在光芒最亮時${formatInteractVerb(this.prefersTouchControls)}`
  }

  private updateBlowGlassMinigame(talkJustDown: boolean) {
    if (this.blowGlassState !== 'active' || !this.blowGlassSprite) {
      return
    }

    this.blowGlassPhase = (Math.sin(this.time.now / 380) + 1) / 2

    if (!talkJustDown || !this.isNearBlowGlass()) {
      return
    }

    if (this.blowGlassPhase >= BLOW_GLASS_TIMING_THRESHOLD) {
      this.blowGlassHits += 1
      this.blowGlassHint?.setText(
        `${this.blowGlassTimingHint()}（${this.blowGlassHits}/${BLOW_GLASS_TARGET_HITS}）`,
      )

      if (this.blowGlassHits >= BLOW_GLASS_TARGET_HITS) {
        this.completeBlowGlassMinigame()
      }

      return
    }

    this.blowGlassHits = 0
    this.blowGlassHint?.setText('溫柔呼吸，再試一次（0/3）')
  }

  private completeBlowGlassMinigame() {
    this.blowGlassState = 'success'
    this.blowGlassSprite?.stop()
    this.blowGlassSprite?.setFrame(GLASS_BLOW_STATION_FRAMES.blobSet)
    this.blowGlassHint?.setText('玻璃正屏住呼吸，去和玻璃師傅說話吧。').setVisible(true)

    this.time.delayedCall(3200, () => {
      this.blowGlassHint?.setVisible(false)
    })
  }

  private showFurnaceMessage() {
    if (!this.interactPrompt) {
      return
    }

    if (
      this.player &&
      this.player.playerState !== 'talk' &&
      this.player.playerState !== 'dash'
    ) {
      this.player.playEmote('happy')
    }

    this.interactPrompt.setText('爐火吐出溫暖而耐心的氣息。')
    this.interactPrompt.setPosition(FURNACE_X, GROUND_TOP - 130)
    this.interactPrompt.setVisible(true)

    this.furnaceMessageTimer?.destroy()
    this.furnaceMessageTimer = this.time.delayedCall(2200, () => {
      this.interactPrompt?.setVisible(false)
    })
  }

  private playImperfectBowlCutscene() {
    if (this.bossCleared || !this.player) {
      return
    }

    this.bossCleared = true
    this.bossEncounterReady = false

    const bowlX = BLOW_GLASS_X
    const bowlY = 300

    this.imperfectBowl = this.add.container(bowlX, bowlY)
    const bowlBody = this.add.ellipse(0, 0, 54, 38, GLASS_TUBE_BLUE, 0.55)
    bowlBody.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.5)
    const wobble = this.add.ellipse(8, -6, 20, 14, WINDOW_GLOW, 0.35)
    this.imperfectBowl.add([bowlBody, wobble])
    this.imperfectBowl.setScale(0.2)
    this.imperfectBowl.setAlpha(0)
    this.imperfectBowl.setDepth(12)

    this.player.playEmote('sad')

    this.tweens.add({
      targets: this.imperfectBowl,
      alpha: 1,
      scale: 1,
      duration: 1200,
      ease: 'Back.easeOut',
    })

    this.cutsceneText?.setText('碗出現了……\n但形狀還不太對。').setVisible(true)

    this.tweens.add({
      targets: this.glassMasterBoss,
      alpha: 0.35,
      duration: 1400,
      ease: 'Sine.easeInOut',
    })

    gameEventBus.emit('chapter:glass-cleared', { scene: this.scene.key })

    this.time.delayedCall(3600, () => {
      if (!this.scene.isActive()) {
        return
      }

      this.scene.start('RetryScene')
    })
  }

  private updateInteractPrompt() {
    if (!this.player || !this.interactPrompt) {
      return
    }

    let promptText: string | null = null
    this.glassMasterNpc?.label.setVisible(false)

    if (!this.bossCleared && this.blowGlassState === 'success' && this.isNearGlassMasterBoss()) {
      promptText = interactPrompt(this.prefersTouchControls, '與玻璃師傅完成這一步')
    } else if (!this.bossCleared && this.blowGlassState === 'active' && this.isNearBlowGlass()) {
      promptText = this.blowGlassTimingHint()
    } else if (!this.bossCleared && this.blowGlassState === 'idle' && this.isNearBlowGlass()) {
      promptText = interactPrompt(this.prefersTouchControls, '試著吹製玻璃')
    } else if (this.isNearFurnace()) {
      promptText = interactPrompt(this.prefersTouchControls, '感受溫暖爐火')
    } else if (this.isNearGlassMasterNpc()) {
      promptText = interactPrompt(this.prefersTouchControls, '與玻璃師傅對話')
      this.glassMasterNpc?.label.setVisible(true)
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
  }

  private isNearGlassMasterNpc() {
    if (!this.player || !this.glassMasterNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.glassMasterNpc.x, this.glassMasterNpc.y) <= INTERACT_RADIUS
  }

  private isNearFurnace() {
    if (!this.player) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, FURNACE_X, GROUND_TOP) <= INTERACT_RADIUS
  }

  private isNearBlowGlass() {
    if (!this.player || !this.blowGlassSprite) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.blowGlassSprite.x, this.blowGlassSprite.y) <= INTERACT_RADIUS + 12
  }

  private isNearGlassMasterBoss() {
    if (!this.player || !this.glassMasterBoss || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.glassMasterBoss.x, this.glassMasterBoss.y) <= INTERACT_RADIUS + 16
  }

  private addCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y)
    cloud.add([
      this.add.circle(-44 * scale, 8 * scale, 28 * scale, MORANDI_PALETTE.cloud, 0.82),
      this.add.circle(-12 * scale, -10 * scale, 38 * scale, MORANDI_PALETTE.cloud, 0.88),
      this.add.circle(30 * scale, 4 * scale, 30 * scale, MORANDI_PALETTE.cloud, 0.76),
      this.add.circle(60 * scale, 14 * scale, 20 * scale, MORANDI_PALETTE.cloud, 0.64),
    ])
  }
}
