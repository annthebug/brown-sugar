import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import {
  ASSET_KEYS,
  MORANDI_PALETTE,
  SNOW_GUIDE_FRAMES,
  SNOW_SPIRIT_FRAMES,
} from '../assets/assetManifest'
import { type CharacterMarker } from '../entities/CharacterSprite'
import { gameEventBus } from '../events/eventBus'
import { MemoryShard } from '../entities/MemoryShard'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { interactPrompt } from '../input/interactPrompt'
import { shouldShowTouchControls } from '../input/touchInputEnvironment'
import { TouchControls } from '../input/TouchControls'

const WORLD_WIDTH = 2760
const WORLD_HEIGHT = 540
const GROUND_Y = 484
const GROUND_HEIGHT = 112
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2
const INTERACT_RADIUS = 92
const FALL_RESPAWN_Y = WORLD_HEIGHT + 24

const GUIDE_X = 220
const SUMMIT_X = 2480

type PlatformSpec = {
  x: number
  y: number
  width: number
  height: number
  color?: number
}

const SNOW_PLATFORMS: PlatformSpec[] = [
  { x: 340, y: 396, width: 180, height: 24, color: 0xe8f2ef },
  { x: 620, y: 332, width: 140, height: 24, color: 0xe8f2ef },
  { x: 900, y: 368, width: 160, height: 24 },
  { x: 1180, y: 296, width: 130, height: 24, color: 0xe8f2ef },
  { x: 1480, y: 340, width: 120, height: 24 },
  { x: 1760, y: 276, width: 140, height: 24, color: 0xe8f2ef },
  { x: 2020, y: 320, width: 110, height: 24 },
  { x: 2280, y: 252, width: 160, height: 24, color: 0xe8f2ef },
  { x: 2520, y: 288, width: 200, height: 24 },
]

const CHECKPOINTS = [
  { x: 120, y: GROUND_TOP },
  { x: 620, y: 320 },
  { x: 1180, y: 284 },
  { x: 1760, y: 264 },
  { x: 2280, y: 240 },
]

