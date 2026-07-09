import Phaser from 'phaser'
import { useGameStore } from '../../stores/useGameStore'
import { ASSET_KEYS, BOSS_FRAMES, MORANDI_PALETTE, NPC_FRAMES } from '../assets/assetManifest'
import { placeCharacterSprite, type CharacterMarker } from '../entities/CharacterSprite'
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
const MATERIAL_TARGET = 5
const GLASS_BLUE = 0xb8d4e8

const INNER_GUIDE_X = 220
const INNER_DOUBT_X = 2440

type PlatformSpec = {
  x: number
  y: number
  width: number
  height: number
  color?: number
}

type MaterialSpec = {
  id: string
  x: number
  y: number
  label: string
  mode: 'overlap' | 'interact' | 'meow'
}

const RETRY_PLATFORMS: PlatformSpec[] = [
  { x: 420, y: 392, width: 160, height: 22, color: MORANDI_PALETTE.dustyBlue },
  { x: 760, y: 340, width: 140, height: 22 },
  { x: 1120, y: 368, width: 180, height: 22, color: MORANDI_PALETTE.sageGreen },
  { x: 1480, y: 312, width: 150, height: 22 },
  { x: 1840, y: 348, width: 170, height: 22, color: MORANDI_PALETTE.dustyBlue },
  { x: 2200, y: 296, width: 200, height: 22 },
]

const MATERIALS: MaterialSpec[] = [
  { id: 'sand', x: 460, y: GROUND_TOP - 20, label: '柔軟細沙', mode: 'overlap' },
  { id: 'crystal', x: 760, y: 308, label: '淡色水晶', mode: 'interact' },
  { id: 'fiber', x: 1120, y: 336, label: '玻璃纖維', mode: 'overlap' },
  { id: 'ember', x: 1480, y: 280, label: '溫暖餘燼', mode: 'interact' },
  { id: 'whisper', x: 1980, y: GROUND_TOP - 24, label: '隱藏低語', mode: 'meow' },
]

export class RetryScene extends Phaser.Scene {
  private player?: Player
  private inputCtrl?: InputController
  private touchCtrl?: TouchControls
  private platforms?: Phaser.Physics.Arcade.StaticGroup
  private shards: MemoryShard[] = []
  private innerGuideNpc?: CharacterMarker
  private innerDoubtBoss?: CharacterMarker
  private interactPrompt?: Phaser.GameObjects.Text
  private progressText?: Phaser.GameObjects.Text
  private cutsceneText?: Phaser.GameObjects.Text
  private trueBowl?: Phaser.GameObjects.Container
  private materialSprites = new Map<string, Phaser.GameObjects.Container>()
  private materialZones: Phaser.GameObjects.Zone[] = []
  private collectedMaterials = new Set<string>()
  private meowMaterialRevealed = false
  private bossCleared = false
  private bossEncounterReady = false
  private bossUnlocked = false
  private unsubscribeDialogueClosed?: () => void
  private unsubscribeBossDialogueDone?: () => void
  private unsubscribeMeow?: () => void

  constructor() {
    super('RetryScene')
  }

