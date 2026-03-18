import {
  CAT_VARIANTS,
  FALLBACK_SPRITE_ID,
  normalizeCatSpriteId,
} from '../constants/petSprites';
import { CatProfile, PetSpriteVariant, PetState, PetTheme } from '../types/pet';

export const STORAGE_KEY = '@digitalPetV2:state';

export const FEED_XP = 5;
export const PLAY_XP = 10;
export const FEED_COIN_COST = 3;

export const FEED_HUNGER_DROP = 10;
export const PLAY_HUNGER_RISE = 5;
export const PLAY_HAPPINESS_GAIN = 10;

export const MINIGAME_HUNGER_INCREASE = 0;
export const MINIGAME_HAPPINESS_DECREASE = 12;

const DEFAULT_CAT_STATS = {
  default: { hunger: 38, happiness: 76 },
  accent: { hunger: 56, happiness: 62 },
  alt: { hunger: 47, happiness: 54 },
} as const;

const createDefaultCatProfiles = (): CatProfile[] =>
  CAT_VARIANTS.map(variant => ({
    id: variant.id,
    spriteId: variant.id,
    name: variant.defaultName,
    hunger: DEFAULT_CAT_STATS[variant.id].hunger,
    happiness: DEFAULT_CAT_STATS[variant.id].happiness,
  }));

export const INITIAL_STATE: PetState = {
  activeCatId: FALLBACK_SPRITE_ID,
  unlockedCatIds: [FALLBACK_SPRITE_ID],
  cats: createDefaultCatProfiles(),
  xp: 0,
  coins: 0,
  feedCount: 0,
  playCount: 0,
  miniGameCount: 0,
  seenMiniGameQuestionIds: [],
  unlockedAchievements: [],
};

type LegacyPetState = Partial<PetState> & {
  name?: string;
  hunger?: number;
  happiness?: number;
  spriteId?: string;
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
      cardBg: '#fff4ed',
      buttonBg: '#ea580c',
      border: '#fb923c',
    };
  }

  if (happiness <= 20) {
    return {
      emoji: String.fromCodePoint(0x1f622),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Sad',
      cardBg: '#fef2f2',
      buttonBg: '#dc2626',
      border: '#f87171',
    };
  }

  if (happiness >= 80 && hunger <= 25) {
    return {
      emoji: String.fromCodePoint(0x1f638),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Very Happy',
      cardBg: '#ecfeff',
      buttonBg: '#0891b2',
      border: '#22d3ee',
    };
  }

  if (happiness >= 60) {
    return {
      emoji: String.fromCodePoint(0x1f63a),
      sprite: getSpriteFromMood(hunger, happiness),
      mood: 'Happy',
      cardBg: '#eff6ff',
      buttonBg: '#2563eb',
      border: '#60a5fa',
    };
  }

  return {
    emoji: String.fromCodePoint(0x1f60c),
    sprite: getSpriteFromMood(hunger, happiness),
    mood: 'Normal',
    cardBg: '#f0fdf4',
    buttonBg: '#0f766e',
    border: '#2dd4bf',
  };
};

const normalizeCatProfile = (input: Partial<CatProfile> | undefined, fallback: CatProfile): CatProfile => ({
  id: fallback.id,
  spriteId: normalizeCatSpriteId(input?.spriteId ?? fallback.spriteId),
  name:
    typeof input?.name === 'string' && input.name.trim().length > 0
      ? input.name.trim()
      : fallback.name,
  hunger: clampStat(input?.hunger ?? fallback.hunger),
  happiness: clampStat(input?.happiness ?? fallback.happiness),
});

export const normalizeState = (input?: LegacyPetState): PetState => {
  const source = input ?? {};
  const defaultCats = createDefaultCatProfiles();
  const catsById = new Map(defaultCats.map(cat => [cat.id, cat]));
  const persistedCats = Array.isArray(source.cats) ? source.cats : [];

  persistedCats.forEach(cat => {
    const normalizedId = normalizeCatSpriteId(cat?.id ?? cat?.spriteId);
    const fallback = catsById.get(normalizedId);

    if (!fallback) {
      return;
    }

    catsById.set(
      normalizedId,
      normalizeCatProfile(
        {
          ...cat,
          id: normalizedId,
          spriteId: normalizedId,
        },
        fallback,
      ),
    );
  });

  if (persistedCats.length === 0) {
    const legacySpriteId = normalizeCatSpriteId(source.spriteId);
    const fallback = catsById.get(legacySpriteId) ?? defaultCats[0];

    catsById.set(
      legacySpriteId,
      normalizeCatProfile(
        {
          id: legacySpriteId,
          spriteId: legacySpriteId,
          name: source.name,
          hunger: source.hunger,
          happiness: source.happiness,
        },
        fallback,
      ),
    );
  }

  const cats = CAT_VARIANTS.map(variant => catsById.get(variant.id) ?? defaultCats.find(cat => cat.id === variant.id) ?? defaultCats[0]);
  const normalizedActiveCatId = normalizeCatSpriteId(source.activeCatId ?? source.spriteId);

  const defaultUnlocked = [FALLBACK_SPRITE_ID];
  const persistedUnlocked = Array.isArray(source.unlockedCatIds)
    ? source.unlockedCatIds.map(id => normalizeCatSpriteId(id))
    : [];
  const unlockedSet = new Set<string>(defaultUnlocked);

  if (persistedUnlocked.length > 0) {
    persistedUnlocked.forEach(id => unlockedSet.add(id));
  }

  if (source.activeCatId && normalizedActiveCatId !== FALLBACK_SPRITE_ID) {
    unlockedSet.add(normalizedActiveCatId);
  }

  const unlockedCatIds = CAT_VARIANTS.map(variant => variant.id).filter(id => unlockedSet.has(id));
  const activeCatId = unlockedSet.has(normalizedActiveCatId)
    ? normalizedActiveCatId
    : FALLBACK_SPRITE_ID;

  return {
    activeCatId,
    unlockedCatIds,
    cats,
    xp: Math.max(0, Math.floor(source.xp ?? INITIAL_STATE.xp)),
    coins: Math.max(0, Math.floor(source.coins ?? INITIAL_STATE.coins)),
    feedCount: Math.max(0, Math.floor(source.feedCount ?? INITIAL_STATE.feedCount)),
    playCount: Math.max(0, Math.floor(source.playCount ?? INITIAL_STATE.playCount)),
    miniGameCount: Math.max(0, Math.floor(source.miniGameCount ?? INITIAL_STATE.miniGameCount)),
    seenMiniGameQuestionIds: Array.isArray(source.seenMiniGameQuestionIds)
      ? source.seenMiniGameQuestionIds
      : INITIAL_STATE.seenMiniGameQuestionIds,
    unlockedAchievements: Array.isArray(source.unlockedAchievements)
      ? source.unlockedAchievements
      : INITIAL_STATE.unlockedAchievements,
  };
};
