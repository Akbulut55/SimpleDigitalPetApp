import { ImageSourcePropType } from 'react-native';
import { PetSpriteVariant } from '../types/pet';

type FrameRange = {
  start: number;
  length: number;
};

type CatAnimation = {
  ranges: FrameRange[];
  fps: number;
};

type CatSpriteConfig = {
  sheet: ImageSourcePropType;
  animations: Record<PetSpriteVariant, CatAnimation>;
};

export type CatSpriteId = 'default' | 'accent' | 'alt';

export type CatVariantMeta = {
  id: CatSpriteId;
  label: string;
  defaultName: string;
  accent: string;
  surface: string;
  unlockCost: number;
};

export const CAT_FRAME_SIZE = 32;

const catDefaultSheet = require('../assets/cat-sprites/cat-white.png');
const catAccentSheet = require('../assets/cat-sprites/cat-brown.png');
const catAltSheet = require('../assets/cat-sprites/cat-gray.png');

export const CAT_VARIANTS: ReadonlyArray<CatVariantMeta> = [
  {
    id: 'alt',
    label: 'Gray Cat',
    defaultName: 'Pebble',
    accent: '#0f766e',
    surface: '#ccfbf1',
    unlockCost: 0,
  },
  {
    id: 'default',
    label: 'White Cat',
    defaultName: 'Snow',
    accent: '#0ea5e9',
    surface: '#e0f2fe',
    unlockCost: 30,
  },
  {
    id: 'accent',
    label: 'Brown Cat',
    defaultName: 'Maple',
    accent: '#d97706',
    surface: '#fef3c7',
    unlockCost: 45,
  },
];

const range = (from: number, to: number): FrameRange => ({
  start: from,
  length: to - from + 1,
});

const rest = {
  ranges: [range(0, 5), range(11, 18), range(22, 27), range(33, 42)],
  fps: 6,
};

const walkDown = { ranges: [range(44, 47)], fps: 8 };
const walkUp = { ranges: [range(55, 58)], fps: 8 };
const walkRight = { ranges: [range(66, 73)], fps: 10 };
const walkLeft = { ranges: [range(77, 84)], fps: 10 };
const walkLeftDown = { ranges: [range(88, 93)], fps: 10 };
const walkRightDown = { ranges: [range(99, 104)], fps: 10 };
const walkRightUp = { ranges: [range(110, 115)], fps: 10 };
const walkLeftUp = { ranges: [range(121, 126)], fps: 10 };

const sleep = {
  ranges: [range(132, 133)],
  fps: 1,
};
const eatDown = { ranges: [range(220, 227)], fps: 9 };
const eatUp = { ranges: [range(231, 238)], fps: 9 };
const eatLeft = { ranges: [range(242, 249)], fps: 9 };
const eatRight = { ranges: [range(253, 260)], fps: 9 };
const eatRightDown = { ranges: [range(264, 271)], fps: 9 };
const eatLeftDown = { ranges: [range(275, 282)], fps: 9 };
const eatRightUp = { ranges: [range(286, 293)], fps: 9 };
const eatLeftUp = { ranges: [range(297, 304)], fps: 9 };

const meow = {
  ranges: [
    range(308, 310),
    range(319, 321),
    range(330, 332),
    range(341, 343),
  ],
  fps: 4,
};

const yawn = {
  ranges: [
    range(352, 359),
    range(363, 370),
    range(374, 381),
    range(385, 392),
  ],
  fps: 4,
};

const wash = {
  ranges: [
    range(396, 404),
    range(407, 415),
    range(418, 424),
  ],
  fps: 5,
};

const scratch = {
  ranges: [range(429, 439), range(440, 450)],
  fps: 12,
};

const hiss = {
  ranges: [range(451, 452), range(462, 463)],
  fps: 4,
};

const singleFrame = {
  ranges: [range(473, 473)],
  fps: 1,
};

const pawAttackDown = { ranges: [range(484, 492)], fps: 12 };
const pawAttackUp = { ranges: [range(495, 499)], fps: 12 };
const pawAttackLeft = { ranges: [range(506, 512)], fps: 12 };
const pawAttackRight = { ranges: [range(517, 523)], fps: 12 };
const pawAttackRightDown = { ranges: [range(528, 536)], fps: 12 };
const pawAttackLeftDown = { ranges: [range(539, 547)], fps: 12 };
const pawAttackRightUp = { ranges: [range(550, 554)], fps: 12 };
const pawAttackLeftUp = { ranges: [range(561, 565)], fps: 12 };
const pawAttackHindLegs = { ranges: [range(572, 575)], fps: 10 };

const createAnimations = (): Record<PetSpriteVariant, CatAnimation> => ({
  'need-attention': yawn,
  sad: yawn,
  happy: walkRight,
  'very-happy': eatDown,
  normal: rest,
  rest,
  walk: walkDown,
  'walk-down': walkDown,
  'walk-up': walkUp,
  'walk-right': walkRight,
  'walk-left': walkLeft,
  'walk-left-down': walkLeftDown,
  'walk-right-down': walkRightDown,
  'walk-right-up': walkRightUp,
  'walk-left-up': walkLeftUp,
  sleep,
  eat: eatDown,
  'eat-down': eatDown,
  'eat-up': eatUp,
  'eat-left': eatLeft,
  'eat-right': eatRight,
  'eat-right-down': eatRightDown,
  'eat-left-down': eatLeftDown,
  'eat-right-up': eatRightUp,
  'eat-left-up': eatLeftUp,
  meow,
  yawn,
  wash,
  scratch,
  hiss,
  'single-frame': singleFrame,
  'paw-attack': pawAttackDown,
  'paw-attack-down': pawAttackDown,
  'paw-attack-up': pawAttackUp,
  'paw-attack-left': pawAttackLeft,
  'paw-attack-right': pawAttackRight,
  'paw-attack-right-down': pawAttackRightDown,
  'paw-attack-left-down': pawAttackLeftDown,
  'paw-attack-right-up': pawAttackRightUp,
  'paw-attack-left-up': pawAttackLeftUp,
  'paw-attack-hind-legs': pawAttackHindLegs,
});

const catAnimations = createAnimations();

export const CAT_SPRITES: Record<CatSpriteId, CatSpriteConfig> = {
  default: {
    sheet: catDefaultSheet,
    animations: catAnimations,
  },
  accent: {
    sheet: catAccentSheet,
    animations: catAnimations,
  },
  alt: {
    sheet: catAltSheet,
    animations: catAnimations,
  },
};

export const FALLBACK_SPRITE_ID: CatSpriteId = 'alt';

export const normalizeCatSpriteId = (spriteId?: string): CatSpriteId => {
  if (spriteId === 'default' || spriteId === 'accent' || spriteId === 'alt') {
    return spriteId;
  }

  return FALLBACK_SPRITE_ID;
};

export const getCatVariantMeta = (spriteId?: string): CatVariantMeta => {
  const normalizedId = normalizeCatSpriteId(spriteId);
  return CAT_VARIANTS.find(variant => variant.id === normalizedId) ?? CAT_VARIANTS[0];
};

export const getCatSpriteConfig = (spriteId: string = FALLBACK_SPRITE_ID): CatSpriteConfig => {
  return CAT_SPRITES[normalizeCatSpriteId(spriteId)] ?? CAT_SPRITES[FALLBACK_SPRITE_ID];
};

export const getAnimationForSprite = (
  sprite: PetSpriteVariant,
  config: CatSpriteConfig,
): CatAnimation => config.animations[sprite] ?? config.animations.normal;
