/**
 * Keeps NPC / interact copy accurate on touch devices where Talk replaces E.
 */
export function formatInteractVerb(isTouch: boolean): string {
  return isTouch ? '點 對話' : '按 E'
}

export function formatMeowVerb(isTouch: boolean): string {
  return isTouch ? '點 喵叫' : '按 M'
}

export function interactPrompt(isTouch: boolean, action: string): string {
  return `${formatInteractVerb(isTouch)} ${action}`
}
