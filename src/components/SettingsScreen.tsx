import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { AppPalette } from '../types/pet';
import { ActionButton } from './ActionButton';

type CatVariantOption = {
  id: string;
  name: string;
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
  catVariants: CatVariantOption[];
  selectedCatVariant: string;
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
  catVariants,
  selectedCatVariant,
  onSelectCatVariant,
}: SettingsScreenProps) => {
  const isDark = palette.text === '#f8fafc';

  return (
    <View style={styles.container}>
      <View style={[styles.headerCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.title, { color: palette.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Manage progress and keep your game experience polished.</Text>
      </View>

      <View style={[styles.statsSurface, { borderColor: palette.panelBorder, backgroundColor: palette.surfaceAlt }]}> 
        <Text style={[styles.infoLabel, { color: palette.textMuted }]}>Current Coins</Text>
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
          <Text style={[styles.preferenceValue, { color: palette.textMuted }]}> 
            {isDarkMode ? 'On' : 'Off'}
          </Text>
          <Switch value={isDarkMode} onValueChange={onToggleDarkMode} trackColor={{ false: '#94a3b8', true: '#1d4ed8' }} />
        </TouchableOpacity>
      </View>

      <View style={[styles.preferenceCard, { borderColor: palette.panelBorder, backgroundColor: palette.surface }]}> 
        <Text style={[styles.preferenceTitle, { color: palette.text }]}>Cat Variant</Text>
        <Text style={[styles.preferenceHint, { color: palette.textMuted }]}>Choose a skin for your pet.</Text>
        <View style={styles.variantGrid}>
          {catVariants.map(variant => {
            const isSelected = variant.id === selectedCatVariant;

            return (
              <TouchableOpacity
                key={variant.id}
                style={[
                  styles.variantPill,
                  {
                    borderColor: isSelected ? '#2563eb' : palette.panelBorder,
                    backgroundColor: isSelected ? '#2563eb15' : palette.surfaceAlt,
                  },
                ]}
                onPress={() => onSelectCatVariant(variant.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.variantLabel, { color: isSelected ? '#2563eb' : palette.text }]}>
                  {variant.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.actionColumn}>
        <ActionButton
          title="Rename Pet"
          color="#0f766e"
          onPress={onRename}
          isDarkMode={isDark}
        />
        <ActionButton
          title="Add 100 Coins (Test)"
          color="#2563eb"
          onPress={onAddTestCoins}
          isDarkMode={isDark}
        />
        <ActionButton title="Reset Progress" color="#dc2626" onPress={onResetProgress} isDarkMode={isDark} />
        <ActionButton title="Back to Pet" color="#334155" onPress={onBack} isDarkMode={isDark} />
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
    paddingVertical: 14,
    borderWidth: 1,
    gap: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
  },
  statsSurface: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 2,
  },
  infoLabel: {
    fontSize: 13,
    letterSpacing: 0.15,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
  },
  preferenceCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  preferenceHint: {
    fontSize: 11,
    marginBottom: 2,
  },
  preferenceRow: {
    borderRadius: 12,
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
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  variantLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionColumn: {
    width: '100%',
    gap: 10,
  },
});
