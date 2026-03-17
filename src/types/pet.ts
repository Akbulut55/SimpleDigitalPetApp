export type PetState = {
  hunger: number;
  happiness: number;
  xp: number;
  coins: number;
  feedCount: number;
  playCount: number;
  miniGameCount: number;
  seenMiniGameQuestionIds: string[];
  unlockedAchievements: string[];
};

export type PetTheme = {
  emoji: string;
  mood: string;
  cardBg: string;
  buttonBg: string;
  border: string;
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
  achievements: Achievement[];
  onFeed: () => void;
  onPlay: () => void;
  onMiniGame: () => void;
  onOpenSettings: () => void;
};
