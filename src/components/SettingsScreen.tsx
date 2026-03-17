import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from './ActionButton';

type SettingsScreenProps = {
  coins: number;
  onBack: () => void;
  onResetProgress: () => void;
};

export const SettingsScreen = ({ coins, onBack, onResetProgress }: SettingsScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage app progress and game rules.</Text>

      <View style={styles.card}>
        <Text style={styles.infoLabel}>Current Coins</Text>
        <Text style={styles.infoValue}>{coins}</Text>
      </View>

      <ActionButton title="Reset Progress" color="#dc2626" onPress={onResetProgress} />
      <ActionButton title="Back to Pet" color="#0f766e" onPress={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    color: '#475569',
    marginBottom: 4,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    letterSpacing: 0.8,
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
  },
});
