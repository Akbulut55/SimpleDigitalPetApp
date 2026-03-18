export type CatDirection =
  | 'down'
  | 'up'
  | 'right'
  | 'left'
  | 'left-down'
  | 'right-down'
  | 'right-up'
  | 'left-up';

export type PetSpriteVariant =
  | 'need-attention'
  | 'sad'
  | 'happy'
  | 'very-happy'
  | 'normal'
  | 'rest'
  | 'walk'
  | `walk-${CatDirection}`
  | 'sleep'
  | 'eat'
  | `eat-${CatDirection}`
  | 'meow'
  | 'yawn'
  | 'wash'
  | 'scratch'
  | 'hiss'
  | 'single-frame'
  | 'paw-attack'
  | `paw-attack-${CatDirection}`
  | 'paw-attack-hind-legs';

export type CatProfile = {
  id: string;
  spriteId: string;
  name: string;
  hunger: number;
  happiness: number;
};

export type PetState = {
  activeCatId: string;
  unlockedCatIds: string[];
  cats: CatProfile[];
  xp: number;
  coins: number;
  feedCount: number;
  playCount: number;
  miniGameCount: number;
  seenMiniGameQuestionIds: string[];
  unlockedAchievements: string[];
};

export type AppPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  panel: string;
  panelBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  chipBackground: string;
  chipBorder: string;
  surfaceHighlight: string;
  headerBand: string;
  cardBg: string;
  mutedTrack: string;
  shadowColor: string;
  buttonDisabledBg: string;
  optionBg: string;
  optionBgAlt: string;
};

export type PetTheme = {
  emoji: string;
  sprite: PetSpriteVariant;
  mood: string;
  spriteId?: string;
  cardBg: string;
  buttonBg: string;
  border: string;
  accent?: string;
  accentSoft?: string;
  variantLabel?: string;
};

export type BaseAchievement = {
  id: string;
  title: string;
  description: string;
};

export type Achievement = BaseAchievement & {
  unlocked: boolean;
};

export type PetCardProps = {
  name: string;
  species: string;
  hunger: number;
  happiness: number;
  coins: number;
  xp: number;
  level: number;
  feedCost: number;
  theme: PetTheme;
  palette: AppPalette;
  achievements: Achievement[];
  onFeed: () => void;
  onPlay: () => void;
  onMiniGame: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  isActionLocked?: boolean;
  isFeedInProgress?: boolean;
  frameSequence?: number[];
  sequenceSpeedMultiplier?: number;
  loopAnimation?: boolean;
  sequenceFps?: number;
  onActionSequenceComplete?: () => void;
};
