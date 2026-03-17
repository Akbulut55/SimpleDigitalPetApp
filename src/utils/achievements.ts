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
] as const;

export const getUnlockedAchievementIds = (
  state: Pick<PetState, 'hunger' | 'happiness' | 'xp' | 'coins' | 'feedCount' | 'playCount' | 'miniGameCount'>,
  existing: string[],
): string[] => {
  const unlocked = new Set<string>(existing);
  const level = getLevel(state.xp);

  if (state.feedCount >= 1) unlocked.add('firstMeal');
  if (state.playCount >= 1) unlocked.add('playTime');
  if (level >= 2) unlocked.add('levelUp');
  if (state.happiness >= 100) unlocked.add('happyPet');
  if (state.hunger < 20) unlocked.add('wellFed');
  if (state.miniGameCount >= 1) unlocked.add('firstMiniGame');
  if (state.coins >= 10) unlocked.add('coinCollector');

  return [...unlocked];
};

export const mapAchievements = (unlockedIds: string[]): Achievement[] =>
  ACHIEVEMENT_CATALOG.map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.includes(achievement.id),
  }));

export const achievementCatalog = ACHIEVEMENT_CATALOG;