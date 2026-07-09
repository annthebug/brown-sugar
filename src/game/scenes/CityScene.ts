import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import { audioService } from '../../services/audio'
import { ASSET_KEYS, MORANDI_PALETTE } from '../assets/assetManifest'
import { gameEventBus } from '../events/eventBus'
import { MemoryShard } from '../entities/MemoryShard'
import { Player } from '../entities/Player'
import { InputController } from '../input/InputController'
import { TouchControls } from '../input/TouchControls'

const WORLD_WIDTH = 2640
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

const CITY_PLATFORMS: PlatformSpec[] = [
  { x: 380, y: 392, width: 200, height: 26, color: MORANDI_PALETTE.warmBeige },
  { x: 720, y: 348, width: 160, height: 26 },
  { x: 1040, y: 376, width: 220, height: 26, color: MORANDI_PALETTE.sageGreen },
  { x: 1380, y: 320, width: 180, height: 26 },
  { x: 1720, y: 360, width: 200, height: 26, color: MORANDI_PALETTE.warmBeige },
  { x: 2060, y: 308, width: 240, height: 26 },
  { x: 2380, y: 340, width: 180, height: 26, color: MORANDI_PALETTE.dustyBlue },
]

const CAFE_X = 280
const PARK_X = 1180
const METRO_X = 2180