  create() {
    this.bossCleared = useGameStore.getState().retryChapterCleared
    this.bossEncounterReady = false
    this.bossUnlocked = this.bossCleared
    this.collectedMaterials = new Set()
    this.materialSprites = new Map()
    this.materialZones = []
    this.meowMaterialRevealed = false
    this.shards = []

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.setBackgroundColor(MORANDI_PALETTE.skyTop)

    this.buildBackground()
    this.platforms = this.buildPlatforms()
    this.player = new Player(this, 100, GROUND_TOP)
    this.physics.add.collider(this.player, this.platforms)

    this.placeMaterials()
    this.placeMemoryShards()
    this.placeInnerGuide()
    this.placeInnerDoubtBoss()

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

    this.progressText = this.add
      .text(this.scale.width - 16, 16, `材料 0 / ${MATERIAL_TARGET}`, {
        color: MORANDI_PALETTE.slateText,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
        backgroundColor: 'rgba(248, 251, 249, 0.82)',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(20)

    this.cutsceneText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.38, '', {
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
      .text(16, 16, '第五章・再試一次', {
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
      message: '再試一次章節已就緒。',
    })

    this.unsubscribeDialogueClosed = gameEventBus.on('dialogue:closed', () => {
      this.player?.endTalk()

      if (this.bossEncounterReady && !this.bossCleared) {
        this.playTrueBowlCutscene()
      }
    })

    this.unsubscribeBossDialogueDone = gameEventBus.on('boss:inner-doubt-understood', () => {
      this.bossEncounterReady = true
    })

    this.unsubscribeMeow = gameEventBus.on('player:meow', (payload) => {
      this.handleMeowNearMaterial(payload.x, payload.y)
    })
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.inputCtrl) {
      return
    }

    const snap = this.inputCtrl.snapshot()
    this.player.update(snap, delta)
    this.updateMaterialOverlaps()
    this.updateInteractPrompt()
  }

  shutdown() {
    this.unsubscribeDialogueClosed?.()
    this.unsubscribeBossDialogueDone?.()
    this.unsubscribeMeow?.()
    this.player?.setTalkHandler(null)
    this.inputCtrl?.destroy()
    this.touchCtrl?.destroy()
    this.materialZones.forEach((zone) => zone.destroy())
    this.materialZones = []
  }

  private buildBackground() {
    const sky = this.add
      .tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, ASSET_KEYS.paleBlueSky)
      .setOrigin(0, 0)
      .setScrollFactor(0.08)

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT * 0.52, WORLD_WIDTH, WORLD_HEIGHT * 0.75, MORANDI_PALETTE.skyBottom, 0.24)

    this.addCloud(220, 92, 0.82)
    this.addCloud(980, 68, 0.7)
    this.addCloud(1760, 104, 0.76)

    const mistBand = this.add.rectangle(WORLD_WIDTH / 2, 220, WORLD_WIDTH, 180, MORANDI_PALETTE.dustyBlue, 0.08)
    mistBand.setDepth(-2)

    const ground = this.add.rectangle(WORLD_WIDTH / 2, GROUND_Y, WORLD_WIDTH, GROUND_HEIGHT, MORANDI_PALETTE.dustyBlue, 0.28)
    ground.setStrokeStyle(2, MORANDI_PALETTE.sageGreen, 0.28)
    this.physics.add.existing(ground, true)
    ;(ground.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject()
    this.platforms = this.physics.add.staticGroup([ground])

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 18, WORLD_WIDTH, 36, MORANDI_PALETTE.cloud, 0.55)

    sky.setSize(WORLD_WIDTH, WORLD_HEIGHT)
  }

