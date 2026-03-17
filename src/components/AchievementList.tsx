import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Achievement } from '../types/pet';

type AchievementListProps = {
  items: Achievement[];
};

export const AchievementList = ({ items }: AchievementListProps) => {
  return (
    <ScrollView style={styles.achievementList} nestedScrollEnabled>
      {items.map(item => (
        <View
          key={item.id}
          style={[styles.achievementItem, item.unlocked ? styles.achievementOpen : styles.achievementLocked]}
        >
          <Text style={[styles.achievementTitle, item.unlocked ? styles.achievementTitleOpen : styles.achievementTitleClosed]}>
            {item.title}
          </Text>
          <Text style={styles.achievementDesc}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  achievementList: {
    width: '100%',
    maxHeight: 180,
    marginBottom: 10,
  },
  achievementItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  achievementOpen: {
    borderColor: '#4ade80',
    backgroundColor: '#f0fdf4',
  },
  achievementLocked: {
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  achievementTitleOpen: {
    color: '#065f46',
  },
  achievementTitleClosed: {
    color: '#334155',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
});
