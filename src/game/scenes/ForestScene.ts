import Phaser from 'phaser';
import { Player } from '@/game/objects/Player';
import { Critter, type CritterKind } from '@/game/objects/Critter';
import { Npc } from '@/game/objects/Npc';
import { GiantCanBoss } from '@/game/objects/GiantCanBoss';
import { DialogueBox } from '@/game/ui/DialogueBox';
import { EventBus, GameEvents } from '@/game/EventBus';
import { getQuestionsByChapter } from '@/data/mbti';
import { MEMORIES } from '@/data/memories';
import { useGameStore } from '@/stores/useGameStore';
import { useGalleryStore } from '@/stores/useGalleryStore';
import { useMbtiStore } from '@/stores/useMbtiStore';

const LEVEL_WIDTH = 2800;
const GROUND_TOP = 500;
const SHARD_VALUE = 5;
const MEMORY_ID = 'memory-1';
const BOSS_X = 2560;
const BOSS_TRIGGER_X = 2360;
const NPC_TALK_RANGE = 56;

const SHARD_POSITIONS: [number, number][] = [
  [130, 486], [200, 486], [300, 486], [380, 486], [560, 486],
  [820, 486], [1000, 486], [1120, 486], [1400, 486], [1650, 486],
  [1900, 486], [2150, 486], [2250, 486], [2380, 486],
  [460, 380], [700, 330], [1300, 380], [1520, 330], [1740, 380], [2020, 350],
];

const PLATFORMS: [number, number, number, number][] = [
  [LEVEL_WIDTH / 2, 520, LEVEL_WIDTH, 40],
  [460, 410, 120, 24],
  [700, 360, 120, 24],
  [1300, 410, 120, 24],
  [1520, 360, 130, 24],
  [1740, 410, 120, 24],
  [2020, 380, 120, 24],
];

const CRITTERS: [number, number, CritterKind][] = [
  [350, 474, 'yarn'],
  [900, 474, 'box'],
  [1200, 474, 'fish'],
  [1600, 474, 'yarn'],
  [2100, 474, 'box'],
];

/**
 * 第一章：Forest（見 docs/02_GameDesign.md、docs/03_Story.md）。
 * 核心迴圈：探索 → 收集碎片 → 與森林老人對話（隱藏 MBTI）→ 擊敗巨大罐罐 → 解鎖 Memory #1。
 */
