import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppPalette } from '../types/pet';
import { ActionButton } from './ActionButton';

type SettingsCatCard = {
  id: string;
  name: string;
  label: string;
  hunger: number;
  happiness: number;
  accent: string;
  surface: string;
  unlockCost: number;
  isActive: boolean;
  isUnlocked: boolean;
};

type SettingsScreenProps = {
  coins: number;
  onBack: () => void;
  onResetProgress: () => void;
  onAddTestCoins: () => void;
  onRename: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  palette: AppPalette;
  cats: SettingsCatCard[];
  onSelectCatVariant: (id: string) => void;
};

export const SettingsScreen = ({
  coins,
  onBack,
  onResetProgress,
  onAddTestCoins,
  onRename,
  isDarkMode,
  onToggleDarkMode,
  palette,
  cats,
  onSelectCatVariant,
}: SettingsScreenProps) => {
  const isDark = palette.text === '#f8fafc';

  return (
    <View style={styles.container}>
      <View style={[styles.headerCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.title, { color: palette.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Gray cat starts free. Other cats unlock using your shared coins.</Text>
      </View>

      <View style={[styles.statsSurface, { borderColor: palette.panelBorder, backgroundColor: palette.surfaceAlt }]}> 
        <Text style={[styles.infoLabel, { color: palette.textMuted }]}>Shared Coins</Text>
        <Text style={[styles.infoValue, { color: palette.text }]}>{coins}</Text>
      </View>

      <View style={[styles.preferenceCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.preferenceTitle, { color: palette.text }]}>Appearance</Text>
        <TouchableOpacity
          style={[styles.preferenceRow, { borderColor: palette.panelBorder, backgroundColor: palette.surfaceAlt }]}
          onPress={onToggleDarkMode}
          activeOpacity={0.7}
        >
          <Text style={[styles.preferenceLabel, { color: palette.text }]}>Dark Mode</Text>
          <Text style={[styles.preferenceValue, { color: palette.textMuted }]}>{isDarkMode ? 'On' : 'Off'}</Text>
          <Switch value={isDarkMode} onValueChange={onToggleDarkMode} trackColor={{ false: '#94a3b8', true: '#8b5cf6' }} />
        </TouchableOpacity>
      </View>

      <View style={[styles.preferenceCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.preferenceTitle, { color: palette.text }]}>Your Cats</Text>
        <Text style={[styles.preferenceHint, { color: palette.textMuted }]}>Tap an unlocked cat to switch. Tap a locked cat to buy it.</Text>
        <View style={styles.catList}>
          {cats.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catCard,
                {
                  borderColor: cat.isActive ? cat.accent : palette.panelBorder,
                  backgroundColor: cat.isActive ? cat.surface : palette.surfaceAlt,
                  opacity: cat.isUnlocked ? 1 : 0.92,
                },
              ]}
              onPress={() => onSelectCatVariant(cat.id)}
              activeOpacity={0.82}
            >
              <View style={styles.catHeader}>
                <View style={styles.catHeaderText}>
                  <Text style={[styles.catName, { color: palette.text }]}>{cat.name}</Text>
                  <Text style={[styles.catLabel, { color: palette.textMuted }]}>{cat.label}</Text>
                </View>
                <View
                  style={[
                    styles.catBadge,
                    {
                      backgroundColor: cat.isActive ? cat.accent : cat.isUnlocked ? palette.chipBackground : '#fee2e2',
                      borderColor: cat.isActive ? cat.accent : cat.isUnlocked ? palette.chipBorder : '#fca5a5',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catBadgeText,
                      { color: cat.isActive ? '#ffffff' : cat.isUnlocked ? palette.textMuted : '#b91c1c' },
                    ]}
                  >
                    {cat.isActive ? 'Active' : cat.isUnlocked ? 'Switch' : `${cat.unlockCost} Coins`}
                  </Text>
                </View>
              </View>

              <View style={styles.catStatsRow}>
                <View style={[styles.catStatPill, { borderColor: `${cat.accent}44`, backgroundColor: palette.surface }]}> 
                  <Text style={[styles.catStatLabel, { color: palette.textMuted }]}>Hunger</Text>
                  <Text style={[styles.catStatValue, { color: palette.text }]}>{cat.hunger}</Text>
                </View>
                <View style={[styles.catStatPill, { borderColor: `${cat.accent}44`, backgroundColor: palette.surface }]}> 
                  <Text style={[styles.catStatLabel, { color: palette.textMuted }]}>Happiness</Text>
                  <Text style={[styles.catStatValue, { color: palette.text }]}>{cat.happiness}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionColumn}>
        <ActionButton title="Rename Current Cat" color="#10b981" onPress={onRename} isDarkMode={isDark} />
        <ActionButton title="Add 100 Coins (Test)" color="#3b82f6" onPress={onAddTestCoins} isDarkMode={isDark} />
        <ActionButton title="Reset Progress" color="#ef4444" onPress={onResetProgress} isDarkMode={isDark} />
        <ActionButton title="Back to Pet" color="#8b5cf6" onPress={onBack} isDarkMode={isDark} />
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
  },
  headerCard: {
    width: '100%',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    gap: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsSurface: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 3,
  },
  infoLabel: {
    fontSize: 13,
    letterSpacing: 0.15,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  preferenceCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  preferenceHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  preferenceRow: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  preferenceLabel: {
    flex: 1,
    fontWeight: '600',
  },
  preferenceValue: {
    marginRight: 6,
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  catList: {
    gap: 10,
  },
  catCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  catHeaderText: {
    flex: 1,
    gap: 2,
  },
  catName: {
    fontSize: 18,
    fontWeight: '800',
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  catBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  catStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  catStatPill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 2,
  },
  catStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  catStatValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  actionColumn: {
    width: '100%',
    gap: 10,
  },
});