export class SnowMountainScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private guideNpc?: CharacterMarker
  private snowSpirit?: CharacterMarker
  private spiritLight?: Phaser.GameObjects.Arc
  private interactPrompt?: Phaser.GameObjects.Text
  private bossCleared = false
  private bossEncounterReady = false
  private spiritTrailActive = false
  private checkpointIndex = 0
  private prefersTouchControls = false
  private checkpointZones: Phaser.GameObjects.Zone[] = []
  private snowflakeTimer?: Phaser.Time.TimerEvent
  private unsubscribeDialogueClosed?: () => void
  private unsubscribeBossDialogueDone?: () => void

  constructor() {
    super('SnowMountainScene')
  }

  create() {
    this.bossCleared = useGameStore.getState().snowChapterCleared
    this.bossEncounterReady = false
    this.spiritTrailActive = false
    this.checkpointIndex = 0
    this.prefersTouchControls = shouldShowTouchControls(this)
    this.shards = []
    this.checkpointZones = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.startSnowfall()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, CHECKPOINTS[0].x, CHECKPOINTS[0].y)
    this.physics.add.collider(this.player, this.platforms)

    this.placeCheckpointZones()
    this.placeMemoryShards()
    this.placeMountainGuide()
    this.placeSnowSpiritBoss()

    this.inputCtrl = new InputController(this)
    const isTouch = this.prefersTouchControls
    this.touchCtrl = new TouchControls(this, this.inputCtrl)
    this.touchCtrl.setVisible(isTouch)

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

    this.add
      .text(16, 16, '第三章・雪山', {
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
      message: '雪山章節已就緒。',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()

      if (this.bossEncounterReady && !this.bossCleared) {
        this.completeBossEncounter()
      }
    })

    this.unsubscribeBossDialogueDone = gameEventBus.on('boss:snow-spirit-understood', () => {
      this.bossEncounterReady = true
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
    this.checkFallRespawn()
    this.updateSpiritTrail(delta)
    this.updateInteractPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.unsubscribeBossDialogueDone?.()
    this.snowflakeTimer?.destroy()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
    this.checkpointZones.forEach((zone) => zone.destroy())
    this.checkpointZones = []
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.12)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.55, WORLD_WIDTH, WORLD_HEIGHT * 0.7, MORANDI_PALETTE.skyBottom, 0.18)

    this.addCloud(200, 82, 0.88)
    this.addCloud(680, 58, 0.74)
    this.addCloud(1320, 94, 0.8)
    this.addCloud(1980, 68, 0.72)
    this.addCloud(2520, 88, 0.84)

    this.buildGasshoVillage(520, GROUND_Y - 20)
    this.buildGasshoVillage(1540, GROUND_Y - 28)
    this.buildGasshoVillage(2340, GROUND_Y - 36)

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, 0xe8f2ef, 0.72)
    ground.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.35)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 18, WORLD_WIDTH, 36, 0xd8edf4, 0.65)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildGasshoVillage(x: number, groundY: number) {
    const house = this.add.container(x, groundY)

    const base = this.add.rectangle(0, -36, 72, 48, MORANDI_PALETTE.warmBeige, 0.42)
    const roof = this.add.triangle(0, -78, -52, -44, 52, -44, 0, -108, MORANDI_PALETTE.dustyBlue, 0.38)
    roof.setStrokeStyle(2, MORANDI_PALETTE.cloud, 0.45)

    house.add([base, roof])
    house.setDepth(-2)
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    SNOW_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.cloud,
        0.88,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.32)
      group.add(rect)
    })

    return group
  }

  private startSnowfall() {
    this.snowflakeTimer = this.time.addEvent({
      delay: 160,
      loop: true,
      callback: () => {
        const camera = this.cameras.main
        const x = Phaser.Math.Between(camera.scrollX - 20, camera.scrollX + camera.width + 20)
        const size = Phaser.Math.Between(1, 3)
        const flake = this.add.circle(x, camera.scrollY - 12, size, MORANDI_PALETTE.cloud, 0.55)
        flake.setDepth(5)
        flake.setScrollFactor(0.92)

        this.tweens.add({
          targets: flake,
          y: flake.y + Phaser.Math.Between(280, 420),
          x: x + Phaser.Math.Between(-24, 24),
          alpha: 0,
          duration: Phaser.Math.Between(3200, 5200),
          ease: 'Sine.easeInOut',
          onComplete: () => flake.destroy(),
        })
      },
    })
  }

  private placeCheckpointZones() {
    CHECKPOINTS.forEach((checkpoint, index) => {
      if (index === 0) {
        return
      }

      const zone = this.add.zone(checkpoint.x, checkpoint.y, 80, 80)
      this.physics.add.existing(zone, true)

      if (this.player) {
        this.physics.add.overlap(this.player, zone, () => {
          if (index > this.checkpointIndex) {
            this.checkpointIndex = index
          }
        })
      }

      this.checkpointZones.push(zone)
    })
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 280, y: GROUND_TOP - 36 },
      { x: 340, y: 356 },
      { x: 620, y: 292 },
      { x: 900, y: 328 },
      { x: 1180, y: 256 },
      { x: 1480, y: 300 },
      { x: 1760, y: 236 },
      { x: 2020, y: 280 },
      { x: 2280, y: 212 },
      { x: 2520, y: 248 },
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

  private placeMountainGuide() {
    const container = this.add.container(GUIDE_X, GROUND_TOP) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.snowGuide, SNOW_GUIDE_FRAMES.sideIdle)
    sprite.setOrigin(0.5, 1).setScale(0.44)

    const label = this.add
      .text(0, 8, '嚮導', {
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
    this.guideNpc = container

    this.tweens.add({
      targets: sprite,
      y: -2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private placeSnowSpiritBoss() {
    const bossX = SUMMIT_X
    const bossY = 300

    this.spiritLight = this.add.circle(bossX - 120, bossY - 20, 14, MORANDI_PALETTE.warmBeige, 0.42)
    this.spiritLight.setStrokeStyle(2, MORANDI_PALETTE.cloud, 0.7)
    this.spiritLight.setDepth(4)

    this.tweens.add({
      targets: this.spiritLight,
      alpha: 0.75,
      scale: 1.15,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.registerSnowSpiritAnimation()

    const container = this.add.container(bossX, bossY) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.snowSpirit, SNOW_SPIRIT_FRAMES.idle)
    sprite.setOrigin(0.5, 1).setScale(0.48)
    sprite.setAlpha(this.bossCleared ? 0.35 : 1)
    sprite.play('snow-spirit-pulse')

    const label = this.add
      .text(0, 8, '雪靈', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    container.add([sprite, label])
    container.sprite = sprite
    container.label = label
    this.snowSpirit = container

    if (this.bossCleared) {
      this.spiritLight?.setAlpha(0.2)
    }
  }

  private registerSnowSpiritAnimation() {
    if (this.anims.exists('snow-spirit-pulse')) {
      return
    }

    this.anims.create({
      key: 'snow-spirit-pulse',
      frames: [
        { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse1 },
        { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse2 },
        { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.pulse3 },
        { key: ASSET_KEYS.snowSpirit, frame: SNOW_SPIRIT_FRAMES.idle },
      ],
      frameRate: 3,
      repeat: -1,
    })
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (this.isNearGuide()) {
      this.player.triggerTalk('snowSpirit')
      return
    }

    if (!this.bossCleared && this.isNearSnowSpirit()) {
      this.player.triggerTalk('snowSpiritBoss')
    }
  }

  private checkFallRespawn() {
    if (!this.player || this.player.y < FALL_RESPAWN_Y) {
      return
    }

    const checkpoint = CHECKPOINTS[this.checkpointIndex]
    const body = this.player.body as Phaser.Physics.Arcade.Body

    this.player.setPosition(checkpoint.x, checkpoint.y)
    body.setVelocity(0, 0)
    body.reset(checkpoint.x, checkpoint.y)
  }

  private updateSpiritTrail(delta: number) {
    if (!this.player || !this.spiritLight || !this.snowSpirit || this.bossCleared) {
      return
    }

    const playerPastMid = this.player.x >= 1180

    if (!playerPastMid) {
      return
    }

    if (!this.spiritTrailActive) {
      this.spiritTrailActive = true
    }

    const targetX = this.snowSpirit.x - 100
    const targetY = this.snowSpirit.y - 18
    const drift = 42 * (delta / 1000)

    if (Phaser.Math.Distance.Between(this.spiritLight.x, this.spiritLight.y, targetX, targetY) > 12) {
      const angle = Phaser.Math.Angle.Between(this.spiritLight.x, this.spiritLight.y, targetX, targetY)
      this.spiritLight.x += Math.cos(angle) * drift
      this.spiritLight.y += Math.sin(angle) * drift
    }
  }

  private completeBossEncounter() {
    if (this.bossCleared || !this.player) {
      return
    }

    this.bossCleared = true
    this.bossEncounterReady = false
    this.player.playEmote('happy')

    this.tweens.add({
      targets: [this.snowSpirit, this.spiritLight],
      alpha: 0.35,
      duration: 1400,
      ease: 'Sine.easeInOut',
    })

    gameEventBus.emit('chapter:snow-cleared', { scene: this.scene.key })

    this.time.delayedCall(2200, () => {
      if (!this.scene.isActive()) {
        return
      }

      this.scene.start('GlassStudioScene')
    })
  }

  private updateInteractPrompt() {
    if (!this.player || !this.interactPrompt) {
      return
    }

    let promptText: string | null = null
    this.guideNpc?.label.setVisible(false)

    if (!this.bossCleared && this.isNearSnowSpirit()) {
      promptText = interactPrompt(this.prefersTouchControls, '遇見雪靈')
    } else if (this.isNearGuide()) {
      promptText = interactPrompt(this.prefersTouchControls, '與雪山嚮導對話')
      this.guideNpc?.label.setVisible(true)
    } else if (this.spiritTrailActive && !this.bossCleared) {
      promptText = '跟著靈光前進'
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
  }

  private isNearGuide() {
    if (!this.player || !this.guideNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.guideNpc.x, this.guideNpc.y) <= INTERACT_RADIUS
  }

  private isNearSnowSpirit() {
    if (!this.player || !this.snowSpirit || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.snowSpirit.x, this.snowSpirit.y) <= INTERACT_RADIUS + 16
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
