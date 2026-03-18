import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PetCardProps } from '../types/pet';
import { ActionButton } from './ActionButton';
import { PixelCat } from './PixelCat';
import { StatBar } from './StatBar';

export const PetCard = ({
  name,
  species,
  hunger,
  happiness,
  coins,
  xp,
  level,
  feedCost,
  theme,
  palette,
  achievements,
  onFeed,
  onPlay,
  onMiniGame,

  onOpenSettings,
  onOpenAchievements,
  isFeedInProgress = false,
  frameSequence,
  sequenceFps,
  sequenceSpeedMultiplier,
  loopAnimation = true,
  onActionSequenceComplete,
}: PetCardProps) => {
  const xpProgress = xp % 100;
  const canFeed = coins >= feedCost && !isFeedInProgress;
  const spriteScale = 9;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const showMoodChip = theme.mood.toLowerCase() !== 'normal';

  return (
    <View style={styles.page}>
      <View style={[styles.hero, { backgroundColor: palette.surface, borderColor: palette.panelBorder }]}> 
        <View style={[styles.heroBand, { backgroundColor: palette.headerBand }]}> 
          <Text style={[styles.appPill, { color: palette.textMuted }]}>Digital Pet</Text>
        </View>
        <View style={styles.heroTitleRow}>
          <View>
            <Text style={[styles.name, { color: palette.text }]}>{name}</Text>
            <Text style={[styles.species, { color: palette.textMuted }]}>A curious {species}</Text>
          </View>
          {showMoodChip ? (
            <View style={[styles.moodChip, { backgroundColor: palette.surfaceAlt }]}> 
              <Text style={[styles.moodText, { color: palette.text }]}>{theme.mood}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={[styles.showcaseCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <View style={styles.showcaseHead}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Pet Window</Text>
          <Text style={[styles.sectionMeta, { color: palette.textMuted }]}>Level {level}</Text>
        </View>
        <View
          style={[
            styles.stage,
            {
              borderColor: `${palette.panelBorder}88`,
              shadowColor: palette.shadowColor,
            },
          ]}
        >
          <PixelCat
            mood={theme.sprite}
            scale={spriteScale}
            spriteId={theme.spriteId}
            frameSequence={frameSequence}
            sequenceFps={sequenceFps}
            sequenceSpeedMultiplier={sequenceSpeedMultiplier}
            loop={loopAnimation}
            onSequenceComplete={onActionSequenceComplete}
          />
        </View>
      </View>

      <View style={styles.statStack}>
        <StatBar label="Hunger" value={hunger} fillColor="#f97316" palette={palette} />
        <StatBar label="Happiness" value={happiness} fillColor="#22c55e" palette={palette} />
      </View>

      <View style={styles.keyGrid}>
        <View style={[styles.keyItem, { backgroundColor: palette.surfaceAlt, borderColor: palette.panelBorder }]}> 
          <Text style={[styles.keyIcon, { color: palette.text }]}>C</Text>
          <Text style={[styles.keyLabel, { color: palette.textMuted }]}>Coins</Text>
          <Text style={[styles.keyValue, { color: palette.text }]}>{coins}</Text>
        </View>
        <View style={[styles.keyItem, { backgroundColor: palette.surfaceAlt, borderColor: palette.panelBorder }]}>
          <Text style={[styles.keyIcon, { color: palette.text }]}>XP</Text>
          <Text style={[styles.keyLabel, { color: palette.textMuted }]}>XP</Text>
          <Text style={[styles.keyValue, { color: palette.text }]}>{xp}</Text>
        </View>
        <View style={[styles.keyItem, { backgroundColor: palette.surfaceAlt, borderColor: palette.panelBorder }]}> 
          <Text style={[styles.keyIcon, { color: palette.text }]}>A</Text>
          <Text style={[styles.keyLabel, { color: palette.textMuted }]}>Achievements</Text>
          <Text style={[styles.keyValue, { color: palette.text }]}>{unlockedCount}</Text>
        </View>
      </View>

      <View style={[styles.progressWrap, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.progressTitle, { color: palette.text }]}>XP to next level</Text>
        <Text style={[styles.progressMeta, { color: palette.textMuted }]}>Level {level} progress</Text>
        <View style={[styles.progressTrack, { backgroundColor: palette.mutedTrack }]}> 
          <View
            style={[styles.progressFill, { width: `${xpProgress}%`, backgroundColor: theme.buttonBg }]}
          />
        </View>
      </View>

      <View style={[styles.actionSurface, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Actions</Text>
        <View style={styles.actions}>
          <ActionButton title={`Feed (${feedCost} coins)`} color={theme.buttonBg} onPress={onFeed} disabled={!canFeed} isDarkMode={palette.text === '#f8fafc'} />
          <ActionButton title="Play" color="#0f766e" onPress={onPlay} disabled={false} isDarkMode={palette.text === '#f8fafc'} />
          <ActionButton title="Mini-Game" color="#4338ca" onPress={onMiniGame} disabled={false} isDarkMode={palette.text === '#f8fafc'} />

          <ActionButton title="Achievements" color="#2563eb" onPress={onOpenAchievements} isDarkMode={palette.text === '#f8fafc'} />
          <ActionButton title="Settings" color="#334155" onPress={onOpenSettings} isDarkMode={palette.text === '#f8fafc'} />
        </View>
      </View>

      <View
        style={[
          styles.achievementSummary,
          { borderColor: palette.panelBorder, backgroundColor: palette.surface },
        ]}
      >
        <Text style={[styles.achievementSummaryTitle, { color: palette.text }]}>Achievement Progress</Text>
        <Text style={[styles.achievementSummaryValue, { color: palette.textMuted }]}> 
          {unlockedCount}/{achievements.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: 470,
    gap: 12,
  },
  hero: {
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBand: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  appPill: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroTitleRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  species: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  moodChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moodText: {
    fontWeight: '700',
    fontSize: 12,
  },
  showcaseCard: {
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },
  showcaseHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    borderRadius: 18,
    borderWidth: 1,

    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  statStack: {
    width: '100%',
  },
  keyGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  keyItem: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  keyIcon: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '700',
  },
  keyLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  keyValue: {
    fontWeight: '800',
    fontSize: 18,
  },
  progressWrap: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  progressTitle: {
    fontWeight: '700',
  },
  progressMeta: {
    fontSize: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  actionSurface: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },
  actions: {
    gap: 8,
  },
  achievementSummary: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 11,
  },
  achievementSummaryTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  achievementSummaryValue: {
    marginTop: 2,
    fontSize: 12,
  },
});










