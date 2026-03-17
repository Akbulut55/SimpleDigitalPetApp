import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PetCardProps } from '../types/pet';
import { ActionButton } from './ActionButton';
import { AchievementList } from './AchievementList';
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
  achievements,
  onFeed,
  onPlay,
  onMiniGame,
  onOpenSettings,
}: PetCardProps) => {
  const xpProgress = xp % 100;
  const canFeed = coins >= feedCost;

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}> 
      <View style={[styles.accentStrip, { backgroundColor: theme.border }]} />

      <View style={styles.topArea}>
        <View>
          <Text style={styles.screenTitle}>Digital Pet</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.species}>A curious {species}</Text>
        </View>

        <View style={styles.headerBadge}>
          <Text style={styles.moodLabel}>{theme.mood}</Text>
        </View>
      </View>

      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{theme.emoji}</Text>
      </View>

      <StatBar label="Hunger" value={hunger} fillColor="#f97316" />
      <StatBar label="Happiness" value={happiness} fillColor="#22c55e" />

      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Coins</Text>
          <Text style={styles.statCardValue}>{coins}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>XP</Text>
          <Text style={styles.statCardValue}>{xp}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Level</Text>
          <Text style={styles.statCardValue}>{level}</Text>
        </View>
      </View>

      <View style={[styles.progressWrap, { borderColor: theme.border }]}> 
        <Text style={styles.progressLabel}>Level {level}</Text>
        <Text style={styles.metaText}>XP this level</Text>
        <View style={styles.statTrack}>
          <View style={[styles.statFill, { width: `${xpProgress}%`, backgroundColor: theme.buttonBg }]} />
        </View>
      </View>

      <View style={[styles.actions, { borderTopColor: theme.border }]}> 
        <ActionButton title={`Feed (${feedCost} coins)`} color={theme.buttonBg} onPress={onFeed} disabled={!canFeed} />
        <ActionButton title="Play" color="#0f766e" onPress={onPlay} />
        <ActionButton title="Mini-Game" color="#9333ea" onPress={onMiniGame} />
      </View>

      <ActionButton title="Settings" color="#334155" onPress={onOpenSettings} />

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Achievements</Text>
      <AchievementList items={achievements} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    paddingTop: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 8,
  },
  topArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  screenTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  species: {
    color: '#475569',
    marginBottom: 2,
  },
  moodLabel: {
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0f172a',
    fontWeight: '700',
  },
  emojiWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 46,
  },
  statGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    padding: 10,
    alignItems: 'center',
  },
  statCardLabel: {
    color: '#475569',
    fontSize: 12,
    marginBottom: 2,
  },
  statCardValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  progressWrap: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  progressLabel: {
    color: '#0f172a',
    fontWeight: '700',
  },
  metaText: {
    color: '#475569',
    fontSize: 12,
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
  actions: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 10,
    width: '100%',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#dbeafe',
    marginTop: 4,
  },
  sectionTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 10,
    marginBottom: 10,
  },
});
