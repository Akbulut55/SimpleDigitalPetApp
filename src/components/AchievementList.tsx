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
        <View key={item.id} style={styles.achievementRowWrap}>
          <View style={[styles.iconCircle, item.unlocked ? styles.iconOpen : styles.iconLocked]}>
            <Text style={[styles.iconText, item.unlocked ? styles.iconTextOpen : styles.iconTextLocked]}>
              {item.unlocked ? 'OK' : '...'}
            </Text>
          </View>
          <View style={styles.textColumn}>
            <Text
              style={[
                styles.achievementTitle,
                item.unlocked ? styles.achievementTitleOpen : styles.achievementTitleClosed,
              ]}
            >
              {item.title}
            </Text>
            {item.unlocked ? <Text style={styles.achievementDesc}>{item.description}</Text> : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  achievementList: {
    width: '100%',
    maxHeight: 198,
  },
  achievementRowWrap: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    padding: 11,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconOpen: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  iconLocked: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  iconText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconTextOpen: {
    color: '#166534',
  },
  iconTextLocked: {
    color: '#64748b',
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  achievementTitleOpen: {
    color: '#0f172a',
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

