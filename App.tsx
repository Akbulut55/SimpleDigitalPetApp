import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { petStorage } from './storage';

type PetState = {
  hunger: number;
  happiness: number;
  xp: number;
  feedCount: number;
  playCount: number;
  unlockedAchievements: string[];
};

type PetTheme = {
  emoji: string;
  mood: string;
  cardBg: string;
  buttonBg: string;
  border: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

type PetCardProps = {
  name: string;
  species: string;
  hunger: number;
  happiness: number;
  xp: number;
  level: number;
  theme: PetTheme;
  achievements: Achievement[];
  onFeed: () => void;
  onPlay: () => void;
  onReset: () => void | Promise<void>;
};

const STORAGE_KEY = '@digitalPetV2:state';
const FEED_XP = 5;
const PLAY_XP = 10;

const INITIAL_STATE: PetState = {
  hunger: 50,
  happiness: 50,
  xp: 0,
  feedCount: 0,
  playCount: 0,
  unlockedAchievements: [],
};

const achievementCatalog = [
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
] as const;

const clampStat = (value: number) => Math.max(0, Math.min(100, value));
const getLevel = (xp: number) => Math.floor(xp / 100) + 1;

const getMoodTheme = (hunger: number, happiness: number): PetTheme => {
  if (hunger >= 80) {
    return {
      emoji: '😿',
      mood: 'Needs Attention',
      cardBg: '#fff1f2',
      buttonBg: '#e11d48',
      border: '#f43f5e',
    };
  }
  if (happiness <= 20) {
    return {
      emoji: '😢',
      mood: 'Sad',
      cardBg: '#fdf2f8',
      buttonBg: '#be185d',
      border: '#db2777',
    };
  }
  if (happiness >= 80 && hunger <= 25) {
    return {
      emoji: '😸',
      mood: 'Very Happy',
      cardBg: '#ecfeff',
      buttonBg: '#0891b2',
      border: '#06b6d4',
    };
  }
  if (happiness >= 60) {
    return {
      emoji: '😺',
      mood: 'Happy',
      cardBg: '#eff6ff',
      buttonBg: '#2563eb',
      border: '#3b82f6',
    };
  }
  return {
    emoji: '😌',
    mood: 'Normal',
    cardBg: '#f8fafc',
    buttonBg: '#0f766e',
    border: '#14b8a6',
  };
};

const getUnlockedAchievementIds = (
  state: Pick<PetState, 'hunger' | 'happiness' | 'xp' | 'feedCount' | 'playCount'>,
  existing: string[],
): string[] => {
  const unlocked = new Set<string>(existing);
  const level = getLevel(state.xp);

  if (state.feedCount >= 1) unlocked.add('firstMeal');
  if (state.playCount >= 1) unlocked.add('playTime');
  if (level >= 2) unlocked.add('levelUp');
  if (state.happiness >= 100) unlocked.add('happyPet');
  if (state.hunger < 20) unlocked.add('wellFed');

  return [...unlocked];
};

const normalizeState = (input?: Partial<PetState>): PetState => {
  const candidate: PetState = {
    hunger: clampStat(input?.hunger ?? INITIAL_STATE.hunger),
    happiness: clampStat(input?.happiness ?? INITIAL_STATE.happiness),
    xp: Math.max(0, Math.floor(input?.xp ?? INITIAL_STATE.xp)),
    feedCount: Math.max(0, Math.floor(input?.feedCount ?? INITIAL_STATE.feedCount)),
    playCount: Math.max(0, Math.floor(input?.playCount ?? INITIAL_STATE.playCount)),
    unlockedAchievements: Array.isArray(input?.unlockedAchievements) ? input?.unlockedAchievements : INITIAL_STATE.unlockedAchievements,
  };

  candidate.unlockedAchievements = getUnlockedAchievementIds(candidate, candidate.unlockedAchievements);
  return candidate;
};

function StatBar({
  label,
  value,
  fillColor = '#0ea5e9',
}: {
  label: string;
  value: number;
  fillColor?: string;
}) {
  return (
    <View style={styles.statWrap}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${value}%`, backgroundColor: fillColor }]} />
      </View>
    </View>
  );
}

function ActionButton({ title, color, onPress }: { title: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function PetCard({
  name,
  species,
  hunger,
  happiness,
  xp,
  level,
  theme,
  achievements,
  onFeed,
  onPlay,
  onReset,
}: PetCardProps) {
  const xpProgress = xp % 100;

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <View style={[styles.emphasisBar, { backgroundColor: theme.border }]} />

      <Text style={styles.screenTitle}>Digital Pet</Text>
      <Text style={styles.emoji}>{theme.emoji}</Text>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.species}>A curious {species}</Text>
      <Text style={styles.moodLabel}>Mood: {theme.mood}</Text>

      <StatBar label="Hunger" value={hunger} />
      <StatBar label="Happiness" value={happiness} fillColor="#22c55e" />

      <View style={styles.statWrap}>
        <View style={styles.statHeader}>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>Level {level}</Text>
        </View>
        <Text style={styles.metaText}>Total XP: {xp}</Text>
        <View style={styles.statTrack}>
          <View style={[styles.statFill, { width: `${xpProgress}%`, backgroundColor: '#6366f1' }]} />
        </View>
      </View>

      <View style={[styles.actions, { borderTopColor: theme.border }]}>
        <ActionButton title="Feed" color={theme.buttonBg} onPress={onFeed} />
        <ActionButton title="Play" color="#0f766e" onPress={onPlay} />
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Achievements</Text>
      <ScrollView style={styles.achievementList} nestedScrollEnabled>
        {achievements.map(item => (
          <View
            key={item.id}
            style={[styles.achievementItem, item.unlocked ? styles.achievementOpen : styles.achievementLocked]}
          >
            <Text
              style={[
                styles.achievementTitle,
                item.unlocked ? styles.achievementTitleOpen : styles.achievementTitleClosed,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.achievementDesc}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Reset Progress</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [petState, setPetState] = useState<PetState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  const level = useMemo(() => getLevel(petState.xp), [petState.xp]);
  const theme = useMemo(() => getMoodTheme(petState.hunger, petState.happiness), [petState.hunger, petState.happiness]);
  const achievements = useMemo(
    () =>
      achievementCatalog.map(item => ({
        ...item,
        unlocked: petState.unlockedAchievements.includes(item.id),
      })),
    [petState.unlockedAchievements],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await petStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setIsHydrated(true);
          return;
        }

        const parsed = JSON.parse(raw) as Partial<PetState>;
        setPetState(normalizeState(parsed));
      } catch (error) {
        Alert.alert('Load error', 'Could not load progress, using defaults.');
      } finally {
        setIsHydrated(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await petStorage.setItem(STORAGE_KEY, JSON.stringify(petState));
      } catch (_error) {
        // Keep app running even if persistence fails temporarily.
      }
    };

    if (isHydrated) {
      save();
    }
  }, [petState, isHydrated]);

  const applyAction = useCallback((patchFromPrev: (previous: PetState) => Partial<PetState>) => {
    setPetState(previous => {
      const candidate = normalizeState({
        ...previous,
        ...patchFromPrev(previous),
      });
      candidate.unlockedAchievements = getUnlockedAchievementIds(candidate, previous.unlockedAchievements);
      return candidate;
    });
  }, []);

  const handleFeed = () => {
    applyAction(previous => ({
      hunger: previous.hunger - 10,
      happiness: previous.happiness + 5,
      xp: previous.xp + FEED_XP,
      feedCount: previous.feedCount + 1,
    }));
  };

  const handlePlay = () => {
    applyAction(previous => ({
      hunger: previous.hunger + 5,
      happiness: previous.happiness + 10,
      xp: previous.xp + PLAY_XP,
      playCount: previous.playCount + 1,
    }));
  };

  const handleReset = async () => {
    try {
      await petStorage.removeItem(STORAGE_KEY);
    } finally {
      setPetState(INITIAL_STATE);
      Alert.alert('Progress reset', 'Your pet has been restored to defaults.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <PetCard
        name="Mochi"
        species="Cat"
        hunger={petState.hunger}
        happiness={petState.happiness}
        xp={petState.xp}
        level={level}
        theme={theme}
        achievements={achievements}
        onFeed={handleFeed}
        onPlay={handlePlay}
        onReset={handleReset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    paddingTop: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    gap: 12,
  },
  emphasisBar: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  screenTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  species: {
    textAlign: 'center',
    color: '#475569',
    marginBottom: 4,
  },
  moodLabel: {
    textAlign: 'center',
    color: '#334155',
    marginBottom: 12,
    fontWeight: '600',
  },
  statWrap: {
    width: '100%',
    marginBottom: 10,
  },
  statHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statValue: {
    fontWeight: '700',
    color: '#0f172a',
  },
  statTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  actions: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 10,
    width: '100%',
  },
  actionButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#dbeafe',
    marginTop: 8,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 10,
    marginBottom: 10,
  },
  achievementList: {
    width: '100%',
    maxHeight: 180,
    marginBottom: 10,
  },
  achievementItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  achievementOpen: {
    borderColor: '#4ade80',
    backgroundColor: '#f0fdf4',
  },
  achievementLocked: {
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  achievementTitleOpen: {
    color: '#065f46',
  },
  achievementTitleClosed: {
    color: '#334155',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  resetButton: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 11,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
