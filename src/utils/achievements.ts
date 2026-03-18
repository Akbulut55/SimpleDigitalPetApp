import { Achievement, BaseAchievement, PetState } from '../types/pet';
import { getLevel } from './gameLogic';

const ACHIEVEMENT_CATALOG: ReadonlyArray<BaseAchievement> = [
  {
    id: 'firstMeal',
    title: 'First Meal',
    description: 'Feed your pet for the first time.',
  },
  {
    id: 'playTime',
    title: 'Play Time',
    description: 'Play with your pet for the first time.',
  },
  {
    id: 'levelUp',
    title: 'Level Up',
    description: 'Reach Level 2.',
  },
  {
    id: 'happyPet',
    title: 'Happy Pet',
    description: 'Raise happiness to 100.',
  },
  {
    id: 'wellFed',
    title: 'Well Fed',
    description: 'Keep hunger below 20.',
  },
  {
    id: 'firstMiniGame',
    title: 'Mini-Game Rookie',
    description: 'Play a mini-game for the first time.',
  },
  {
    id: 'coinCollector',
    title: 'Coin Collector',
    description: 'Gather 10 coins.',
  },
  {
    id: 'coinGatherer',
    title: 'Coin Gatherer',
    description: 'Gather 25 coins.',
  },
  {
    id: 'coinMaster',
    title: 'Coin Master',
    description: 'Gather 50 coins.',
  },
  {
    id: 'doubleMeal',
    title: 'Double Meal',
    description: 'Feed your pet 5 times.',
  },
  {
    id: 'playful',
    title: 'Playful',
    description: 'Play with your pet 3 times.',
  },
  {
    id: 'miniGamer',
    title: 'Mini-Game Addict',
    description: 'Play mini-games 3 times.',
  },
  {
    id: 'happy100',
    title: 'Pure Happiness',
    description: 'Keep happiness at 100.',
  },
  {
    id: 'survivalStar',
    title: 'Survival Star',
    description: 'Keep hunger at 10 or less.',
  },
  {
    id: 'levelThree',
    title: 'Rising Star',
    description: 'Reach Level 3.',
  },
  {
    id: 'levelMaster',
    title: 'Level Master',
    description: 'Reach Level 5.',
  },
] as const;

export const getUnlockedAchievementIds = (
  state: Pick<PetState, 'hunger' | 'happiness' | 'xp' | 'coins' | 'feedCount' | 'playCount' | 'miniGameCount'>,
  existing: string[],
): string[] => {
  const unlocked = new Set<string>(existing);
  const level = getLevel(state.xp);

  if (state.feedCount >= 1) unlocked.add('firstMeal');
  if (state.feedCount >= 5) unlocked.add('doubleMeal');
  if (state.playCount >= 1) unlocked.add('playTime');
  if (state.playCount >= 3) unlocked.add('playful');
  if (level >= 2) unlocked.add('levelUp');
  if (state.happiness >= 100) unlocked.add('happyPet');
  if (state.happiness >= 100) unlocked.add('happy100');
  if (state.hunger < 20) unlocked.add('wellFed');
  if (state.hunger <= 10) unlocked.add('survivalStar');
  if (state.miniGameCount >= 1) unlocked.add('firstMiniGame');
  if (state.miniGameCount >= 3) unlocked.add('miniGamer');
  if (state.coins >= 10) unlocked.add('coinCollector');
  if (state.coins >= 25) unlocked.add('coinGatherer');
  if (state.coins >= 50) unlocked.add('coinMaster');
  if (level >= 3) unlocked.add('levelThree');
  if (level >= 5) unlocked.add('levelMaster');

  return [...unlocked];
};

export const mapAchievements = (unlockedIds: string[]): Achievement[] =>
  ACHIEVEMENT_CATALOG.map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));

export const achievementCatalog = ACHIEVEMENT_CATALOG;
