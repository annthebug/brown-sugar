import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import {
  ASSET_KEYS,
  CITY_BARISTA_FRAMES,
  MORANDI_PALETTE,
  PARK_TRAVELER_FRAMES,
  TIME_MONSTER_FRAMES,
} from '../assets/assetManifest'
import { type CharacterMarker } from '../entities/CharacterSprite'
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
  private baristaNpc?: CharacterMarker
  private travelerNpc?: CharacterMarker
  private timeMonster?: CharacterMarker
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
      .text(16, 16, '第二章・城市', {
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
      message: '城市章節已就緒。',
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
      .text(PARK_X, GROUND_Y - 148, '公園', {
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
      .text(METRO_X, GROUND_Y - 168, '月台', {
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
    const baristaX = CAFE_X + 48
    const baristaY = GROUND_TOP

    const container = this.add.container(baristaX, baristaY) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.cityBarista, CITY_BARISTA_FRAMES.sideIdle)
    sprite.setOrigin(0.5, 1).setScale(0.44)

    const label = this.add
      .text(0, 8, '咖啡師', {
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
    this.baristaNpc = container

    this.tweens.add({
      targets: sprite,
      y: -2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private placeParkTraveler() {
    const travelerX = PARK_X
    const travelerY = GROUND_TOP

    const container = this.add.container(travelerX, travelerY) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.parkTraveler, PARK_TRAVELER_FRAMES.sideIdle)
    sprite.setOrigin(0.5, 1).setScale(0.44)

    const label = this.add
      .text(0, 8, '旅人', {
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
    this.travelerNpc = container

    this.tweens.add({
      targets: sprite,
      y: -2,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private placeTimeMonsterBoss() {
    const bossX = METRO_X + 80
    const bossY = 350

    this.registerTimeMonsterAnimation()

    const container = this.add.container(bossX, bossY) as CharacterMarker
    const sprite = this.add.sprite(0, 0, ASSET_KEYS.timeMonster, TIME_MONSTER_FRAMES.idle)
    sprite.setOrigin(0.5, 1).setScale(0.48)
    sprite.setAlpha(this.bossCleared ? 0.35 : 1)
    sprite.play('time-monster-pulse')

    const label = this.add
      .text(0, 8, '時間怪物', {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '11px',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    container.add([sprite, label])
    container.sprite = sprite
    container.label = label
    this.timeMonster = container
  }

  private registerTimeMonsterAnimation() {
    if (this.anims.exists('time-monster-pulse')) {
      return
    }

    this.anims.create({
      key: 'time-monster-pulse',
      frames: [
        { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse1 },
        { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse2 },
        { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.pulse3 },
        { key: ASSET_KEYS.timeMonster, frame: TIME_MONSTER_FRAMES.idle },
      ],
      frameRate: 3,
      repeat: -1,
    })
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
      this.interactPrompt?.setText('有什麼東西正沿著月台飄過去......')
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

    if (this.timeMonster) {
      this.tweens.add({
        targets: this.timeMonster.sprite,
        alpha: 0.35,
        y: '+=8',
        duration: 1400,
        ease: 'Sine.easeInOut',
      })
    }

    gameEventBus.emit('chapter:city-cleared', { scene: this.scene.key })

    this.time.delayedCall(2200, () => {
      if (!this.scene.isActive()) {
        return
      }

      this.scene.start('SnowMountainScene')
    })
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
      this.baristaNpc?.label.setVisible(false)
      this.travelerNpc?.label.setVisible(false)
      promptText = '按 E 遇見時間怪物'
    } else if (this.isNearBarista()) {
      this.baristaNpc?.label.setVisible(true)
      this.travelerNpc?.label.setVisible(false)
      promptText = '按 E 與咖啡師對話'
    } else if (this.isNearTraveler()) {
      this.baristaNpc?.label.setVisible(false)
      this.travelerNpc?.label.setVisible(true)
      promptText = '按 E 與旅人對話'
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
    this.baristaNpc?.label.setVisible(false)
    this.travelerNpc?.label.setVisible(false)
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
