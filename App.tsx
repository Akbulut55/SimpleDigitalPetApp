import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PetCard } from './src/components/PetCard';
import { SettingsScreen } from './src/components/SettingsScreen';
import { AchievementsScreen } from './src/components/AchievementsScreen';
import { MiniGameScreen } from './src/components/MiniGameScreen';
import {
  FEED_COIN_COST,
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
import { PetSpriteVariant, PetState } from './src/types/pet';
import { getUnlockedAchievementIds, mapAchievements } from './src/utils/achievements';
import { CAT_VARIANTS, normalizeCatSpriteId } from './src/constants/petSprites';
import { petStorage } from './src/utils/storage';

type AppScreen = 'pet' | 'settings' | 'mini-game' | 'achievements';
type RunningAction = 'feed' | null;
type ActionSpriteConfig = {
  sprite: PetSpriteVariant;
  frameSequence?: number[];
  frameFps?: number;
  frameSpeedMultiplier?: number;
  loop: boolean;
};

const range = (from: number, to: number): number[] => {
  const length = to - from + 1;
  return Array.from({ length }, (_, index) => from + index);
};

const FEED_SLEEP_SEQUENCE = [
  132,
  133,
  33,
  22,
  11,
  16,
  14,
  17,
  ...range(110, 115),
  ...range(286, 293),
  17,
  14,
  16,
  11,
  15,
  ...range(88, 93),
  15,
  11,
  11,
  22,
  33,
  ...range(385, 392),
  ...range(132, 133),
];

const FEED_SLEEP_ACTION_FPS = 24;
const FEED_EAT_ACTION_FPS = 8;
const PALETTES = {
  light: {
    background: '#e2e8f0',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    panel: '#f1f5f9',
    panelBorder: '#dbeafe',
    text: '#0f172a',
    textMuted: '#475569',
    textSubtle: '#64748b',
    chipBackground: '#f1f5f9',
    chipBorder: '#dbeafe',
    surfaceHighlight: '#f8fafc',
    headerBand: '#dbeafe',
    cardBg: '#eff6ff',
    mutedTrack: '#e2e8f0',
    shadowColor: '#0f172a',
    buttonDisabledBg: '#cbd5e1',
    optionBg: '#f8fafc',
    optionBgAlt: '#e2e8f0',
  },
  dark: {
    background: '#020617',
    surface: '#0f172a',
    surfaceAlt: '#1e293b',
    panel: '#1e293b',
    panelBorder: '#334155',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textSubtle: '#64748b',
    chipBackground: '#1e293b',
    chipBorder: '#334155',
    surfaceHighlight: '#1f2937',
    headerBand: '#0f172a',
    cardBg: '#020617',
    mutedTrack: '#1e293b',
    shadowColor: '#020617',
    buttonDisabledBg: '#334155',
    optionBg: '#1e293b',
    optionBgAlt: '#0f172a',
  },
};

const getFeedActionForSprite = (baseSprite: PetSpriteVariant): ActionSpriteConfig => {
  if (baseSprite === 'sleep') {
    return {
      sprite: 'sleep',
      frameSequence: FEED_SLEEP_SEQUENCE,
      frameFps: FEED_SLEEP_ACTION_FPS,
      frameSpeedMultiplier: 1.75,
      loop: false,
    };
  }

  return {
    sprite: 'eat-down',
    frameFps: FEED_EAT_ACTION_FPS,
    frameSpeedMultiplier: 2.4,
    loop: false,
  };
};

const App = () => {
  const [petState, setPetState] = useState<PetState>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<AppScreen>('pet');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const [activeAction, setActiveAction] = useState<ActionSpriteConfig | null>(null);
  const [runningAction, setRunningAction] = useState<RunningAction>(null);
  const [isActionLocked, setIsActionLocked] = useState(false);
  const actionLockedRef = useRef(false);
  const activeActionRef = useRef<RunningAction>(null);
  const feedCompletionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const level = useMemo(() => getLevel(petState.xp), [petState.xp]);
  const moodTheme = useMemo(
    () => getMoodFromState(petState.hunger, petState.happiness),
    [petState.hunger, petState.happiness],
  );

  const achievements = useMemo(
    () => mapAchievements(petState.unlockedAchievements),
    [petState.unlockedAchievements],
  );
  const activePalette = isDarkMode ? PALETTES.dark : PALETTES.light;

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

  useEffect(() => {
    return () => {
      if (feedCompletionTimeoutRef.current !== null) {
        clearTimeout(feedCompletionTimeoutRef.current);
        feedCompletionTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActionLocked && !runningAction) {
      setIsActionLocked(false);
      actionLockedRef.current = false;
      return;
    }

    if (!isActionLocked && !runningAction && activeAction) {
      setActiveAction(null);
    }
  }, [activeAction, isActionLocked, runningAction]);

  const applyAchievements = (nextState: PetState, previous: PetState) => {
    nextState.unlockedAchievements = getUnlockedAchievementIds(nextState, previous.unlockedAchievements);
  };

  const clearFeedCompletionTimeout = () => {
    if (feedCompletionTimeoutRef.current !== null) {
      clearTimeout(feedCompletionTimeoutRef.current);
      feedCompletionTimeoutRef.current = null;
    }
  };

  const scheduleFeedCompletionFallback = (action: ActionSpriteConfig) => {
    const frameCount = action.frameSequence?.length ?? 0;
    const isCustomSequence = action.frameSequence && action.frameSequence.length > 0;
    const actionFps = Math.max(1, action.frameFps ?? (isCustomSequence ? FEED_SLEEP_ACTION_FPS : FEED_EAT_ACTION_FPS));
    const estimatedFrames = frameCount > 0 ? frameCount : 8;
    const estimatedDurationMs = Math.ceil((estimatedFrames / actionFps) * 1000 * 1.5);

    clearFeedCompletionTimeout();
    feedCompletionTimeoutRef.current = setTimeout(() => {
      if (actionLockedRef.current) {
        completeAction();
      }
    }, estimatedDurationMs);
  };

  const mergeSeenQuestionIds = (previous: string[], usedQuestionIds: string[]) => {
    const seenSet = new Set(previous);
    usedQuestionIds.forEach(id => seenSet.add(id));

    const nextSeen = [...seenSet];
    const totalQuestionCount = getMiniGameQuestionCount();

    if (nextSeen.length >= totalQuestionCount) {
      return [];
    }

    return nextSeen;
  };

  const completeAction = () => {
    clearFeedCompletionTimeout();
    const actionToComplete = activeActionRef.current ?? runningAction;

    if (!actionLockedRef.current && !actionToComplete) {
      return;
    }

    setActiveAction(null);
    setRunningAction(null);
    setIsActionLocked(false);
    actionLockedRef.current = false;
    activeActionRef.current = null;

    if (actionToComplete !== 'feed') {
      return;
    }

    setPetState(previous => {
      if (previous.coins < FEED_COIN_COST) {
        return previous;
      }

      const nextState = normalizeState({
        ...previous,
        hunger: previous.hunger - FEED_HUNGER_DROP,
        xp: previous.xp + FEED_XP,
        coins: previous.coins - FEED_COIN_COST,
        feedCount: previous.feedCount + 1,
      });

      applyAchievements(nextState, previous);
      return nextState;
    });
  };

  const handleFeed = () => {
    if (isActionLocked || runningAction === 'feed') {
      Alert.alert('Busy', 'Cat is finishing the previous action. Please wait.');
      return;
    }

    if (petState.coins < FEED_COIN_COST) {
      Alert.alert('Not enough coins', `Play a mini-game to earn coins. Feed cost: ${FEED_COIN_COST} coins.`);
      return;
    }

    const action = getFeedActionForSprite(isIdle ? 'sleep' : moodTheme.sprite);
    setActiveAction(action);
    setRunningAction('feed');
    activeActionRef.current = 'feed';
    setIsActionLocked(true);
    actionLockedRef.current = true;
    scheduleFeedCompletionFallback(action);
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

      applyAchievements(nextState, previous);
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

      applyAchievements(nextState, previous);
      return nextState;
    });

    if (lost) {
      Alert.alert('Mini-Game', 'You lost. No coins this round. Try again!');
    } else {
      Alert.alert('Mini-Game', `Great job! You earned ${correctAnswers} coin${correctAnswers === 1 ? '' : 's'}.`);
    }
  };

  const handleAddTestCoins = () => {
    setPetState(previous => normalizeState({ ...previous, coins: previous.coins + 100 }));
  };

  const handleSelectCatVariant = (spriteId: string) => {
    setPetState(previous => {
      return normalizeState({
        ...previous,
        spriteId: normalizeCatSpriteId(spriteId),
      });
    });
  };

  const handleRename = () =>{
    setRenameValue(petState.name);
    setIsRenameModalOpen(true);
  };

  const handleRenameCancel = () => {
    setIsRenameModalOpen(false);
  };

  const handleRenameSave = () => {
    const nextName = renameValue.trim();

    if (!nextName) {
      Alert.alert('Rename', 'Pet name cannot be empty.');
      return;
    }

    setPetState(previous => normalizeState({ ...previous, name: nextName }));
    setIsRenameModalOpen(false);
  };

  const handleReset = async () => {
    try {
      clearFeedCompletionTimeout();
      await petStorage.removeItem(STORAGE_KEY);
    } finally {
      setActiveAction(null);
      setRunningAction(null);
      setIsActionLocked(false);
      activeActionRef.current = null;
      actionLockedRef.current = false;
      setPetState(INITIAL_STATE);
      setActiveScreen('pet');
      Alert.alert('Progress reset', 'Your pet has been restored to defaults.');
    }
  };

  const isIdle = activeScreen === 'pet' && !activeAction;
  const displaySprite = isIdle ? 'sleep' : activeAction ? activeAction.sprite : moodTheme.sprite;
  const isActionLooping = activeAction ? activeAction.loop : true;
  const cardTheme = { ...moodTheme, sprite: displaySprite, spriteId: petState.spriteId };
  const isFeedInProgress = isActionLocked || runningAction === 'feed';
  const renameDialog = (
    <Modal visible={isRenameModalOpen} transparent animationType="fade" onRequestClose={handleRenameCancel}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.renameModal, { backgroundColor: activePalette.surface, borderColor: activePalette.panelBorder }]}> 
          <Text style={[styles.renameTitle, { color: activePalette.text }]}>Rename pet</Text>
          <TextInput
            style={[styles.renameInput, { borderColor: activePalette.panelBorder, color: activePalette.text, backgroundColor: activePalette.surfaceAlt }]}
            value={renameValue}
            onChangeText={setRenameValue}
            placeholder="Pet name"
            placeholderTextColor={activePalette.textSubtle}
            maxLength={18}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
          />
          <View style={styles.renameActions}>
            <TouchableOpacity
              style={[styles.renameButton, { borderColor: activePalette.panelBorder, backgroundColor: activePalette.surfaceAlt }]}
              onPress={handleRenameCancel}
            >
              <Text style={[styles.renameButtonText, { color: activePalette.textMuted }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.renameButton, { borderColor: '#0f766e', backgroundColor: '#0f766e' }]}
              onPress={handleRenameSave}
            >
              <Text style={styles.renameButtonTextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (activeScreen === 'settings') {
    return (
      <View style={[styles.container, { backgroundColor: activePalette.background }]}> 
        <ScrollView style={styles.scroll} contentContainerStyle={styles.screenContent}>
          <SettingsScreen
            coins={petState.coins}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(previous => !previous)}
            palette={activePalette}
            onBack={() => setActiveScreen('pet')}
            onResetProgress={handleReset}
            onAddTestCoins={handleAddTestCoins}
            onRename={handleRename}
            catVariants={CAT_VARIANTS}
            selectedCatVariant={petState.spriteId}
            onSelectCatVariant={handleSelectCatVariant}
          />
        </ScrollView>
        {renameDialog}
      </View>
    );
  }

  if (activeScreen === 'mini-game') {
    return (
      <View style={[styles.container, { backgroundColor: activePalette.background }]}> 
        <ScrollView style={styles.scroll} contentContainerStyle={styles.screenContent}>
          <MiniGameScreen
            alreadySeenQuestionIds={petState.seenMiniGameQuestionIds}
            palette={activePalette}
            onBack={() => setActiveScreen('pet')}
            onComplete={handleMiniGameComplete}
          />
        </ScrollView>
        {renameDialog}
      </View>
    );
  }

  if (activeScreen === 'achievements') {
    return (
      <View style={[styles.container, { backgroundColor: activePalette.background }]}> 
        <ScrollView style={styles.scroll} contentContainerStyle={styles.screenContent}>
          <AchievementsScreen achievements={achievements} onBack={() => setActiveScreen('pet')} palette={activePalette} />
        </ScrollView>
        {renameDialog}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: activePalette.background }]}> 
      <ScrollView style={styles.scroll} contentContainerStyle={styles.screenContent}>
        <PetCard
          name={petState.name}
          species="Cat"
          hunger={petState.hunger}
          happiness={petState.happiness}
          coins={petState.coins}
          xp={petState.xp}
          level={level}
          feedCost={FEED_COIN_COST}
          theme={
            {
              ...cardTheme,
              sprite: displaySprite,
            }
          }
          frameSequence={activeAction?.frameSequence}
          sequenceFps={activeAction?.frameFps}
          sequenceSpeedMultiplier={activeAction?.frameSpeedMultiplier ?? 1}
          loopAnimation={isActionLooping}
          onActionSequenceComplete={completeAction}
          isFeedInProgress={isFeedInProgress}
          achievements={achievements}
          onFeed={handleFeed}
          onPlay={handlePlay}
          onMiniGame={() => setActiveScreen('mini-game')}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenAchievements={() => setActiveScreen('achievements')}
          palette={activePalette}
        />
      </ScrollView>
        {renameDialog}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#e2e8f0',
  },
  scroll: {
    width: '100%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  renameModal: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  renameTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  renameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    fontSize: 18,
  },
  renameActions: {
    flexDirection: 'row',
    gap: 10,
  },
  renameButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  renameButtonTextSave: {
    fontWeight: '700',
    fontSize: 14,
    color: '#ffffff',
  },  screenContent: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
  },
});

export default App;


















