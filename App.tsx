import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { PetCard } from './src/components/PetCard';
import { SettingsScreen } from './src/components/SettingsScreen';
import { MiniGameScreen } from './src/components/MiniGameScreen';
import {
  FEED_COIN_COST,
  FEED_HAPPINESS_GAIN,
  FEED_HUNGER_DROP,
  FEED_XP,
  getLevel,
  getMoodFromState,
  INITIAL_STATE,
  MINIGAME_HAPPINESS_DECREASE,
  MINIGAME_HUNGER_INCREASE,
  normalizeState,
  PLAY_HAPPINESS_GAIN,
  PLAY_HUNGER_RISE,
  PLAY_XP,
  STORAGE_KEY,
} from './src/utils/gameLogic';
import { getMiniGameQuestionCount } from './src/utils/miniGame';
import { PetState } from './src/types/pet';
import { getUnlockedAchievementIds, mapAchievements } from './src/utils/achievements';
import { petStorage } from './src/utils/storage';

type AppScreen = 'pet' | 'settings' | 'mini-game';

const App = () => {
  const [petState, setPetState] = useState<PetState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('pet');

  const level = useMemo(() => getLevel(petState.xp), [petState.xp]);
  const theme = useMemo(
    () => getMoodFromState(petState.hunger, petState.happiness),
    [petState.hunger, petState.happiness],
  );
  const achievements = useMemo(
    () => mapAchievements(petState.unlockedAchievements),
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
        const loaded = normalizeState(parsed);
        loaded.unlockedAchievements = getUnlockedAchievementIds(loaded, loaded.unlockedAchievements);
        setPetState(loaded);
      } catch (_error) {
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

  const refreshAchievements = (nextState: PetState, previous: PetState) => {
    nextState.unlockedAchievements = getUnlockedAchievementIds(nextState, previous.unlockedAchievements);
  };

  const mergeSeenQuestionIds = (
    previous: string[],
    usedQuestionIds: string[],
  ) => {
    const seenSet = new Set(previous);
    usedQuestionIds.forEach(id => seenSet.add(id));

    const nextSeen = [...seenSet];
    const totalQuestionCount = getMiniGameQuestionCount();

    if (nextSeen.length >= totalQuestionCount) {
      return [];
    }

    return nextSeen;
  };

  const handleFeed = () => {
    if (petState.coins < FEED_COIN_COST) {
      Alert.alert('Not enough coins', `Play a mini-game to earn coins. Feed cost: ${FEED_COIN_COST} coins.`);
      return;
    }

    setPetState(previous => {
      if (previous.coins < FEED_COIN_COST) {
        return previous;
      }

      const nextState = normalizeState({
        ...previous,
        hunger: previous.hunger - FEED_HUNGER_DROP,
        happiness: previous.happiness + FEED_HAPPINESS_GAIN,
        xp: previous.xp + FEED_XP,
        coins: previous.coins - FEED_COIN_COST,
        feedCount: previous.feedCount + 1,
      });

      refreshAchievements(nextState, previous);
      return nextState;
    });
  };

  const handlePlay = () => {
    setPetState(previous => {
      const nextState = normalizeState({
        ...previous,
        hunger: previous.hunger + PLAY_HUNGER_RISE,
        happiness: previous.happiness + PLAY_HAPPINESS_GAIN,
        xp: previous.xp + PLAY_XP,
        playCount: previous.playCount + 1,
      });

      refreshAchievements(nextState, previous);
      return nextState;
    });
  };

  const handleMiniGameComplete = (correctAnswers: number, lost: boolean, usedQuestionIds: string[]) => {
    setPetState(previous => {
      const nextSeen = mergeSeenQuestionIds(previous.seenMiniGameQuestionIds, usedQuestionIds);

      const nextState = normalizeState({
        ...previous,
        hunger: previous.hunger + MINIGAME_HUNGER_INCREASE,
        happiness: previous.happiness - MINIGAME_HAPPINESS_DECREASE,
        xp: previous.xp + (lost ? 0 : correctAnswers * 2),
        coins: previous.coins + (lost ? 0 : correctAnswers),
        miniGameCount: previous.miniGameCount + 1,
        seenMiniGameQuestionIds: nextSeen,
      });

      refreshAchievements(nextState, previous);
      return nextState;
    });

    if (lost) {
      Alert.alert('Mini-Game', 'You lost. No coins this round. Try again!');
    } else {
      Alert.alert('Mini-Game', `Great job! You earned ${correctAnswers} coin${correctAnswers === 1 ? '' : 's'}.`);
    }
  };

  const handleReset = async () => {
    try {
      await petStorage.removeItem(STORAGE_KEY);
    } finally {
      setPetState(INITIAL_STATE);
      setActiveScreen('pet');
      Alert.alert('Progress reset', 'Your pet has been restored to defaults.');
    }
  };

  if (activeScreen === 'settings') {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBg }]}> 
        <SettingsScreen
          coins={petState.coins}
          onBack={() => setActiveScreen('pet')}
          onResetProgress={handleReset}
        />
      </View>
    );
  }

  if (activeScreen === 'mini-game') {
    return (
      <View style={[styles.container, { backgroundColor: theme.cardBg }]}> 
        <MiniGameScreen
          alreadySeenQuestionIds={petState.seenMiniGameQuestionIds}
          onBack={() => setActiveScreen('pet')}
          onComplete={handleMiniGameComplete}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}> 
      <PetCard
        name="Mochi"
        species="Cat"
        hunger={petState.hunger}
        happiness={petState.happiness}
        coins={petState.coins}
        xp={petState.xp}
        level={level}
        feedCost={FEED_COIN_COST}
        theme={theme}
        achievements={achievements}
        onFeed={handleFeed}
        onPlay={handlePlay}
        onMiniGame={() => setActiveScreen('mini-game')}
        onOpenSettings={() => setActiveScreen('settings')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});

export default App;
