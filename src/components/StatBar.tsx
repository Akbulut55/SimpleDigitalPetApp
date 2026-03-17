import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatBarProps = {
  label: string;
  value: number;
  fillColor?: string;
};

export const StatBar = ({ label, value, fillColor = '#0ea5e9' }: StatBarProps) => {
  return (
    <View style={styles.statWrap}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${value}%`, backgroundColor: fillColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statWrap: {
    width: '100%',
    marginBottom: 10,
  },
  statHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statValue: {
    fontWeight: '700',
    color: '#0f172a',
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
});
