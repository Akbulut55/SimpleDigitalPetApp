import { normalizeCatSpriteId } from '../constants/petSprites';
import { PetSpriteVariant, PetState, PetTheme } from '../types/pet';

export const STORAGE_KEY = '@digitalPetV2:state';

export const FEED_XP = 5;
export const PLAY_XP = 10;
export const FEED_COIN_COST = 3;

export const FEED_HUNGER_DROP = 10;
export const FEED_HAPPINESS_GAIN = 5;
export const PLAY_HUNGER_RISE = 5;
export const PLAY_HAPPINESS_GAIN = 10;

export const MINIGAME_HUNGER_INCREASE = 0;
export const MINIGAME_HAPPINESS_DECREASE = 12;

export const INITIAL_STATE: PetState = {
  name: 'Mochi',
  hunger: 50,
  happiness: 50,
  spriteId: 'default',
  xp: 0,
  coins: 0,
  feedCount: 0,
  playCount: 0,
  miniGameCount: 0,
  seenMiniGameQuestionIds: [],
  unlockedAchievements: [],
};

export const clampStat = (value: number) => Math.max(0, Math.min(100, value));

export const getLevel = (xp: number) => Math.floor(xp / 100) + 1;

const getSpriteFromMood = (hunger: number, happiness: number): PetSpriteVariant => {
  if (hunger >= 80) {
    return 'need-attention';
  }

  if (happiness <= 20) {
    return 'sad';
  }

  if (happiness >= 80 && hunger <= 25) {
    return 'very-happy';
  }

  if (happiness >= 60) {
    return 'happy';
  }

  return 'normal';
};

export const getMoodFromState = (hunger: number, happiness: number): PetTheme => {
  if (hunger >= 80) {
    return {
      emoji: String.fromCodePoint(0x1f63f),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Needs Attention',
      cardBg: '#fff1f2',
      buttonBg: '#e11d48',
      border: '#f43f5e',
    };
  }

  if (happiness <= 20) {
    return {
      emoji: String.fromCodePoint(0x1f622),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Sad',
      cardBg: '#fdf2f8',
      buttonBg: '#be185d',
      border: '#db2777',
    };
  }

  if (happiness >= 80 && hunger <= 25) {
    return {
      emoji: String.fromCodePoint(0x1f638),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Very Happy',
      cardBg: '#ecfeff',
      buttonBg: '#0891b2',
      border: '#06b6d4',
    };
  }

  if (happiness >= 60) {
    return {
      emoji: String.fromCodePoint(0x1f63a),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Happy',
      cardBg: '#eff6ff',
      buttonBg: '#2563eb',
      border: '#3b82f6',
    };
  }

  return {
    emoji: String.fromCodePoint(0x1f60c),
    sprite: getSpriteFromMood(hunger, happiness),
    mood: 'Normal',
    cardBg: '#f8fafc',
    buttonBg: '#0f766e',
    border: '#14b8a6',
  };
};

export const normalizeState = (input?: Partial<PetState>): PetState => {
  return {
    name: input?.name ?? INITIAL_STATE.name,
    hunger: clampStat(input?.hunger ?? INITIAL_STATE.hunger),
    happiness: clampStat(input?.happiness ?? INITIAL_STATE.happiness),
    spriteId: normalizeCatSpriteId(input?.spriteId),
    xp: Math.max(0, Math.floor(input?.xp ?? INITIAL_STATE.xp)),
    coins: Math.max(0, Math.floor(input?.coins ?? INITIAL_STATE.coins)),
    feedCount: Math.max(0, Math.floor(input?.feedCount ?? INITIAL_STATE.feedCount)),
    playCount: Math.max(0, Math.floor(input?.playCount ?? INITIAL_STATE.playCount)),
    miniGameCount: Math.max(0, Math.floor(input?.miniGameCount ?? INITIAL_STATE.miniGameCount)),
    seenMiniGameQuestionIds: Array.isArray(input?.seenMiniGameQuestionIds)
      ? input.seenMiniGameQuestionIds
      : INITIAL_STATE.seenMiniGameQuestionIds,
    unlockedAchievements: Array.isArray(input?.unlockedAchievements)
      ? input.unlockedAchievements
      : INITIAL_STATE.unlockedAchievements,
  };
};






