import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPalette } from '../types/pet';

type StatBarProps = {
  label: string;
  value: number;
  fillColor?: string;
  palette: AppPalette;
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export const StatBar = ({ label, value, fillColor = '#0ea5e9', palette }: StatBarProps) => {
  const safeValue = clamp(value);

  return (
    <View style={styles.statWrap}>
      <View style={styles.statHeader}>
        <Text style={[styles.statLabel, { color: palette.text }]}>{label}</Text>
        <Text style={[styles.statValue, { color: palette.text }]}>{safeValue}</Text>
      </View>
      <View style={[styles.statTrack, { backgroundColor: palette.mutedTrack }]}> 
        <View style={[styles.statGlow, { backgroundColor: palette.surfaceHighlight }]}> 
          <View style={[styles.statFill, { width: `${safeValue}%`, backgroundColor: fillColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statWrap: {
    width: '100%',
    marginBottom: 12,
  },
  statHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  statTrack: {
    height: 12,
    borderRadius: 999,
    padding: 2,
  },
  statGlow: {
    borderRadius: 999,
    height: '100%',
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.45)',
  },
});