export class CityScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private baristaNpc?: Phaser.GameObjects.Container
  private travelerNpc?: Phaser.GameObjects.Container
  private timeMonster?: Phaser.GameObjects.Container
  private interactPrompt?: Phaser.GameObjects.Text
  private bossCleared = false
  private bossChaseActive = false
  private bossEncounterReady = false
  private unsubscribeDialogueClosed?: () => void
  private unsubscribeBossDialogueDone?: () => void

  constructor() {
    super('CityScene')
  }

  create() {
    this.bossCleared = useGameStore.getState().cityChapterCleared
    this.bossChaseActive = false
    this.bossEncounterReady = false
    this.shards = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, 100, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMemoryShards()
    this.placeCoffeeBarista()
    this.placeParkTraveler()
    this.placeTimeMonsterBoss()

    this.inputCtrl = new InputController(this)
    const isTouch = this.sys.game.device.input.touch
    this.touchCtrl = new TouchControls(this, this.inputCtrl)
    this.touchCtrl.setVisible(isTouch)

    this.player.setTalkHandler(() => {
      this.handleInteract()
    })

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setDeadzone(120, 40)

    this.interactPrompt = this.add
      .text(0, 0, 'Press E to talk', {
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
      .text(16, 16, 'Chapter 2 · City', {
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
      message: 'City chapter ready.',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()

      if (this.bossEncounterReady && !this.bossCleared) {
        this.completeBossEncounter()
      }
    })

    this.unsubscribeBossDialogueDone = gameEventBus.on('boss:time-monster-understood', () => {
      this.bossEncounterReady = true
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
    this.updateTimeMonsterChase(delta)
    this.updateInteractPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.unsubscribeBossDialogueDone?.()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
    audioService.stopBgm()
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.15)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.58, WORLD_WIDTH, WORLD_HEIGHT * 0.72, MORANDI_PALETTE.skyBottom, 0.2)

    this.addCloud(180, 88, 0.9)
    this.addCloud(620, 64, 0.76)
    this.addCloud(1180, 96, 0.82)
    this.addCloud(1780, 72, 0.7)
    this.addCloud(2340, 104, 0.86)

    this.buildCafeDistrict()
    this.buildParkDistrict()
    this.buildMetroDistrict()

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.dustyBlue, 0.38)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 18, WORLD_WIDTH, 36, MORANDI_PALETTE.warmBeige, 0.72)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildCafeDistrict() {
    const cafeBase = this.add.rectangle(CAFE_X, GROUND_Y - 88, 220, 140, MORANDI_PALETTE.warmBeige, 0.55)
    cafeBase.setStrokeStyle(2, MORANDI_PALETTE.mistPink, 0.45)

    const awning = this.add.rectangle(CAFE_X, GROUND_Y - 158, 200, 22, MORANDI_PALETTE.mistPink, 0.42)
    const windowGlow = this.add.rectangle(CAFE_X + 36, GROUND_Y - 108, 48, 52, MORANDI_PALETTE.warmBeige, 0.68)
    windowGlow.setStrokeStyle(2, MORANDI_PALETTE.cloud, 0.5)

    const sign = this.add
      .text(CAFE_X, GROUND_Y - 178, 'Café', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    ;[cafeBase, awning, windowGlow, sign].forEach((obj) => obj.setDepth(-2))
  }

  private buildParkDistrict() {
    const bench = this.add.rectangle(PARK_X - 40, GROUND_Y - 28, 90, 14, MORANDI_PALETTE.dustyBlue, 0.5)
    const treeTrunk = this.add.rectangle(PARK_X + 60, GROUND_Y - 52, 14, 48, MORANDI_PALETTE.dustyBlue, 0.4)
    const treeCrown = this.add.circle(PARK_X + 60, GROUND_Y - 88, 36, MORANDI_PALETTE.sageGreen, 0.52)
    const lamp = this.add.rectangle(PARK_X + 120, GROUND_Y - 72, 8, 56, MORANDI_PALETTE.warmBeige, 0.55)
    const lampGlow = this.add.circle(PARK_X + 120, GROUND_Y - 104, 14, MORANDI_PALETTE.warmBeige, 0.35)

    const sign = this.add
      .text(PARK_X, GROUND_Y - 148, 'Park', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    ;[bench, treeTrunk, treeCrown, lamp, lampGlow, sign].forEach((obj) => obj.setDepth(-2))
  }

  private buildMetroDistrict() {
    const stationWall = this.add.rectangle(METRO_X, GROUND_Y - 96, 260, 120, MORANDI_PALETTE.dustyBlue, 0.32)
    stationWall.setStrokeStyle(2, MORANDI_PALETTE.warmBeige, 0.4)

    const platformEdge = this.add.rectangle(METRO_X, GROUND_Y - 36, 240, 10, MORANDI_PALETTE.warmBeige, 0.5)
    const track = this.add.rectangle(METRO_X + 20, GROUND_Y - 8, 200, 6, 0x50676f, 0.18)

    for (let index = 0; index < 5; index += 1) {
      const railX = METRO_X - 80 + index * 40
      this.add.rectangle(railX, GROUND_Y - 14, 4, 18, MORANDI_PALETTE.cloud, 0.55).setDepth(-2)
    }

    const sign = this.add
      .text(METRO_X, GROUND_Y - 168, 'Metro', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    ;[stationWall, platformEdge, track, sign].forEach((obj) => obj.setDepth(-2))
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    CITY_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.dustyBlue,
        0.5,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.cloud, 0.45)
      group.add(rect)
    })

    return group
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 200, y: GROUND_TOP - 36 },
      { x: 380, y: 352 },
      { x: 620, y: GROUND_TOP - 36 },
      { x: 900, y: 308 },
      { x: 1180, y: 336 },
      { x: 1480, y: GROUND_TOP - 36 },
      { x: 1760, y: 324 },
      { x: 2060, y: 272 },
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

  private placeCoffeeBarista() {
    const npcX = CAFE_X + 48
    const npcY = GROUND_TOP

    this.baristaNpc = this.add.container(npcX, npcY)
    const apron = this.add.rectangle(0, -30, 44, 58, MORANDI_PALETTE.mistPink, 0.62)
    const head = this.add.circle(0, -68, 18, MORANDI_PALETTE.cloud, 0.9)
    const cup = this.add.rectangle(22, -38, 16, 22, MORANDI_PALETTE.warmBeige, 0.88)
    const label = this.add
      .text(0, 10, 'Barista', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.baristaNpc.add([apron, head, cup, label])
  }

  private placeParkTraveler() {
    const npcX = PARK_X
    const npcY = GROUND_TOP

    this.travelerNpc = this.add.container(npcX, npcY)
    const coat = this.add.rectangle(0, -32, 50, 62, MORANDI_PALETTE.sageGreen, 0.55)
    const scarf = this.add.rectangle(0, -54, 36, 12, MORANDI_PALETTE.mistPink, 0.5)
    const head = this.add.circle(0, -70, 18, MORANDI_PALETTE.cloud, 0.9)
    const map = this.add.rectangle(-24, -36, 20, 28, MORANDI_PALETTE.warmBeige, 0.75)
    const label = this.add
      .text(0, 10, 'Traveler', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.travelerNpc.add([coat, scarf, head, map, label])
  }

  private placeTimeMonsterBoss() {
    const bossX = METRO_X + 80
    const bossY = 318

    this.timeMonster = this.add.container(bossX, bossY)
    const body = this.add.ellipse(0, -36, 88, 108, MORANDI_PALETTE.dustyBlue, 0.28)
    body.setStrokeStyle(3, MORANDI_PALETTE.cloud, 0.72)
    const clockFace = this.add.circle(0, -48, 28, MORANDI_PALETTE.cloud, 0.55)
    const hourHand = this.add.rectangle(0, -54, 3, 18, MORANDI_PALETTE.dustyBlue, 0.85)
    const minuteHand = this.add.rectangle(8, -48, 3, 22, MORANDI_PALETTE.mistPink, 0.7)
    const label = this.add
      .text(0, 18, 'Time Monster', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    this.timeMonster.add([body, clockFace, hourHand, minuteHand, label])

    this.tweens.add({
      targets: hourHand,
      angle: 360,
      duration: 12000,
      repeat: -1,
      ease: 'Linear',
    })

    this.tweens.add({
      targets: minuteHand,
      angle: 360,
      duration: 4800,
      repeat: -1,
      ease: 'Linear',
    })

    if (this.bossCleared) {
      this.timeMonster.setAlpha(0.35)
    }
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (this.isNearBarista()) {
      this.player.triggerTalk('cityBarista')
      return
    }

    if (this.isNearTraveler()) {
      this.player.triggerTalk('cityTraveler')
      return
    }

    if (!this.bossCleared && this.isNearTimeMonster()) {
      this.player.triggerTalk('timeMonster')
    }
  }

  private updateTimeMonsterChase(delta: number) {
    if (!this.player || !this.timeMonster || this.bossCleared) {
      return
    }

    const playerPastPark = this.player.x >= PARK_X - 120

    if (!playerPastPark) {
      return
    }

    if (!this.bossChaseActive) {
      this.bossChaseActive = true
      this.interactPrompt?.setText('Something drifts along the metro platform...')
    }

    const monsterX = this.timeMonster.x
    const playerX = this.player.x
    const driftDirection = playerX > monsterX ? 1 : -1
    const driftSpeed = 28

    if (Math.abs(playerX - monsterX) > INTERACT_RADIUS - 20) {
      this.timeMonster.x += driftDirection * driftSpeed * (delta / 1000)
      this.timeMonster.x = Phaser.Math.Clamp(this.timeMonster.x, METRO_X - 60, METRO_X + 180)
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
      targets: this.timeMonster,
      alpha: 0.35,
      y: '+=8',
      duration: 1400,
      ease: 'Sine.easeInOut',
    })

    gameEventBus.emit('chapter:city-cleared', { scene: this.scene.key })
  }

  private updateInteractPrompt() {
    if (!this.player || !this.interactPrompt) {
      return
    }

    if (this.bossCleared && !this.isNearBarista() && !this.isNearTraveler()) {
      this.interactPrompt.setVisible(false)
      return
    }

    let promptText: string | null = null

    if (!this.bossCleared && this.isNearTimeMonster()) {
      promptText = 'Press E to meet Time Monster'
    } else if (this.isNearBarista()) {
      promptText = 'Press E to talk with Barista'
    } else if (this.isNearTraveler()) {
      promptText = 'Press E to talk with Traveler'
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
  }

  private isNearBarista() {
    if (!this.player || !this.baristaNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.baristaNpc.x, this.baristaNpc.y) <= INTERACT_RADIUS
  }

  private isNearTraveler() {
    if (!this.player || !this.travelerNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.travelerNpc.x, this.travelerNpc.y) <= INTERACT_RADIUS
  }

  private isNearTimeMonster() {
    if (!this.player || !this.timeMonster || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.timeMonster.x, this.timeMonster.y) <= INTERACT_RADIUS + 20
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