  private buildPlatforms() {
    const group = this.platforms ?? this.physics.add.staticGroup()

    RETRY_PLATFORMS.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x,
        platform.y,
        platform.width,
        platform.height,
        platform.color ?? MORANDI_PALETTE.cloud,
        0.72,
      )
      rect.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.28)
      group.add(rect)
    })

    return group
  }

  private placeMaterials() {
    MATERIALS.forEach((material) => {
      const container = this.add.container(material.x, material.y)
      const body = this.add.rectangle(0, 0, 22, 22, GLASS_BLUE, 0.5)
      body.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.45)
      const sparkle = this.add.circle(0, -10, 4, MORANDI_PALETTE.warmBeige, 0.55)
      container.add([body, sparkle])
      container.setDepth(4)

      if (material.mode === 'meow') {
        container.setAlpha(0)
        container.setVisible(false)
      }

      this.materialSprites.set(material.id, container)

      if (material.mode === 'overlap' || material.mode === 'meow') {
        const zone = this.add.zone(material.x, material.y, 64, 64)
        this.physics.add.existing(zone, true)
        this.materialZones.push(zone)
      }
    })
  }

  private placeMemoryShards() {
    const shardPositions = [
      { x: 340, y: GROUND_TOP - 36 },
      { x: 620, y: 296 },
      { x: 980, y: GROUND_TOP - 36 },
      { x: 1320, y: 280 },
      { x: 1680, y: GROUND_TOP - 36 },
      { x: 2060, y: 256 },
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

  private placeInnerGuide() {
    this.innerGuideNpc = placeCharacterSprite(this, INNER_GUIDE_X, GROUND_TOP, {
      atlas: 'npc',
      frame: NPC_FRAMES.innerVoice,
      label: '內在嚮導',
      scale: 0.9,
    })
  }

  private placeInnerDoubtBoss() {
    this.innerDoubtBoss = placeCharacterSprite(this, INNER_DOUBT_X, 308, {
      atlas: 'boss',
      frame: BOSS_FRAMES.innerDoubt,
      label: '內在懷疑',
      scale: 1,
      alpha: this.bossCleared ? 0.3 : this.bossUnlocked ? 1 : 0.45,
    })
  }

  private handleInteract() {
    if (!this.player) {
      return
    }

    if (this.isNearInnerGuide()) {
      this.player.triggerTalk('innerGuide')
      return
    }

    const interactMaterial = this.getNearbyInteractMaterial()
    if (interactMaterial) {
      this.collectMaterial(interactMaterial.id)
      return
    }

    if (this.bossUnlocked && !this.bossCleared && this.isNearInnerDoubt()) {
      this.player.triggerTalk('innerDoubtBoss')
    }
  }

  private handleMeowNearMaterial(playerX: number, playerY: number) {
    const whisper = MATERIALS.find((material) => material.mode === 'meow')
    if (!whisper || this.meowMaterialRevealed || this.collectedMaterials.has(whisper.id)) {
      return
    }

    const distance = Phaser.Math.Distance.Between(playerX, playerY, whisper.x, whisper.y)
    if (distance > INTERACT_RADIUS + 24) {
      return
    }

    this.meowMaterialRevealed = true
    const sprite = this.materialSprites.get(whisper.id)
    if (!sprite) {
      return
    }

    sprite.setVisible(true)
    this.tweens.add({
      targets: sprite,
      alpha: 1,
      y: sprite.y - 8,
      duration: 700,
      ease: 'Sine.easeOut',
    })
  }

  private updateMaterialOverlaps() {
    if (!this.player) {
      return
    }

    MATERIALS.filter((material) => material.mode === 'overlap').forEach((material) => {
      if (this.collectedMaterials.has(material.id)) {
        return
      }

      const distance = Phaser.Math.Distance.Between(this.player!.x, this.player!.y, material.x, material.y)
      if (distance <= INTERACT_RADIUS - 20) {
        this.collectMaterial(material.id)
      }
    })

    const whisper = MATERIALS.find((material) => material.mode === 'meow')
    if (
      whisper &&
      this.meowMaterialRevealed &&
      !this.collectedMaterials.has(whisper.id) &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, whisper.x, whisper.y) <= INTERACT_RADIUS - 20
    ) {
      this.collectMaterial(whisper.id)
    }
  }

  private getNearbyInteractMaterial() {
    if (!this.player) {
      return null
    }

    return (
      MATERIALS.find((material) => {
        if (material.mode !== 'interact' || this.collectedMaterials.has(material.id)) {
          return false
        }

        return Phaser.Math.Distance.Between(this.player!.x, this.player!.y, material.x, material.y) <= INTERACT_RADIUS
      }) ?? null
    )
  }

  private collectMaterial(materialId: string) {
    if (this.collectedMaterials.has(materialId)) {
      return
    }

    this.collectedMaterials.add(materialId)
    const sprite = this.materialSprites.get(materialId)

    if (sprite) {
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        y: sprite.y - 24,
        duration: 500,
        ease: 'Sine.easeIn',
        onComplete: () => sprite.destroy(),
      })
    }

    this.updateMaterialProgress()

    if (this.collectedMaterials.size >= MATERIAL_TARGET && !this.bossUnlocked) {
      this.unlockBoss()
    }
  }

  private updateMaterialProgress() {
    this.progressText?.setText(`材料 ${this.collectedMaterials.size} / ${MATERIAL_TARGET}`)
  }

  private unlockBoss() {
    this.bossUnlocked = true
    this.innerDoubtBoss?.setAlpha(1)

    this.cutsceneText
      ?.setText('All materials gathered.\nInner Doubt waits at the far edge.')
      .setVisible(true)

    this.time.delayedCall(2800, () => {
      this.cutsceneText?.setVisible(false)
    })
  }

  private playTrueBowlCutscene() {
    if (this.bossCleared || !this.player) {
      return
    }

    this.bossCleared = true
    this.bossEncounterReady = false
    this.player.playEmote('happy')

    const bowlX = INNER_DOUBT_X - 80
    const bowlY = 300

    this.trueBowl = this.add.container(bowlX, bowlY)
    const bowlBody = this.add.ellipse(0, 0, 58, 40, GLASS_BLUE, 0.62)
    bowlBody.setStrokeStyle(2, MORANDI_PALETTE.dustyBlue, 0.55)
    const shine = this.add.ellipse(-10, -8, 18, 10, MORANDI_PALETTE.cloud, 0.45)
    this.trueBowl.add([bowlBody, shine])
    this.trueBowl.setScale(0.2)
    this.trueBowl.setAlpha(0)
    this.trueBowl.setDepth(12)

    this.tweens.add({
      targets: this.trueBowl,
      alpha: 1,
      scale: 1,
      duration: 1400,
      ease: 'Back.easeOut',
    })

    this.cutsceneText
      ?.setText('The true glass bowl takes shape —\ngentle, clear, and whole.')
      .setVisible(true)

    this.tweens.add({
      targets: this.innerDoubtBoss,
      alpha: 0.25,
      duration: 1400,
      ease: 'Sine.easeInOut',
    })

    gameEventBus.emit('chapter:retry-cleared', { scene: this.scene.key })

    this.time.delayedCall(3600, () => {
      if (!this.scene.isActive()) {
        return
      }

      this.scene.start('FinalScene')
    })
  }

  private updateInteractPrompt() {
    if (!this.player || !this.interactPrompt) {
      return
    }

    let promptText: string | null = null

    if (this.bossUnlocked && !this.bossCleared && this.isNearInnerDoubt()) {
      promptText = '按 E 面對內在懷疑'
    } else if (this.getNearbyInteractMaterial()) {
      promptText = '按 E 收集材料'
    } else if (this.isNearInnerGuide()) {
      promptText = '按 E 聆聽內在嚮導'
    } else {
      const whisper = MATERIALS.find((material) => material.mode === 'meow')
      if (
        whisper &&
        !this.meowMaterialRevealed &&
        !this.collectedMaterials.has(whisper.id) &&
        Phaser.Math.Distance.Between(this.player.x, this.player.y, whisper.x, whisper.y) <= INTERACT_RADIUS + 20
      ) {
        promptText = '按 M 喵叫——也許會有回應'
      }
    }

    if (promptText) {
      this.interactPrompt.setPosition(this.player.x, this.player.y - 88)
      this.interactPrompt.setText(promptText)
      this.interactPrompt.setVisible(true)
      return
    }

    this.interactPrompt.setVisible(false)
  }

  private isNearInnerGuide() {
    if (!this.player || !this.innerGuideNpc) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.innerGuideNpc.x, this.innerGuideNpc.y) <= INTERACT_RADIUS
  }

  private isNearInnerDoubt() {
    if (!this.player || !this.innerDoubtBoss || this.bossCleared) {
      return false
    }

    return Phaser.Math.Distance.Between(this.player.x, this.player.y, this.innerDoubtBoss.x, this.innerDoubtBoss.y) <= INTERACT_RADIUS + 16
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
