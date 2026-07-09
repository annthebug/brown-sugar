import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import { audioService } from '../../services/audio'
import { ASSET_KEYS, BLACK_SUGAR_FRAMES, MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import { MemoryShard } from '../entities/MemoryShard'
import { PatrolCritter } from '../entities/PatrolCritter'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { TouchControls } from '../input/TouchControls'

const WORLD_WIDTH = 2520
const WORLD_HEIGHT = 540
const GROUND_Y = 484
const GROUND_HEIGHT = 112
const GROUND_TOP = GROUND_Y - GROUND_HEIGHT / 2
const INTERACT_RADIUS = 92

type PlatformSpec = {
  x: number
  y: number
  width: number
  height: number
  color?: number
}

const FOREST_PLATFORMS: PlatformSpec[] = [
  { x: 420, y: 392, width: 220, height: 28 },
  { x: 760, y: 332, width: 180, height: 28 },
  { x: 1080, y: 368, width: 240, height: 28 },
  { x: 1420, y: 300, width: 180, height: 28 },
  { x: 1760, y: 352, width: 200, height: 28 },
  { x: 2140, y: 312, width: 280, height: 28 },
]

export class ForestScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private critters: PatrolCritter[] = []
  private elderNpc?: Phaser.GameObjects.Container
  private bossJar?: Phaser.GameObjects.Container
  private bossPrompt?: Phaser.GameObjects.Text
  private bossCleared = false
  private unsubscribeDialogueClosed?: () => void

  constructor() {
    super('ForestScene')
  }

  create() {
    this.bossCleared = useGameStore.getState().forestChapterCleared
    this.shards = []
    this.critters = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, 120, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMemoryShards()
    this.placeForestElder()
    this.placePatrolCritters()
    this.placeGiantJarBoss()

    if (this.bossCleared) {
      this.bossPrompt?.setText('The Giant Jar already shared its gentle lesson.').setVisible(false)
    }

    this.inputCtrl = new InputController(this)
    const isTouch = this.sys.game.device.input.touch
    this.touchCtrl = new TouchControls(this, this.inputCtrl)
    this.touchCtrl.setVisible(isTouch)

    this.player.setTalkHandler(() => {
      this.handleInteract()
    })

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setDeadzone(120, 40)

    this.add
      .text(16, 16, 'Chapter 1 · Forest', {
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
        .text(this.scale.width / 2, 16, '← → Move   Space Jump   Shift Dash   E Talk / Interact', {
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
      message: 'Forest chapter ready.',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()
    })

    audioService.init()
    audioService.playBgm('forest')
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
    this.critters.forEach((critter) => critter.update())
    this.updateBossPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
    audioService.stopBgm()
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.2)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.62, WORLD_WIDTH, WORLD_HEIGHT * 0.76, MORANDI_PALETTE.skyBottom, 0.24)

    for (let index = 0; index < 9; index += 1) {
      const x = 140 + index * 280
      const scale = 0.7 + (index % 3) * 0.12
      this.addTreeSilhouette(x, GROUND_Y - 18, scale)
    }

    this.addCloud(220, 96, 1)
    this.addCloud(760, 72, 0.86)
    this.addCloud(1380, 110, 0.72)
    this.addCloud(2060, 84, 0.92)

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.sageGreen)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 18, WORLD_WIDTH, 36, MORANDI_PALETTE.warmBeige, 0.82)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    FOREST_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.sageGreen,
        0.94,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.warmBeige, 0.55)
      group.add(rect)
    })

    return group
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 260, y: GROUND_TOP - 36 },
      { x: 420, y: 352 },
      { x: 700, y: 292 },
      { x: 980, y: 328 },
      { x: 1280, y: GROUND_TOP - 36 },
      { x: 1520, y: 260 },
      { x: 1860, y: GROUND_TOP - 36 },
      { x: 2140, y: 272 },
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

  private placeForestElder() {
    const elderX = 1080
    const elderY = 354

    this.elderNpc = this.add.container(elderX, elderY)
    const robe = this.add.rectangle(0, -34, 54, 68, MORANDI_PALETTE.dustyBlue, 0.82)
    const hood = this.add.circle(0, -72, 22, MORANDI_PALETTE.cloud, 0.92)
    const staff = this.add.rectangle(28, -28, 8, 72, MORANDI_PALETTE.warmBeige, 0.95)
    const label = this.add
      .text(0, 12, 'Forest Elder', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.elderNpc.add([robe, hood, staff, label])

    this.add
      .sprite(elderX, elderY - 4, ASSET_KEYS.blackSugar, BLACK_SUGAR_FRAMES.frontIdle)
      .setOrigin(0.5, 1)
      .setScale(0.34)
      .setAlpha(0.22)
  }

  private placePatrolCritters() {
    const critterSpecs = [
      {
        kind: 'yarnBall' as const,
        x: 520,
        y: GROUND_TOP,
        patrolMinX: 360,
        patrolMaxX: 760,
      },
      {
        kind: 'cardboardBox' as const,
        x: 1420,
        y: 286,
        patrolMinX: 1320,
        patrolMaxX: 1520,
      },
      {
        kind: 'yarnBall' as const,
        x: 1880,
        y: GROUND_TOP,
        patrolMinX: 1680,
        patrolMaxX: 2140,
      },
    ]

    critterSpecs.forEach((spec) => {
      const critter = new PatrolCritter(this, spec)
      this.critters.push(critter)

      if (this.platforms) {
        this.physics.add.collider(critter, this.platforms)
      }

      if (this.player) {
        this.physics.add.overlap(this.player, critter, () => {
          critter.bumpPlayer(this.player as Player)
        })
      }
    })
  }

  private placeGiantJarBoss() {
    const jarX = 2280
    const jarY = 298

    this.bossJar = this.add.container(jarX, jarY)
    const jarBody = this.add.ellipse(0, -42, 120, 148, MORANDI_PALETTE.dustyBlue, 0.35)
    jarBody.setStrokeStyle(4, MORANDI_PALETTE.cloud, 0.88)
    const jarLid = this.add.rectangle(0, -118, 84, 18, MORANDI_PALETTE.warmBeige, 0.92)
    const label = this.add
      .text(0, 24, 'Giant Jar', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.bossJar.add([jarBody, jarLid, label])

    this.bossPrompt = this.add
      .text(jarX, jarY - 150, 'Press E to share a gentle moment', {
        color: MORANDI_PALETTE.mutedText,
        fontFamily: 'monospace',
        fontSize: '12px',
        backgroundColor: 'rgba(248, 251, 249, 0.82)',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setVisible(false)
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (!this.bossCleared && this.isNearBoss()) {
      this.completeBossEncounter()
      return
    }

    if (this.isNearElder()) {
      this.player.triggerTalk('forestElder')
    }
  }

  private completeBossEncounter() {
    if (this.bossCleared || !this.player) {
      return
    }

    this.bossCleared = true
    this.player.playEmote('happy')

    this.bossPrompt?.setText('The jar hums softly. The forest path opens.').setVisible(true)

    this.tweens.add({
      targets: this.bossJar,
      y: '+=6',
      duration: 900,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
    })

    gameEventBus.emit('chapter:forest-cleared', { scene: this.scene.key })

    this.time.delayedCall(2200, () => {
      if (!this.scene.isActive()) {
        return
      }

      this.scene.start('CityScene')
    })
  }

  private updateBossPrompt() {
    if (!this.player || !this.bossPrompt) {
      return
    }

    if (this.bossCleared) {
      return
    }

    const nearBoss = this.isNearBoss()
    const nearElder = this.isNearElder()

    if (nearBoss) {
      this.bossPrompt.setPosition(this.player.x, this.player.y - 88)
      this.bossPrompt.setText('Press E to understand the Giant Jar')
      this.bossPrompt.setVisible(true)
      return
    }

    if (nearElder) {
      this.bossPrompt.setPosition(this.player.x, this.player.y - 88)
      this.bossPrompt.setText('Press E to talk with Forest Elder')
      this.bossPrompt.setVisible(true)
      return
    }

    this.bossPrompt.setVisible(false)
  }

  private isNearElder() {
    if (!this.player || !this.elderNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.elderNpc.x, this.elderNpc.y) <= INTERACT_RADIUS
  }

  private isNearBoss() {
    if (!this.player || !this.bossJar || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bossJar.x, this.bossJar.y) <= INTERACT_RADIUS + 24
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

  private addTreeSilhouette(x: number, groundY: number, scale: number) {
    const trunk = this.add.rectangle(x, groundY - 36 * scale, 18 * scale, 72 * scale, MORANDI_PALETTE.dustyBlue, 0.42)
    const crown = this.add.circle(x, groundY - 88 * scale, 42 * scale, MORANDI_PALETTE.sageGreen, 0.58)
    trunk.setDepth(-1)
    crown.setDepth(-1)
  }
}
