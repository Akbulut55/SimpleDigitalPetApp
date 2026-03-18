import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Achievement, AppPalette } from '../types/pet';
import { ActionButton } from './ActionButton';

type AchievementsScreenProps = {
  achievements: Achievement[];
  onBack: () => void;
  palette: AppPalette;
  onResetAchievements?: () => void;
};

export const AchievementsScreen = ({ achievements, onBack, palette, onResetAchievements }: AchievementsScreenProps) => {
  const unlockedCount = achievements.filter(item => item.unlocked).length;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}> 
      <View style={[styles.headerCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.title, { color: palette.text }]}>Achievements</Text>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}> 
          {unlockedCount}/{achievements.length} unlocked
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {achievements.map(item => (
          <View
            key={item.id}
            style={[
              styles.row,
              {
                backgroundColor: palette.surface,
                borderColor: palette.panelBorder,
              },
            ]}
          >
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: item.unlocked ? '#dcfce7' : palette.surfaceAlt,
                  borderColor: item.unlocked ? '#86efac' : palette.panelBorder,
                },
              ]}
            >
              <Text style={[styles.iconText, { color: item.unlocked ? '#166534' : palette.textMuted }]}> 
                {item.unlocked ? 'OK' : '___'}
              </Text>
            </View>
            <View style={styles.rowTextWrap}>
              <Text style={[styles.rowTitle, { color: palette.text }]}>{item.title}</Text>
              {item.unlocked ? (
                <Text style={[styles.rowDescription, { color: palette.textMuted }]}>{item.description}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ActionButton title="Back to Pet" color="#8b5cf6" onPress={onBack} isDarkMode={palette.text === '#f8fafc'} />
        {onResetAchievements ? (
          <ActionButton title="Reset Achievements" color="#ef4444" onPress={onResetAchievements} isDarkMode={palette.text === '#f8fafc'} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 470,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 0,
  },
  headerCard: {
    width: '100%',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    gap: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
  },
  list: {
    width: '100%',
    maxHeight: 520,
  },
  listContent: {
    gap: 8,
    paddingBottom: 4,
  },
  row: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    width: 34,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    width: '100%',
    marginTop: 24,
    gap: 10,
  },
});