export class ForestScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private shards!: Phaser.Physics.Arcade.Group;
  private critters!: Phaser.Physics.Arcade.Group;
  private elder!: Npc;
  private boss!: GiantCanBoss;
  private dialogue!: DialogueBox;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  private hudShards!: Phaser.GameObjects.Text;

  private collected = 0;
  private elderTalked = false;
  private bossIntroShown = false;
  private chapterComplete = false;

  private touchLeft = false;
  private touchRight = false;

  constructor() {
    super('Forest');
  }

  create(): void {
    this.collected = 0;
    this.elderTalked = false;
    this.bossIntroShown = false;
    this.chapterComplete = false;

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, this.scale.height);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, this.scale.height);
    this.cameras.main.setBackgroundColor('#33241a');

    this.buildBackground();
    this.buildPlatforms();

    this.player = new Player(this, 80, 440);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

    this.buildShards();
    this.buildCritters();

    this.elder = new Npc(this, 1000, 474, 'npc-elder', '森林老人');
    this.boss = new GiantCanBoss(this, BOSS_X, 452);

    this.registerColliders();
    this.buildHud();
    this.buildTouchControls();
    this.bindInput();

    useGameStore.getState().setChapter(1);
    EventBus.emit(GameEvents.ChapterChanged, 1);
    EventBus.emit(GameEvents.SceneReady, 'Forest');

    // 開場旁白（story 基調：新鮮、雀躍）
    this.player.controlsEnabled = false;
    this.dialogue.showLines('黑糖', [
      '森林裡到處都是閃亮的回憶碎片…',
      '收集它們，也許能找回那個玻璃碗的第一段回憶。',
      '（方向鍵移動、Space 跳躍與二段跳、Shift 衝刺、M 喵、靠近 NPC 按 E 對話）',
    ], () => {
      this.player.controlsEnabled = true;
    });

    this.events.once('memory-closed', () => this.showCompletion());
  }

  private buildBackground(): void {
    const treeXs = [150, 520, 900, 1400, 1900, 2400];
    treeXs.forEach((x) => {
      this.add
        .image(x, GROUND_TOP + 4, 'tree')
        .setOrigin(0.5, 1)
        .setScrollFactor(0.6)
        .setDepth(-5)
        .setAlpha(0.75);
    });
  }

  private buildPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    PLATFORMS.forEach(([cx, cy, w, h]) => {
      const tile = this.add.tileSprite(cx, cy, w, h, 'ground');
      this.platforms.add(tile);
      const body = tile.body as Phaser.Physics.Arcade.StaticBody;
      body.setSize(w, h);
      body.updateFromGameObject();
    });
  }

  private buildShards(): void {
    this.shards = this.physics.add.group({ allowGravity: false, immovable: true });
    SHARD_POSITIONS.forEach(([x, y]) => {
      const shard = this.shards.create(x, y, 'shard') as Phaser.Physics.Arcade.Image;
      shard.setDepth(3);
      this.tweens.add({
        targets: shard,
        y: y - 6,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      });
    });
  }

  private buildCritters(): void {
    this.critters = this.physics.add.group();
    CRITTERS.forEach(([x, y, kind]) => {
      const critter = new Critter(this, x, y, kind);
      this.critters.add(critter);
    });
  }

  private registerColliders(): void {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.critters, this.platforms);
    this.physics.add.collider(this.boss, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.shards,
      (_p, s) => this.collectShard(s as Phaser.Physics.Arcade.Image),
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.critters,
      (_p, c) => this.onCritterTouch(c as Critter),
      undefined,
      this,
    );
    this.physics.add.overlap(this.player, this.boss, () => this.onBossTouch(), undefined, this);
  }

  private buildHud(): void {
    this.add
      .text(16, 12, '第一章 · 森林', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#f6b352',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.hudShards = this.add
      .text(this.scale.width - 16, 12, '碎片 0 / 100', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#8fd6ea',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);
  }

  private bindInput(): void {
    this.dialogue = new DialogueBox(this);
    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    const Codes = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      W: kb.addKey(Codes.W),
      A: kb.addKey(Codes.A),
      D: kb.addKey(Codes.D),
      SPACE: kb.addKey(Codes.SPACE),
      SHIFT: kb.addKey(Codes.SHIFT),
      M: kb.addKey(Codes.M),
      E: kb.addKey(Codes.E),
    };

    // 動作以「按下」事件觸發（比每幀輪詢 JustDown 更可靠）。移動仍以 isDown 輪詢。
    const onJump = () => this.tryJump();
    this.keys.SPACE.on('down', onJump);
    this.keys.W.on('down', onJump);
    this.cursors.up.on('down', onJump);
    this.keys.SHIFT.on('down', () => this.tryDash());
    this.keys.M.on('down', () => this.tryMeow());
    this.keys.E.on('down', () => this.tryTalk());
  }

  private canAct(): boolean {
    return !this.dialogue.isActive() && !this.chapterComplete && this.player.controlsEnabled;
  }

  private tryJump(): void {
    if (this.canAct()) this.player.jump();
  }

  private tryDash(): void {
    if (this.canAct()) this.player.dash();
  }

  private tryMeow(): void {
    if (this.canAct()) this.player.meow();
  }

  private tryTalk(): void {
    if (!this.canAct()) return;
    const near =
      !this.elderTalked &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, this.elder.x, this.elder.y) <
        NPC_TALK_RANGE;
    if (near) this.startElderDialogue();
  }

  private buildTouchControls(): void {
    const h = this.scale.height;
    const makeBtn = (x: number, y: number, label: string) => {
      const circle = this.add
        .circle(x, y, 30, 0x000000, 0.35)
        .setScrollFactor(0)
        .setDepth(95)
        .setInteractive({ useHandCursor: true });
      this.add
        .text(x, y, label, { fontFamily: 'monospace', fontSize: '18px', color: '#f7ecd9' })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(96);
      return circle;
    };

    const left = makeBtn(52, h - 52, '◀');
    const right = makeBtn(122, h - 52, '▶');
    const jump = makeBtn(this.scale.width - 52, h - 52, '⤒');
    const dash = makeBtn(this.scale.width - 122, h - 78, '»');

    left.on('pointerdown', () => (this.touchLeft = true));
    left.on('pointerup', () => (this.touchLeft = false));
    left.on('pointerout', () => (this.touchLeft = false));
    right.on('pointerdown', () => (this.touchRight = true));
    right.on('pointerup', () => (this.touchRight = false));
    right.on('pointerout', () => (this.touchRight = false));
    jump.on('pointerdown', () => this.player.jump());
    dash.on('pointerdown', () => this.player.dash());
  }

  private collectShard(shard: Phaser.Physics.Arcade.Image): void {
    if (!shard.active) return;
    shard.destroy();
    this.addShards(SHARD_VALUE);

    const spark = this.add.particles(shard.x, shard.y, 'spark', {
      speed: { min: 30, max: 80 },
      lifespan: 300,
      quantity: 5,
      scale: { start: 0.7, end: 0 },
    });
    this.time.delayedCall(320, () => spark.destroy());
  }

  private onCritterTouch(critter: Critter): void {
    if (this.dialogue.isActive() || critter.isDefeated()) return;
    const body = this.player.arcadeBody;
    const stomping = body.velocity.y > 0 && this.player.y < critter.y - 6;
    if (stomping) {
      if (critter.defeat()) {
        this.addShards(critter.shardValue);
        body.setVelocityY(-260);
      }
    } else {
      body.setVelocityX(this.player.x < critter.x ? -150 : 150);
    }
  }

  private onBossTouch(): void {
    if (this.dialogue.isActive() || this.chapterComplete) return;
    const body = this.player.arcadeBody;
    const stomping = body.velocity.y > 0 && this.player.y < this.boss.y - 20;
    if (stomping && this.boss.canBeHit()) {
      body.setVelocityY(-320);
      const defeated = this.boss.hit();
      if (defeated) this.onBossDefeated();
    } else if (!this.boss.canBeHit() || !stomping) {
      body.setVelocityX(this.player.x < this.boss.x ? -180 : 180);
    }
  }

  private addShards(n: number): void {
    this.collected += n;
    useGameStore.getState().addShards(n);
    const total = useGameStore.getState().memoryShards;
    this.hudShards.setText(`碎片 ${Math.min(this.collected, 100)} / 100`);
    EventBus.emit(GameEvents.ShardsChanged, total);
  }

  private startElderDialogue(): void {
    this.player.controlsEnabled = false;
    this.elder.showHint(false);
    const questions = getQuestionsByChapter(1);
    this.dialogue.showLines('森林老人', [
      '孩子，森林會記得走過的每一步。',
      '陪我聊聊吧，讓我看看你是怎麼看待這片森林的。',
    ], () => {
      this.dialogue.runQuestions(questions, () => {
        this.elderTalked = true;
        useMbtiStore.getState().finalize();
        this.dialogue.showLines('森林老人', [
          '嗯…我大概明白你是什麼樣的旅人了。',
          '往前走吧，回憶就在森林的盡頭等著你。',
        ], () => {
          this.player.controlsEnabled = true;
        });
      });
    });
  }

  private triggerBossIntro(): void {
    this.bossIntroShown = true;
    this.player.controlsEnabled = false;
    this.dialogue.showLines('巨大罐罐', [
      '喀啦…喀啦…（一個巨大的罐罐擋住了去路）',
      '它把第一段回憶鎖在裡面了。',
      '（從上方踩它三下，讓它打開吧！）',
    ], () => {
      this.boss.activate();
      this.player.controlsEnabled = true;
    });
  }

  private onBossDefeated(): void {
    if (this.chapterComplete) return;
    this.chapterComplete = true;
    this.player.controlsEnabled = false;

    useGalleryStore.getState().unlockMemory(MEMORY_ID);
    EventBus.emit(GameEvents.MemoryUnlocked, MEMORY_ID);

    this.tweens.add({
      targets: this.boss,
      angle: 12,
      y: this.boss.y + 8,
      alpha: 0.2,
      duration: 700,
      onComplete: () => {
        const memory = MEMORIES.find((m) => m.id === MEMORY_ID);
        this.scene.pause();
        this.scene.launch('Memory', {
          caption: memory?.caption ?? '第一次一起出去',
          date: memory?.date ?? 'TBD',
        });
      },
    });
  }

  private showCompletion(): void {
    const { width, height } = this.scale;
    const veil = this.add
      .rectangle(0, 0, width, height, 0x120b07, 0)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(120);
    this.tweens.add({ targets: veil, fillAlpha: 0.9, duration: 400 });

    this.add
      .text(width / 2, height / 2 - 40, '第一章 · 森林  完成', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#f6b352',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(121);

    this.add
      .text(width / 2, height / 2 + 2, '已解鎖回憶 #1：第一次一起出去', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#f7ecd9',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(121);

    const btn = this.add
      .text(width / 2, height / 2 + 60, '▶ 回到選單', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#2b1d14',
        backgroundColor: '#f6b352',
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(121)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.start('MainMenu'));
    EventBus.emit(GameEvents.ChapterChanged, 'forest-complete');
  }

  update(): void {
    if (!this.player) return;

    // 靠近 NPC 提示
    const nearElder =
      !this.elderTalked &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, this.elder.x, this.elder.y) <
        NPC_TALK_RANGE;
    this.elder.showHint(nearElder && !this.dialogue.isActive());

    // Boss 進場觸發
    if (!this.bossIntroShown && !this.chapterComplete && this.player.x > BOSS_TRIGGER_X) {
      this.triggerBossIntro();
    }

    if (this.dialogue.isActive() || this.chapterComplete || !this.player.controlsEnabled) {
      this.player.stopHorizontal();
      return;
    }

    const left = this.cursors.left.isDown || this.keys.A.isDown || this.touchLeft;
    const right = this.cursors.right.isDown || this.keys.D.isDown || this.touchRight;

    if (left) this.player.moveLeft();
    else if (right) this.player.moveRight();
    else this.player.stopHorizontal();
    // 跳躍 / 衝刺 / 喵 / 對話改由按鍵 down 事件處理（見 bindInput）。
  }
}
