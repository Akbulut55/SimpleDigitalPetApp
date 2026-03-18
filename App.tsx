import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AchievementsScreen } from './src/components/AchievementsScreen';
import { MiniGameScreen } from './src/components/MiniGameScreen';
import { PetCard } from './src/components/PetCard';
import { SettingsScreen } from './src/components/SettingsScreen';
import {
  CAT_VARIANTS,
  getCatVariantMeta,
  normalizeCatSpriteId,
} from './src/constants/petSprites';
import { CatProfile, PetSpriteVariant, PetState } from './src/types/pet';
import { getUnlockedAchievementIds, mapAchievements } from './src/utils/achievements';
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
import { petStorage } from './src/utils/storage';

type AppScreen = 'pet' | 'settings' | 'mini-game' | 'achievements';
type RunningAction = { type: 'feed'; catId: string } | null;
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
    background: '#edf4fb',
    surface: '#ffffff',
    surfaceAlt: '#f7fbff',
    panel: '#edf5fb',
    panelBorder: '#d7e4ef',
    text: '#132238',
    textMuted: '#5b6b80',
    textSubtle: '#7b8aa0',
    chipBackground: '#eef6ff',
    chipBorder: '#d3e3f3',
    surfaceHighlight: '#ffffff',
    headerBand: '#e4f1ff',
    cardBg: '#f4f9ff',
    mutedTrack: '#dbe7f1',
    shadowColor: '#0f172a',
    buttonDisabledBg: '#c8d5e1',
    optionBg: '#f7fbff',
    optionBgAlt: '#e8f1fa',
  },
  dark: {
    background: '#07111f',
    surface: '#101b2d',
    surfaceAlt: '#162338',
    panel: '#122033',
    panelBorder: '#243247',
    text: '#f5f7fb',
    textMuted: '#a7b3c7',
    textSubtle: '#7d8aa2',
    chipBackground: '#18253a',
    chipBorder: '#2c3b54',
    surfaceHighlight: '#1b2a41',
    headerBand: '#132033',
    cardBg: '#0d1728',
    mutedTrack: '#23324b',
    shadowColor: '#020617',
    buttonDisabledBg: '#334155',
    optionBg: '#18253a',
    optionBgAlt: '#122033',
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

const getCatById = (state: PetState, catId: string): CatProfile => {
  return state.cats.find(cat => cat.id === catId) ?? state.cats[0];
};

const isCatUnlocked = (state: PetState, catId: string) => state.unlockedCatIds.includes(catId);

const buildAchievementSnapshot = (state: PetState, catId: string) => {
  const cat = getCatById(state, catId);

  return {
    hunger: cat.hunger,
    happiness: cat.happiness,
    xp: state.xp,
    coins: state.coins,
    feedCount: state.feedCount,
    playCount: state.playCount,
    miniGameCount: state.miniGameCount,
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

  const currentCat = useMemo(
    () => getCatById(petState, petState.activeCatId),
    [petState],
  );
  const currentVariant = useMemo(
    () => getCatVariantMeta(currentCat.spriteId),
    [currentCat.spriteId],
  );
  const level = useMemo(() => getLevel(petState.xp), [petState.xp]);
  const moodTheme = useMemo(
    () => getMoodFromState(currentCat.hunger, currentCat.happiness),
    [currentCat.happiness, currentCat.hunger],
  );
  const achievements = useMemo(
    () => mapAchievements(petState.unlockedAchievements),
    [petState.unlockedAchievements],
  );
  const activePalette = isDarkMode ? PALETTES.dark : PALETTES.light;
  const settingsCats = useMemo(
    () =>
      CAT_VARIANTS.map(variant => {
        const cat = petState.cats.find(item => item.id === variant.id) ?? currentCat;
        const unlocked = isCatUnlocked(petState, cat.id);

        return {
          id: cat.id,
          name: cat.name,
          label: variant.label,
          hunger: cat.hunger,
          happiness: cat.happiness,
          accent: variant.accent,
          surface: variant.surface,
          unlockCost: variant.unlockCost,
          isActive: petState.activeCatId === cat.id,
          isUnlocked: unlocked,
        };
      }),
    [currentCat, petState],
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
        loaded.unlockedAchievements = getUnlockedAchievementIds(
          buildAchievementSnapshot(loaded, loaded.activeCatId),
          loaded.unlockedAchievements,
        );
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
  }, [isHydrated, petState]);

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

  const applyAchievements = (nextState: PetState, previous: PetState, catId: string) => {
    nextState.unlockedAchievements = getUnlockedAchievementIds(
      buildAchievementSnapshot(nextState, catId),
      previous.unlockedAchievements,
    );
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

    if (!actionLockedRef.current || !actionToComplete) {
      return;
    }

    setActiveAction(null);
    setRunningAction(null);
    setIsActionLocked(false);
    actionLockedRef.current = false;
    activeActionRef.current = null;

    if (actionToComplete.type !== 'feed') {
      return;
    }

    setPetState(previous => {
      if (previous.coins < FEED_COIN_COST) {
        return previous;
      }

      const nextState = normalizeState({
        ...previous,
        cats: previous.cats.map(cat =>
          cat.id === actionToComplete.catId
            ? { ...cat, hunger: cat.hunger - FEED_HUNGER_DROP }
            : cat,
        ),
        xp: previous.xp + FEED_XP,
        coins: previous.coins - FEED_COIN_COST,
        feedCount: previous.feedCount + 1,
      });

      applyAchievements(nextState, previous, actionToComplete.catId);
      return nextState;
    });
  };

  const handleFeed = () => {
    if (isActionLocked || runningAction?.type === 'feed') {
      Alert.alert('Busy', 'Cat is finishing the previous action. Please wait.');
      return;
    }

    if (petState.coins < FEED_COIN_COST) {
      Alert.alert('Not enough coins', `Play a mini-game to earn coins. Feed cost: ${FEED_COIN_COST} coins.`);
      return;
    }

    const action = getFeedActionForSprite(isIdle ? 'sleep' : moodTheme.sprite);
    const nextRunningAction = { type: 'feed', catId: currentCat.id } as const;

    setActiveAction(action);
    setRunningAction(nextRunningAction);
    activeActionRef.current = nextRunningAction;
    setIsActionLocked(true);
    actionLockedRef.current = true;
    scheduleFeedCompletionFallback(action);
  };

  const handlePlay = () => {
    const targetCatId = currentCat.id;

    setPetState(previous => {
      const nextState = normalizeState({
        ...previous,
        cats: previous.cats.map(cat =>
          cat.id === targetCatId
            ? {
                ...cat,
                hunger: cat.hunger + PLAY_HUNGER_RISE,
                happiness: cat.happiness + PLAY_HAPPINESS_GAIN,
              }
            : cat,
        ),
        xp: previous.xp + PLAY_XP,
        playCount: previous.playCount + 1,
      });

      applyAchievements(nextState, previous, targetCatId);
      return nextState;
    });
  };

  const handleMiniGameComplete = (correctAnswers: number, lost: boolean, usedQuestionIds: string[]) => {
    const targetCatId = currentCat.id;

    setPetState(previous => {
      const nextSeen = mergeSeenQuestionIds(previous.seenMiniGameQuestionIds, usedQuestionIds);
      const nextState = normalizeState({
        ...previous,
        cats: previous.cats.map(cat =>
          cat.id === targetCatId
            ? {
                ...cat,
                hunger: cat.hunger + MINIGAME_HUNGER_INCREASE,
                happiness: cat.happiness - MINIGAME_HAPPINESS_DECREASE,
              }
            : cat,
        ),
        xp: previous.xp + (lost ? 0 : correctAnswers * 2),
        coins: previous.coins + (lost ? 0 : correctAnswers),
        miniGameCount: previous.miniGameCount + 1,
        seenMiniGameQuestionIds: nextSeen,
      });

      applyAchievements(nextState, previous, targetCatId);
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
    if (isActionLocked) {
      Alert.alert('Busy', 'Wait for the current cat action to finish before switching cats.');
      return;
    }

    const nextCatId = normalizeCatSpriteId(spriteId);
    const variant = getCatVariantMeta(nextCatId);

    if (isCatUnlocked(petState, nextCatId)) {
      setPetState(previous => normalizeState({ ...previous, activeCatId: nextCatId }));
      return;
    }

    if (petState.coins < variant.unlockCost) {
      Alert.alert('Cat locked', `${variant.label} costs ${variant.unlockCost} coins to unlock.`);
      return;
    }

    setPetState(previous =>
      normalizeState({
        ...previous,
        activeCatId: nextCatId,
        coins: previous.coins - variant.unlockCost,
        unlockedCatIds: [...previous.unlockedCatIds, nextCatId],
      }),
    );
    Alert.alert('Cat unlocked', `${variant.label} is now available and has been set as your active cat.`);
  };

  const handleRename = () => {
    setRenameValue(currentCat.name);
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

    setPetState(previous =>
      normalizeState({
        ...previous,
        cats: previous.cats.map(cat =>
          cat.id === previous.activeCatId ? { ...cat, name: nextName } : cat,
        ),
      }),
    );
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
      Alert.alert('Progress reset', 'Gray cat is free again and the locked cats can be re-unlocked with coins.');
    }
  };

  const isIdle = activeScreen === 'pet' && !activeAction;
  const displaySprite = isIdle ? 'sleep' : activeAction ? activeAction.sprite : moodTheme.sprite;
  const isActionLooping = activeAction ? activeAction.loop : true;
  const cardTheme = {
    ...moodTheme,
    sprite: displaySprite,
    spriteId: currentCat.spriteId,
    accent: currentVariant.accent,
    accentSoft: currentVariant.surface,
    variantLabel: currentVariant.label,
  };
  const isFeedInProgress = isActionLocked || runningAction?.type === 'feed';

  const renameDialog = (
    <Modal visible={isRenameModalOpen} transparent animationType="fade" onRequestClose={handleRenameCancel}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.renameModal, { backgroundColor: activePalette.surface, borderColor: activePalette.panelBorder }]}> 
          <Text style={[styles.renameTitle, { color: activePalette.text }]}>Rename current cat</Text>
          <Text style={[styles.renameSubtitle, { color: activePalette.textMuted }]}>You're renaming {currentCat.name}.</Text>
          <TextInput
            style={[styles.renameInput, { borderColor: activePalette.panelBorder, color: activePalette.text, backgroundColor: activePalette.surfaceAlt }]}
            value={renameValue}
            onChangeText={setRenameValue}
            placeholder="Cat name"
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
            cats={settingsCats}
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
          name={currentCat.name}
          species={currentVariant.label}
          hunger={currentCat.hunger}
          happiness={currentCat.happiness}
          coins={petState.coins}
          xp={petState.xp}
          level={level}
          feedCost={FEED_COIN_COST}
          theme={cardTheme}
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
    backgroundColor: '#edf4fb',
  },
  scroll: {
    width: '100%',
  },
  screenContent: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  renameModal: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 20,
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
  renameSubtitle: {
    fontSize: 13,
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
  },
});

export default App;
