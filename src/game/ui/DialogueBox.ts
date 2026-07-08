import Phaser from 'phaser';
import type { MbtiQuestion } from '@/data/types';
import { useMbtiStore } from '@/stores/useMbtiStore';

/**
 * Visual Novel 風格對話框（見 docs/08_UIUX.md）。
 * 同時作為隱藏式 MBTI 題目的載體：選項以一般對話呈現，玩家不會察覺在做測驗。
 */
export class DialogueBox {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private hintText: Phaser.GameObjects.Text;
  private options: Phaser.GameObjects.Text[] = [];
  private active = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const w = scene.scale.width;
    const h = scene.scale.height;
    const boxW = w - 64;
    const boxH = 132;
    const boxX = 32;
    const boxY = h - boxH - 24;

    const bg = scene.add.rectangle(0, 0, boxW, boxH, 0x2b1d14, 0.92).setOrigin(0, 0);
    bg.setStrokeStyle(2, 0xf6b352);

    this.nameText = scene.add.text(16, 12, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#f6b352',
    });
    this.bodyText = scene.add.text(16, 40, '', {
      fontFamily: 'monospace',
      fontSize: '15px',
      color: '#f7ecd9',
      wordWrap: { width: boxW - 32 },
    });
    this.hintText = scene.add
      .text(boxW - 16, boxH - 22, '', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#d8c3a5',
      })
      .setOrigin(1, 0);

    this.container = scene.add
      .container(boxX, boxY, [bg, this.nameText, this.bodyText, this.hintText])
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  isActive(): boolean {
    return this.active;
  }

  /** 顯示一段或多段旁白 / 對白，全部讀完後呼叫 onDone。 */
  showLines(name: string, lines: string[], onDone: () => void): void {
    this.open();
    let index = 0;

    const renderCurrent = () => {
      this.nameText.setText(name);
      this.bodyText.setText(lines[index]);
      this.hintText.setText(index < lines.length - 1 ? '▶ 按 Space / 點擊繼續' : '▶ 按 Space / 點擊結束');
    };

    const advance = () => {
      index += 1;
      if (index >= lines.length) {
        detach();
        this.close();
        onDone();
      } else {
        renderCurrent();
      }
    };

    const detach = this.bindAdvance(advance);
    renderCurrent();
  }

  /** 顯示一題（隱藏 MBTI）。玩家選擇後記錄分數並呼叫 onAnswered。 */
  askQuestion(question: MbtiQuestion, onAnswered: () => void): void {
    this.open();
    this.clearOptions();

    this.nameText.setText(question.npc);
    this.bodyText.setText(question.prompt);
    this.hintText.setText('▶ 選擇一個回答');

    question.options.forEach((opt, i) => {
      const label = `${String.fromCharCode(65 + i)}. ${opt.label}`;
      const y = 74 + i * 24;
      const text = this.scene.add
        .text(24, y, label, {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: '#f7ecd9',
        })
        .setInteractive({ useHandCursor: true });

      text.on('pointerover', () => text.setColor('#f6b352'));
      text.on('pointerout', () => text.setColor('#f7ecd9'));
      text.on('pointerdown', () => {
        useMbtiStore.getState().answer(question.id, opt.dimension, opt.label);
        this.clearOptions();
        this.close();
        onAnswered();
      });

      this.container.add(text);
      this.options.push(text);
    });
  }

  /** 依序詢問多題，全部完成後呼叫 onDone。 */
  runQuestions(questions: MbtiQuestion[], onDone: () => void): void {
    let i = 0;
    const next = () => {
      if (i >= questions.length) {
        onDone();
        return;
      }
      const q = questions[i];
      i += 1;
      this.askQuestion(q, next);
    };
    next();
  }

  private bindAdvance(advance: () => void): () => void {
    const onPointer = () => advance();
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') advance();
    };
    this.scene.input.on('pointerdown', onPointer);
    this.scene.input.keyboard?.on('keydown', onKey);
    return () => {
      this.scene.input.off('pointerdown', onPointer);
      this.scene.input.keyboard?.off('keydown', onKey);
    };
  }

  private clearOptions(): void {
    this.options.forEach((o) => o.destroy());
    this.options = [];
  }

  private open(): void {
    this.active = true;
    this.container.setVisible(true);
  }

  private close(): void {
    this.active = false;
    this.container.setVisible(false);
    this.clearOptions();
  }
}
